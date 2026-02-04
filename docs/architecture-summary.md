# CodeWords UI Generator - Architecture Summary

A v0-style system where users generate UI via chat, connect to CodeWords workflows, and deploy instantly.

---

## User Journey

```mermaid
journey
    title User Creates & Deploys a UI
    section Start
      Open app: 5: User
      Pick template: 4: User
      See editor + preview: 5: User
    section Build UI
      Type prompt in chat: 5: User
      @mention workflow: 4: User
      Watch code stream live: 5: User, System
      See preview update: 5: User
    section Iterate
      Request changes: 5: User
      Queue more messages: 4: User
      Auto-fix build errors: 3: System
    section Share
      Set visibility: 4: User
      Share link: 5: User
      Team uses the app: 5: Team
```

---

## System Architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        Chat[Chat UI]
        Queue[Message Queue]
        Monaco[Monaco Editor]
        Preview[iframe Preview]
    end

    subgraph API["Next.js API"]
        ChatAPI["/api/chat"]
        BuildAPI["/api/build"]
        WorkflowAPI["/api/workflow/:id"]
        StateAPI["/api/project/state"]
    end

    subgraph External["External Services"]
        LLM[Claude/GPT]
        CWAuth[CodeWords Auth]
        CWWorkflows[CodeWords Workflows]
        Vercel[Vercel Deploy]
    end

    subgraph Storage["Storage"]
        S3[(S3 - Files)]
        DB[(PostgreSQL)]
    end

    Chat --> Queue --> ChatAPI
    ChatAPI <--> LLM
    ChatAPI --> Monaco
    ChatAPI --> S3
    ChatAPI --> BuildAPI
    BuildAPI --> Vercel
    Vercel --> Preview
    Preview <--> WorkflowAPI
    WorkflowAPI <--> CWWorkflows
    Client <--> CWAuth
    StateAPI <--> DB
```

---

## Code Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as useChat
    participant API as /api/chat
    participant LLM as Claude/GPT
    participant E as Editor
    participant B as Build
    participant V as Vercel

    U->>C: Send message
    Note over C: Queue if busy
    C->>API: POST message
    API->>LLM: streamText()

    loop Each Operation
        LLM-->>API: <edit>/<create>/<delete>
        API-->>C: StreamData: {type: 'operation'}
        C->>E: Update in real-time
    end

    API-->>C: StreamData: {type: 'build_started'}
    API->>B: Trigger build

    alt Build Fails
        B-->>API: Error
        API->>LLM: Feed error
        Note over API,LLM: Retry up to 3x
    end

    B->>V: Deploy
    API-->>C: StreamData: {type: 'deployed', previewUrl}
```

**Streaming via Vercel AI SDK** — `useChat` + `StreamData` sends text and operations in one connection.

### StreamData Events

| Event | When |
|-------|------|
| `{type: 'operation', file, op}` | File created/edited/deleted |
| `{type: 'operation_error'}` | Pattern not found |
| `{type: 'build_started'}` | Build triggered |
| `{type: 'build_failed'}` | Build error |
| `{type: 'deployed', previewUrl}` | Preview ready |

### Client Usage

```tsx
const { messages, data } = useChat({ api: '/api/chat' });

useEffect(() => {
  const latest = data?.[data.length - 1];
  if (latest?.type === 'operation') updateEditor(latest.file);
  if (latest?.type === 'deployed') setPreviewUrl(latest.previewUrl);
}, [data]);
```

---

## LLM Output Format

The LLM outputs **operations**, not full files:

```xml
<!-- Create -->
<create file="src/components/Button.tsx">
export function Button() { ... }
</create>

<!-- Edit (search/replace) -->
<edit file="src/page.tsx">
<search>old code here</search>
<replace>new code here</replace>
</edit>

<!-- Delete -->
<delete file="src/old-file.ts" />
```

**Why?** Smaller payloads, preserves manual edits, precise changes.

---

## Project State Machine

