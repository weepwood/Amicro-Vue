<script setup lang="ts">
import { computed, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import type { ButtonConfig } from '../data/buttons'
import FocusBlur from './FocusBlur.vue'

const props = defineProps<{
  config: ButtonConfig
  layoutMode: 'list' | 'grid' | 'matrix'
  theme: 'dark' | 'light'
}>()

const hovered = ref(false)
const interacted = ref(false)
const mouse = ref({ x: 0, y: 0 })
let resetTimer: number | undefined

const compact = computed(() => props.layoutMode === 'matrix')
const showSecond = computed(() => hovered.value || interacted.value)
const iconColor = computed(() => showSecond.value && props.config.accent ? props.config.accent : 'currentColor')
const isMorph = computed(() => ['morph', 'color-morph', 'ring', 'sparkle'].includes(props.config.interactionType))

function enter() {
  hovered.value = true
  if (props.config.persistent) interacted.value = true
}

function leave() {
  hovered.value = false
  mouse.value = { x: 0, y: 0 }
  if (props.config.persistent) {
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => (interacted.value = false), 520)
  }
}

function move(event: MouseEvent) {
  if (props.config.interactionType !== 'magnetic') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  mouse.value = {
    x: (event.clientX - rect.left - rect.width / 2) * 0.32,
    y: (event.clientY - rect.top - rect.height / 2) * 0.32,
  }
}

const buttonAnimate = computed(() => ({
  x: props.config.interactionType === 'magnetic' ? mouse.value.x : 0,
  y: props.config.interactionType === 'magnetic' ? mouse.value.y : 0,
  backgroundColor: props.theme === 'dark'
    ? hovered.value ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.045)'
    : hovered.value ? 'rgba(0,0,0,.085)' : 'rgba(0,0,0,.045)',
}))

const primaryMotion = computed(() => {
  switch (props.config.interactionType) {
    case 'rotate': return { rotate: hovered.value ? 180 : 0 }
    case 'pulse': return { scale: hovered.value ? [1, 1.3, 1] : 1 }
    case 'shake': return { rotate: hovered.value ? [0, -10, 10, -8, 8, 0] : 0, y: hovered.value ? [0, -2, 0, -2, 0] : 0 }
    case 'text-reveal': return { rotate: hovered.value ? 45 : 0 }
    default: return { scale: hovered.value ? 1.04 : 1 }
  }
})
</script>

<template>
  <FocusBlur v-if="config.interactionType === 'focus-blur'" />

  <motion.button
    v-else
    layout
    class="micro-button"
    :class="[{ compact }, `type-${config.interactionType}`]"
    :animate="buttonAnimate"
    :transition="{ type: 'spring', stiffness: 500, damping: 25, mass: 0.75 }"
    :whileHover="{ scale: 1.02 }"
    :whilePress="{ scale: 0.96 }"
    @mouseenter="enter"
    @mouseleave="leave"
    @mousemove="move"
    @focus="enter"
    @blur="leave"
    @touchstart.passive="enter"
    @touchend.passive="leave"
  >
    <span v-if="config.interactionType === 'glare'" class="glare" :class="{ active: hovered }" />
    <span v-if="config.interactionType === 'expand-ring' && hovered" class="expanding-ring" />

    <template v-if="config.interactionType === 'slide-arrow'">
      <AnimatePresence mode="popLayout">
        <motion.span
          v-if="!hovered"
          key="lead"
          layout
          class="icon-slot"
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :exit="{ opacity: 0, x: -10 }"
          :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
        ><component :is="config.icon1" :size="16" /></motion.span>
      </AnimatePresence>
      <motion.span v-if="!compact" layout class="button-label">{{ config.label }}</motion.span>
      <AnimatePresence mode="popLayout">
        <motion.span
          v-if="hovered && config.icon2"
          key="trail"
          layout
          class="icon-slot"
          :initial="{ opacity: 0, x: 10 }"
          :animate="{ opacity: 1, x: 0 }"
          :exit="{ opacity: 0, x: 10 }"
          :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
        ><component :is="config.icon2" :size="16" /></motion.span>
      </AnimatePresence>
    </template>

    <template v-else-if="isMorph">
      <span class="icon-stack">
        <AnimatePresence mode="popLayout" :initial="false">
          <motion.span
            v-if="!showSecond || !config.icon2"
            key="first"
            class="icon-layer"
            :initial="{ opacity: 0, scale: .55, rotate: -12 }"
            :animate="{ opacity: 1, scale: 1, rotate: 0 }"
            :exit="{ opacity: 0, scale: .55, rotate: 12 }"
            :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
          ><component :is="config.icon1" :size="16" /></motion.span>
          <motion.span
            v-else
            key="second"
            class="icon-layer"
            :style="{ color: iconColor }"
            :initial="{ opacity: 0, scale: .55, rotate: -12, y: config.interactionType === 'sparkle' ? 8 : 0 }"
            :animate="{ opacity: 1, scale: 1, rotate: 0, y: 0 }"
            :exit="{ opacity: 0, scale: .55, rotate: 12 }"
            :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
          >
            <component :is="config.icon2" :size="16" :fill="config.interactionType === 'color-morph' ? 'currentColor' : 'none'" />
            <span v-if="config.interactionType === 'ring'" class="notification-dot" />
            <span v-if="config.interactionType === 'sparkle'" class="sparkle sparkle-one">✦</span>
            <span v-if="config.interactionType === 'sparkle'" class="sparkle sparkle-two">✦</span>
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span v-if="!compact" layout class="button-label">{{ interacted && config.id === '4' ? 'Copied' : config.label }}</motion.span>
    </template>

    <template v-else-if="config.interactionType === 'text-reveal'">
      <motion.span class="icon-slot" :animate="primaryMotion" :transition="{ type: 'spring', stiffness: 420, damping: 25 }">
        <component :is="config.icon1" :size="16" />
      </motion.span>
      <span v-if="!compact" class="reveal-window">
        <motion.span :animate="{ y: hovered ? -18 : 0 }" :transition="{ type: 'spring', stiffness: 420, damping: 25 }" class="reveal-track">
          <span>{{ config.label }}</span><span>{{ config.label }}</span>
        </motion.span>
      </span>
    </template>

    <template v-else>
      <motion.span
        class="icon-slot"
        :style="{ color: hovered && config.accent ? config.accent : 'currentColor' }"
        :animate="primaryMotion"
        :transition="config.interactionType === 'pulse' || config.interactionType === 'shake'
          ? { duration: .42, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 420, damping: 25 }"
      ><component :is="config.icon1" :size="16" :fill="config.interactionType === 'pulse' && hovered ? 'currentColor' : 'none'" /></motion.span>
      <span v-if="!compact" class="button-label" :style="{ color: config.interactionType === 'shake' && hovered ? config.accent : undefined }">{{ config.label }}</span>
    </template>
  </motion.button>
</template>
