"use client"

import { motion } from "framer-motion"
import CodeWords from "@/components/icons/code-words"

export function AnimatedLogo() {
  return (
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{
        type: "spring",
        stiffness: 8,
        damping: 2.5,
      }}
    >
      <CodeWords />
    </motion.div>
  )
}
