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
let touchTimer: number | undefined

const compact = computed(() => props.layoutMode === 'matrix')
const light = computed(() => props.theme === 'light')
const showSecond = computed(() => hovered.value || interacted.value)
const foreground = computed(() => light.value ? '#000' : '#e3e3e3')
const secondColor = computed(() => props.config.accent || foreground.value)

function enter() {
  if (typeof window === 'undefined' || window.matchMedia('(hover: hover)').matches) hovered.value = true
  if (props.config.persistent) interacted.value = true
}

function leave() {
  if (typeof window === 'undefined' || window.matchMedia('(hover: hover)').matches) hovered.value = false
  if (props.config.interactionType === 'magnetic') mouse.value = { x: 0, y: 0 }
  if (interacted.value) {
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => (interacted.value = false), 500)
  }
}

function touchStart() {
  window.clearTimeout(touchTimer)
  hovered.value = true
  if (props.config.persistent) interacted.value = true
}

function touchEnd() {
  window.clearTimeout(touchTimer)
  touchTimer = window.setTimeout(() => {
    hovered.value = false
    if (interacted.value) {
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => (interacted.value = false), 500)
    }
  }, 500)
}

function move(event: MouseEvent) {
  if (props.config.interactionType !== 'magnetic') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  mouse.value = {
    x: (event.clientX - rect.left - rect.width / 2) * 0.35,
    y: (event.clientY - rect.top - rect.height / 2) * 0.35,
  }
}

const buttonAnimate = computed(() => ({
  paddingLeft: compact.value ? 0 : hovered.value ? 28 : 24,
  paddingRight: compact.value ? 0 : hovered.value ? 28 : 24,
  x: hovered.value && props.config.interactionType === 'magnetic' ? mouse.value.x : 0,
  y: hovered.value && props.config.interactionType === 'magnetic' ? mouse.value.y : 0,
  backgroundColor: light.value
    ? interacted.value && props.config.id === '4'
      ? 'rgba(0,0,0,.08)'
      : hovered.value ? 'rgba(0,0,0,.06)' : 'rgba(0,0,0,.04)'
    : interacted.value && props.config.id === '4'
      ? 'rgba(255,255,255,.08)'
      : hovered.value ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.04)',
}))
</script>