```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> STREAMING: User sends message

    STREAMING --> BUILDING: Stream complete
    STREAMING --> STREAM_ERROR: Error
    STREAMING --> INTERRUPTED: Connection lost

    BUILDING --> DEPLOYED: Build + security pass
    BUILDING --> BUILD_FAILED: Build error

    BUILD_FAILED --> STREAMING: Auto-fix (max 3x)
    BUILD_FAILED --> IDLE: User reverts

    DEPLOYED --> NEEDS_FIX: Runtime error
    NEEDS_FIX --> STREAMING: Fix in chat

    INTERRUPTED --> STREAMING: Retry
    INTERRUPTED --> IDLE: Discard

    DEPLOYED --> IDLE: Done
```

**State persists to DB** — users can recover on next visit.

---

## Build & Security Pipeline

```mermaid
flowchart LR
    subgraph Build["Build Phase"]
        B1[Save to S3]
        B2{Changed files?}
        B3[Incremental 3-8s]
        B4[Full rebuild 15-30s]
    end

    subgraph Security["Security Gate"]
        S1[Semgrep scan]
        S2[npm audit]
        S3[LLM review]
        S4{Issues?}
    end

    subgraph Deploy["Deploy"]
        D1[Vercel]
        D2[CSP headers]
        D3[Preview URL]
    end

    B1 --> B2
    B2 -->|src only| B3
    B2 -->|package.json| B4
    B3 --> S1
    B4 --> S1
    S1 --> S2 --> S3 --> S4
    S4 -->|Critical| BLOCK[Block + Contact Support]
    S4 -->|Medium/Low| WARN[Warn + Deploy Anyway?]
    S4 -->|None| D1
    WARN -->|Yes| D1
    D1 --> D2 --> D3
```

| Severity | Action |
|----------|--------|
| Critical/High | Block deploy |
| Medium/Low | Warn, allow override |

---

## @Workflow Mentions

```mermaid
flowchart LR
    A["User types @cv_reviewer"] --> B[Autocomplete dropdown]
    B --> C[Select workflow]
    C --> D[Fetch schema]
    D --> E[Inject into LLM prompt]
    E --> F[LLM generates matching form]
```

**Schema includes:** inputs (name, type, required), outputs (name, type)

---

## Multi-Workflow & Chaining

```mermaid
flowchart TB
    subgraph Page["Generated Page"]
        Form[Upload Form]
        Step1[Step 1 Result]
        Step2[Step 2 Result]
    end

    subgraph Workflows["CodeWords Workflows"]
        W1[cv_parser]
        W2[cv_scorer]
    end

    Form -->|"Submit"| W1
    W1 -->|"parsed data"| Step1
    Step1 -->|"Auto-trigger"| W2
    W2 -->|"score + feedback"| Step2
```

**v1 approach:** UI-layer wizard (state passed between steps in React)

---

## Storage & Versioning

```mermaid
flowchart TB
    subgraph S3["S3 Bucket"]
        Current["projects/{id}/current/"]
        Blobs["projects/{id}/blobs/{hash}"]
    end

    subgraph DB["PostgreSQL"]
        Projects[projects table]
        Snapshots[snapshots table]
        Messages[messages table]
    end

    Current <-->|"Working files"| Projects
    Blobs <-->|"Content-addressable"| Snapshots
    Snapshots -->|"Undo/Redo"| Current
```

**Content-addressable:** Same content = same hash = deduplicated storage

| Action | What happens |
|--------|--------------|
| Save file | Hash content → store in blobs if new |
| Create snapshot | Record {path → hash} in DB |
| Undo | Restore blobs to current/ |

---

## Database Schema

