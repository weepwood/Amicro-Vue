import type { ButtonConfig } from '../data/buttons'
import type { CardConfig } from '../data/cards'

export function getButtonCode(config: ButtonConfig) {
  return `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { motion, AnimatePresence } from 'motion-v'\nimport { Star as IconBefore, Check as IconAfter } from '@lucide/vue'\n\nconst hovered = ref(false)\n<\/script>\n\n<template>\n  <motion.button\n    layout\n    :whileHover="{ scale: 1.02 }"\n    :whilePress="{ scale: 0.96 }"\n    :transition="{ type: 'spring', stiffness: 500, damping: 25 }"\n    @hoverStart="hovered = true"\n    @hoverEnd="hovered = false"\n  >\n    <AnimatePresence mode="popLayout">\n      <motion.span\n        :key="hovered ? 'after' : 'before'"\n        :initial="{ opacity: 0, scale: .6 }"\n        :animate="{ opacity: 1, scale: 1 }"\n        :exit="{ opacity: 0, scale: .6 }"\n      >\n        <component :is="hovered ? IconAfter : IconBefore" />\n      </motion.span>\n    </AnimatePresence>\n    <span>${config.label}</span>\n  </motion.button>\n</template>`
}

export function getCardCode(config: CardConfig) {
  return `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { motion } from 'motion-v'\n\nconst open = ref(false)\nconst cards = [0, 1, 2, 3, 4]\nconst transform = (index: number) => {\n  const distance = index - 2\n  return {\n    x: open.value ? distance * 35 : 0,\n    y: open.value ? distance * distance * 5 - 11 : 0,\n    rotate: open.value ? distance * 14 : 0,\n  }\n}\n<\/script>\n\n<template>\n  <div @mouseenter="open = true" @mouseleave="open = false">\n    <motion.div\n      v-for="index in cards"\n      :key="index"\n      :animate="transform(index)"\n      :transition="{ type: 'spring', stiffness: 190, damping: 21 }"\n    />\n  </div>\n</template>\n\n<!-- ${config.label}: ${config.description} -->`
}

export const themeToggleCode = `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { motion } from 'motion-v'\nconst dark = ref(true)\n<\/script>\n<template>\n  <motion.button :whilePress="{ scale: .9 }" @click="dark = !dark">Toggle theme</motion.button>\n</template>`
