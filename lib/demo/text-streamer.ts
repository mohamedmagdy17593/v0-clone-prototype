// Non-hook utility for external state management of text streaming
export function createTextStreamer(text: string, speed = 50) {
  const words = text.split(/(\s+)/).filter(Boolean)
  let index = 0

  return {
    words,
    getNext: () => {
      if (index < words.length) {
        index++
        return words.slice(0, index).join('')
      }
      return text
    },
    getText: () => words.slice(0, index).join(''),
    isComplete: () => index >= words.length,
    reset: () => {
      index = 0
    },
    speed,
    totalWords: words.length,
    currentIndex: () => index,
  }
}
