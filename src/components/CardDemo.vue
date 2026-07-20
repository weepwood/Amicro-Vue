<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { motion } from 'motion-v'
import type { CardConfig } from '../data/cards'

const props = defineProps<{ config: CardConfig; theme: 'dark' | 'light' }>()
const hovered = ref(false)
const active = ref(2)
const count = computed(() => props.config.interactionType === 'arc-7' ? 7 : 5)
const cards = computed(() => Array.from({ length: count.value }, (_, index) => index))
const carouselMode = computed(() => props.config.category === 'carousels')

function spreadTransform(index: number) {
  const center = (count.value - 1) / 2
  const distance = index - center
  const open = hovered.value
  let x = 0, y = 0, rotate = 0, scale = 1, z = 0

  switch (props.config.interactionType) {
    case 'arc-5':
    case 'arc-7':
      x = open ? distance * (props.config.interactionType === 'arc-7' ? 28 : 35) : 0
      rotate = open ? distance * (props.config.interactionType === 'arc-7' ? 8 : 14) : 0
      y = open ? Math.pow(distance, 2) * 5 - 11 : 0
      scale = open && distance === 0 ? 1.05 : 1
      break
    case 'long-arc':
      x = open ? distance * 48 : 0
      rotate = open ? distance * 11 : 0
      y = open ? Math.pow(distance, 2) * 5 - 12 : 0
      break
    case 'linear': x = open ? distance * 39 : 0; break
    case 'corner-fan':
      x = open ? index * 23 - 42 : 0
      y = open ? -index * 8 + 18 : 0
      rotate = open ? index * 12 - 24 : 0
      break
    case 'stamp-arc':
      x = open ? distance * 37 : 0
      rotate = open ? distance * 13 : 0
      y = open ? Math.pow(distance, 2) * 5 - 12 : 0
      break
    case 'cascade':
      x = open ? distance * 26 : 0
      y = open ? distance * 17 : 0
      rotate = open ? distance * 4 : 0
      break
    case 'scatter': {
      const positions = [
        { x: -68, y: 18, r: -17 }, { x: -35, y: -10, r: -8 }, { x: 0, y: 4, r: 3 },
        { x: 34, y: -15, r: 10 }, { x: 66, y: 13, r: 17 },
      ]
      const p = positions[index] ?? positions[0]
      x = open ? p.x : 0; y = open ? p.y : 0; rotate = open ? p.r : 0
      break
    }
    case 'wheel':
      rotate = open ? distance * 17 : 0
      x = open ? distance * 30 : 0
      y = open ? Math.abs(distance) * 8 : 0
      break
  }
  return { x, y, rotate, scale, z }
}

function carouselTransform(index: number) {
  const raw = index - active.value
  if (props.config.interactionType === 'carousel') {
    return { x: raw * 64, y: Math.abs(raw) * 9, rotate: raw * 7, rotateY: raw * -12, scale: raw === 0 ? 1 : .78, opacity: Math.abs(raw) > 2 ? 0 : 1, z: -Math.abs(raw) * 35 }
  }
  if (props.config.interactionType === 'coverflow') {
    return { x: raw * 72, y: 0, rotateY: raw * -42, rotate: 0, scale: raw === 0 ? 1 : .76, opacity: Math.abs(raw) > 2 ? 0 : .82, z: -Math.abs(raw) * 80 }
  }
  return { x: raw * 9, y: raw * -7, rotateY: raw * -3, rotate: raw * -1.5, scale: 1 - Math.abs(raw) * .08, opacity: raw < 0 || raw > 4 ? 0 : 1, z: -raw * 54 }
}

function previous() { active.value = (active.value - 1 + 5) % 5 }
function next() { active.value = (active.value + 1) % 5 }
</script>

<template>
  <div class="card-demo" :class="[`card-${config.interactionType}`, { 'is-carousel': carouselMode }]" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div class="card-stage">
      <motion.div
        v-for="index in cards"
        :key="index"
        class="demo-card"
        :class="{ stamp: config.interactionType === 'stamp-arc', active: carouselMode && index === active }"
        :animate="carouselMode ? carouselTransform(index) : spreadTransform(index)"
        :transition="{
          type: 'spring', stiffness: carouselMode ? 260 : 190, damping: carouselMode ? 27 : 21,
          mass: .78, delay: config.interactionType === 'cascade' && hovered ? index * .035 : 0,
        }"
        :style="{ zIndex: carouselMode ? 20 - Math.abs(index - active) : 10 - Math.abs(index - (count - 1) / 2) }"
      >
        <span class="card-number">0{{ index + 1 }}</span>
        <span class="card-line" /><span class="card-line short" />
      </motion.div>
    </div>

    <div v-if="carouselMode" class="carousel-controls">
      <button aria-label="Previous card" @click="previous"><ChevronLeft :size="15" /></button>
      <span class="dots"><i v-for="index in 5" :key="index" :class="{ active: index - 1 === active }" @click="active = index - 1" /></span>
      <button aria-label="Next card" @click="next"><ChevronRight :size="15" /></button>
    </div>
  </div>
</template>
