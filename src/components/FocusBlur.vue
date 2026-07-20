<script setup lang="ts">
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

defineProps<{ compact?: boolean }>()

const hovered = ref<number | null>(null)
const links = ['@X', '@Threads', '@GitHub']
</script>

<template>
  <div class="focus-links" :class="{ compact }">
    <a
      v-for="(link, index) in links"
      :key="link"
      href="#"
      :style="{
        filter: hovered !== null && hovered !== index ? 'blur(4px)' : 'none',
        opacity: hovered !== null && hovered !== index ? .4 : 1,
        color: hovered === index ? '#3b82f6' : 'inherit',
      }"
      @mouseenter="hovered = index"
      @mouseleave="hovered = null"
      @click.prevent
    >
      <span>{{ link }}</span>
      <AnimatePresence>
        <motion.span
          v-if="hovered === index"
          class="focus-bracket"
          :initial="{ opacity: 0, scale: 1.3 }"
          :animate="{ opacity: 1, scale: 1.1 }"
          :exit="{ opacity: 0, scale: 1.3 }"
          :transition="{ type: 'spring', stiffness: 350, damping: 20 }"
        />
      </AnimatePresence>
    </a>
  </div>
</template>