```mermaid
erDiagram
    Project ||--o{ ProjectShare : has
    Project ||--o{ Conversation : has
    Project ||--o{ Snapshot : has
    Conversation ||--o{ Message : contains
    Template ||--o{ Project : creates
    Message ||--o| Snapshot : triggers

    Project {
        uuid id PK
        uuid user_id "CodeWords user ref"
        uuid team_id "CodeWords team ref"
        uuid template_id FK
        string name
        string s3_path
        string preview_url
        enum visibility "private|link|team|public"
        string share_token
        jsonb workflow_bindings
        jsonb state "status, queue, errors"
        timestamp created_at
        timestamp updated_at
    }

    ProjectShare {
        uuid id PK
        uuid project_id FK
        uuid shared_with_user_id "CodeWords user ref"
        uuid shared_with_team_id "CodeWords team ref"
        enum permission "view|edit"
        timestamp created_at
    }

    Template {
        uuid id PK
        string name
        string description
        string thumbnail_url
        string s3_path
        string category "form|wizard|dashboard|upload|blank"
        boolean is_system
        uuid created_by "CodeWords user ref"
        timestamp created_at
    }

    Conversation {
        uuid id PK
        uuid project_id FK
        timestamp created_at
    }

    Message {
        uuid id PK
        uuid conversation_id FK
        enum role "user|assistant|system"
        text content
        jsonb mentioned_workflows
        timestamp created_at
    }

    Snapshot {
        uuid id PK
        uuid project_id FK
        uuid message_id FK
        string label
        jsonb files "path to hash mapping"
        string preview_url
        timestamp created_at
    }
```

**Notes:**
- `user_id`, `team_id` reference CodeWords entities (not foreign keys)
- `workflow_bindings` stores multi-workflow config with triggers
- `state` stores project state machine for recovery
- `files` in Snapshot maps paths to content-addressable blob hashes

---

## Sharing & Auth

```mermaid
flowchart LR
    subgraph Visibility
        Private["Private (owner only)"]
        Link["Link (share token)"]
        Team["Team (CodeWords team)"]
        Public["Public (anyone)"]
    end

    subgraph Auth["Auth (from CodeWords)"]
        Session[Session cookie]
        Token[Share token in URL]
        TeamCheck[Team membership]
    end

    Private --> Session
    Link --> Token
    Team --> TeamCheck
    Public --> None[No auth]
```

**Auth is NOT duplicated** — reuses CodeWords users, teams, sessions.

---

## Security Layers

```mermaid
flowchart TB
    subgraph PreBuild["Pre-Build"]
        A1[Package allowlist]
        A2[No arbitrary npm]
    end

    subgraph PostBuild["Post-Build"]
        B1[Semgrep OWASP]
        B2[npm audit]
        B3[LLM security review]
    end

    subgraph Runtime["Runtime"]
        C1[Strict CSP]
        C2[Build isolation]
        C3[Workflow proxy auth]
    end

    PreBuild --> PostBuild --> Runtime
```

### CSP Policy (on all previews)
```
script-src 'self'
connect-src 'self' https://api.codewords.com
frame-ancestors 'self' https://app.codewords.com
```

### Approved Packages Only
React, Next.js, shadcn/ui, Tailwind, zod, react-hook-form, zustand, date-fns, framer-motion, etc.

**No arbitrary npm packages** — prevents supply chain attacks.

---

## Error Handling

```mermaid
flowchart TB
    subgraph Errors
        E1[Stream interrupted]
        E2[Pattern not found]
        E3[Build failed]
        E4[Runtime error]
    end

    subgraph Recovery
        R1[Retry/Discard UI]
        R2[LLM retries pattern]
        R3[Auto-fix loop 3x]
        R4[Fix in chat button]
    end

    E1 --> R1
    E2 --> R2
    E3 --> R3
    E4 --> R4
    R3 -->|Exhausted| R4
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind + shadcn/ui |
| Editor | Monaco |
| Streaming | Vercel AI SDK (`useChat` + `StreamData`) |
| Storage | S3 (files) + PostgreSQL (metadata) |
| Builds | Vercel (incremental via Turbopack) |
| Auth | CodeWords |

---

## Rate Limits

| Resource | Limit |
|----------|-------|
| Builds/project/hour | 20 |
| Chat messages/user/hour | 100 |
| Workflow calls/project/hour | 1000 |
| Deploy Anyway/day | 5 |

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Incremental build | 3-8s |
| Full rebuild | 15-30s |
| Auto-fix retries | 3 max |
| Snapshot retention | 50 per project, 30 days |