<template>
  <FocusBlur v-if="config.interactionType === 'focus-blur'" :compact="compact" />

  <motion.button
    v-else
    layout
    class="micro-button"
    :class="[{ compact }, `type-${config.interactionType}`]"
    :animate="buttonAnimate"
    :transition="{ type: 'spring', stiffness: 500, damping: 25 }"
    :whileHover="{ scale: 1.02 }"
    :whilePress="{ scale: 0.96 }"
    @mouseenter="enter"
    @mousemove="move"
    @mouseleave="leave"
    @focus="enter"
    @blur="leave"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <motion.span layout class="button-content" :transition="{ type: 'spring', stiffness: 500, damping: 25 }">
      <template v-if="config.interactionType === 'slide-arrow'">
        <AnimatePresence mode="popLayout">
          <motion.span
            v-if="!hovered"
            key="lead"
            layout
            class="icon-slot slide-lead"
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
            class="icon-slot slide-trail"
            :initial="{ opacity: 0, x: 10 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: 10 }"
            :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
          ><component :is="config.icon2" :size="16" /></motion.span>
        </AnimatePresence>
      </template>

      <template v-else-if="config.interactionType === 'sparkle'">
        <span class="icon-stack">
          <AnimatePresence mode="popLayout" :initial="false">
            <motion.span
              v-if="!hovered"
              key="sparkle-first"
              class="icon-layer"
              :initial="{ y: -15, opacity: 0, scale: .8 }"
              :animate="{ y: 0, opacity: 1, scale: 1 }"
              :exit="{ y: -15, opacity: 0, scale: .8 }"
              :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
            ><component :is="config.icon1" :size="16" /></motion.span>
            <motion.span
              v-else
              key="sparkle-second"
              class="icon-layer"
              :style="{ color: secondColor }"
              :initial="{ y: 15, opacity: 0, scale: .8 }"
              :animate="{ y: 0, opacity: 1, scale: 1 }"
              :exit="{ y: 15, opacity: 0, scale: .8 }"
              :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
            >
              <component :is="config.icon2" :size="16" />
              <motion.svg class="sparkle sparkle-one" viewBox="0 0 24 24" fill="currentColor" :initial="{ opacity: 0, scale: 0, rotate: -45, y: 10 }" :animate="{ opacity: 1, scale: 1, rotate: 0, y: 0 }" :exit="{ opacity: 0, scale: 0, rotate: 45, y: 10 }" :transition="{ type: 'spring', stiffness: 600, damping: 25, delay: .05 }"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" /></motion.svg>
              <motion.svg class="sparkle sparkle-two" viewBox="0 0 24 24" fill="currentColor" :initial="{ opacity: 0, scale: 0, rotate: 45, x: 10 }" :animate="{ opacity: 1, scale: 1, rotate: 0, x: 0 }" :exit="{ opacity: 0, scale: 0, rotate: -45, x: 10 }" :transition="{ type: 'spring', stiffness: 600, damping: 25, delay: .1 }"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" /></motion.svg>
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.span v-if="!compact" layout class="button-label separated">{{ config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'morph' || config.interactionType === 'color-morph'">
        <span class="icon-stack">
          <AnimatePresence mode="popLayout" :initial="false">
            <motion.span
              v-if="!showSecond || !config.icon2"
              key="morph-first"
              class="icon-layer"
              :initial="{ scale: .5, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :exit="{ scale: .5, opacity: 0 }"
              :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
            ><component :is="config.icon1" :size="16" /></motion.span>
            <motion.span
              v-else
              key="morph-second"
              class="icon-layer"
              :style="{ color: secondColor }"
              :initial="{ scale: .5, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :exit="{ scale: .5, opacity: 0 }"
              :transition="{ type: 'spring', stiffness: 600, damping: 25 }"
            ><component :is="config.icon2" :size="16" :fill="config.interactionType === 'color-morph' ? 'currentColor' : 'none'" /></motion.span>
          </AnimatePresence>
        </span>
        <motion.span v-if="!compact" layout class="button-label separated">{{ config.id === '4' && showSecond ? 'Copied' : config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'pulse'">
        <span class="icon-stack static-stack">
          <motion.span :animate="{ scale: hovered ? [1, 1.25, 1] : 1 }" :transition="{ duration: .4, ease: 'easeInOut' }" :style="{ color: hovered && config.accent ? config.accent : foreground }" class="icon-layer">
            <component :is="config.icon1" :size="16" :fill="hovered ? 'currentColor' : 'none'" />
          </motion.span>
        </span>
        <motion.span v-if="!compact" layout class="button-label separated">{{ config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'rotate'">
        <span class="icon-stack static-stack"><motion.span class="icon-layer" :animate="{ rotate: hovered ? 180 : 0 }" :transition="{ type: 'spring', stiffness: 400, damping: 25 }"><component :is="config.icon1" :size="16" /></motion.span></span>
        <motion.span v-if="!compact" layout class="button-label separated">{{ config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'shake'">
        <span class="icon-stack static-stack"><motion.span class="icon-layer" :style="{ color: hovered && config.accent ? config.accent : foreground }" :animate="{ y: hovered ? [0, -2, 0, -2, 0] : 0, rotate: hovered ? [0, -10, 10, -10, 0] : 0 }" :transition="{ duration: .4 }"><component :is="config.icon1" :size="16" /></motion.span></span>
        <motion.span v-if="!compact" layout class="button-label separated color-transition" :style="{ color: hovered && config.accent ? config.accent : foreground }">{{ config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'ring'">
        <span class="icon-stack">
          <AnimatePresence mode="popLayout" :initial="false">
            <motion.span v-if="!hovered" key="ring-first" class="icon-layer" :initial="{ rotate: -15, scale: .8, opacity: 0 }" :animate="{ rotate: 0, scale: 1, opacity: 1 }" :exit="{ rotate: 15, scale: .8, opacity: 0 }" :transition="{ type: 'spring', stiffness: 600, damping: 25 }"><component :is="config.icon1" :size="16" /></motion.span>
            <motion.span v-else key="ring-second" class="icon-layer" :style="{ color: secondColor }" :initial="{ rotate: -15, scale: .8, opacity: 0 }" :animate="{ rotate: 0, scale: 1, opacity: 1 }" :exit="{ rotate: 15, scale: .8, opacity: 0 }" :transition="{ type: 'spring', stiffness: 600, damping: 25 }">
              <component :is="config.icon2" :size="16" />
              <motion.span class="notification-dot" :initial="{ scale: 0 }" :animate="{ scale: 1 }" :transition="{ type: 'spring', stiffness: 600, damping: 15, delay: .1 }" />
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.span v-if="!compact" layout class="button-label separated">{{ config.label }}</motion.span>
      </template>

      <template v-else-if="config.interactionType === 'glare'">
        <component :is="config.icon1" :size="16" class="glare-icon" />
        <span v-if="!compact" class="button-label">{{ config.label }}</span>
        <motion.span class="glare" :style="{ background: light ? 'linear-gradient(90deg,transparent,rgba(0,0,0,.12),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)' }" :animate="{ x: hovered ? ['-150%', '150%'] : '-150%' }" :transition="{ duration: .85, ease: 'easeInOut', repeat: hovered ? Infinity : 0, repeatDelay: 1 }" />
      </template>

      <template v-else-if="config.interactionType === 'text-reveal'">
        <span class="icon-stack static-stack text-icon"><motion.span class="icon-layer" :animate="{ rotate: hovered ? 45 : 0 }" :transition="{ type: 'spring', stiffness: 400, damping: 25 }"><component :is="config.icon1" :size="16" /></motion.span></span>
        <span v-if="!compact" class="reveal-window"><motion.span class="reveal-track" :animate="{ y: hovered ? -18 : 0 }" :transition="{ type: 'spring', stiffness: 400, damping: 25 }"><span>{{ config.label }}</span><span>{{ config.label }}</span></motion.span></span>
      </template>

      <template v-else-if="config.interactionType === 'magnetic'">
        <component :is="config.icon1" :size="16" class="magnetic-icon" />
        <span v-if="!compact" class="button-label">{{ config.label }}</span>
      </template>

      <template v-else-if="config.interactionType === 'expand-ring'">
        <span class="icon-stack static-stack"><motion.span class="icon-layer" :animate="{ scale: hovered ? 1.1 : 1 }" :transition="{ type: 'spring', stiffness: 400, damping: 20 }"><component :is="config.icon1" :size="16" /></motion.span></span>
        <span v-if="!compact" class="button-label separated">{{ config.label }}</span>
        <AnimatePresence>
          <motion.span v-if="hovered" key="expand-ring" class="expanding-ring" :initial="{ opacity: 1, scale: 1 }" :animate="{ opacity: 0, scale: 1.15 }" :exit="{ opacity: 0 }" :transition="{ duration: .6, ease: 'easeOut' }" />
        </AnimatePresence>
      </template>
    </motion.span>
  </motion.button>
</template>
