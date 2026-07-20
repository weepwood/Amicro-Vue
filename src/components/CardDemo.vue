<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { motion } from 'motion-v'
import type { CardConfig } from '../data/cards'

const props = defineProps<{ config: CardConfig; theme: 'dark' | 'light' }>()

const assets = [
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', title: 'Sunset Beach', date: 'Today' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', title: 'Misty Mountains', date: '1d ago' },
  { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80', title: 'Forest Trail', date: '1w ago' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80', title: 'Sunlight in Woods', date: '1m ago' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', title: 'Green Hills', date: '1y ago' },
]

const hovered = ref(false)
const active = ref(2)
const timeActive = ref(0)
const hoveredTimeline = ref<number | null>(null)
const isSpread = computed(() => props.config.category === 'spreads')
const count = computed(() => props.config.interactionType === 'arc-7' ? 7 : 5)
const cards = computed(() => Array.from({ length: count.value }, (_, index) => index))
const timelineNodes = computed(() => {
  const nodes: { type: 'main' | 'sub'; index: number; date?: string }[] = []
  assets.forEach((item, index) => {
    nodes.push({ type: 'main', index, date: item.date })
    if (index < assets.length - 1) {
      nodes.push({ type: 'sub', index: index + .33 })
      nodes.push({ type: 'sub', index: index + .66 })
    }
  })
  return nodes
})

function spreadTransform(index: number) {
  const center = (count.value - 1) / 2
  const distance = index - center
  const open = hovered.value
  let x = 0
  let y = 0
  let rotate = 0
  let scale = 1

  switch (props.config.interactionType) {
    case 'arc-5':
      if (open) {
        rotate = distance * 15
        x = distance * 35
        y = Math.abs(distance) === 2 ? 10 : Math.abs(distance) === 1 ? -2 : -10
        scale = distance === 0 ? 1.05 : 1
      }
      break
    case 'arc-7':
      if (open) {
        rotate = distance * 15
        x = distance * (110 / 3)
        y = Math.abs(distance) === 3 ? 30 : Math.abs(distance) === 2 ? 9.9 : Math.abs(distance) === 1 ? -5.1 : -15
        scale = distance === 0 ? 1.05 : 1
      }
      break
    case 'long-arc':
      if (open) {
        rotate = distance * 7.5
        x = distance * 70
        y = Math.abs(distance) === 2 ? 20 : Math.abs(distance) === 1 ? 5 : -5
        scale = distance === 0 ? 1.05 : 1
      }
      break
    case 'linear':
      if (open) {
        x = distance * 45
        scale = distance === 0 ? 1.05 : 1
      }
      break
    case 'corner-fan':
      if (open) {
        rotate = -10 + (index / 4) * 40
        scale = index === 2 ? 1.03 : 1
      }
      break
    case 'stamp-arc':
      if (open) {
        const positions = [
          { x: -180, y: 40, rotate: -25 },
          { x: -90, y: 10, rotate: -12 },
          { x: 0, y: -10, rotate: 0 },
          { x: 90, y: 10, rotate: 12 },
          { x: 180, y: 40, rotate: 25 },
        ]
        const position = positions[index] ?? positions[0]
        x = position.x
        y = position.y
        rotate = position.rotate
        scale = distance === 0 ? 1.05 : 1
      }
      break
    case 'cascade':
      y = open ? distance * -28 - 14 : distance * 2
      x = open ? distance * 14 : 0
      rotate = open ? distance * 6 : 0
      scale = open ? distance === 0 ? 1.05 : .98 : 1
      break
    case 'scatter':
      if (open) {
        const positions = [
          { x: -75, y: 15, rotate: -14 },
          { x: -35, y: -15, rotate: -6 },
          { x: 0, y: -30, rotate: 2 },
          { x: 35, y: -10, rotate: 8 },
          { x: 75, y: 20, rotate: 15 },
        ]
        const position = positions[index] ?? positions[0]
        x = position.x
        y = position.y
        rotate = position.rotate
        scale = index === 2 ? 1.05 : .98
      }
      break
    case 'wheel':
      if (open) {
        rotate = distance * 18
        y = Math.abs(distance) === 2 ? -8 : Math.abs(distance) === 1 ? -22 : -28
        scale = distance === 0 ? 1.05 : .98
      }
      break
  }

  return { x, y, rotate, scale }
}

function spreadTransition() {
  return props.config.interactionType === 'cascade'
    ? { type: 'spring', stiffness: 200, damping: 22, mass: .9 }
    : { type: 'spring', stiffness: 180, damping: 20, mass: .8, duration: .5 }
}

function spreadStyle(index: number) {
  const center = (count.value - 1) / 2
  const distance = index - center
  switch (props.config.interactionType) {
    case 'corner-fan': return { zIndex: 5 - index, transformOrigin: '0% 100%' }
    case 'cascade': return { zIndex: 5 - Math.abs(distance), transformOrigin: '50% 50%' }
    case 'scatter': return { zIndex: 5 - Math.abs(index - 2), transformOrigin: '50% 50%' }
    case 'wheel': return { zIndex: 5 - Math.abs(distance), transformOrigin: '50% 110%' }
    case 'arc-7': return { zIndex: 4 - Math.abs(distance), transformOrigin: '50% 100%' }
    case 'linear': return { zIndex: 3 - Math.abs(distance) }
    default: return { zIndex: 3 - Math.abs(distance), transformOrigin: '50% 100%' }
  }
}

function previous(event: Event) {
  event.stopPropagation()
  active.value = Math.max(0, active.value - 1)
}
function next(event: Event) {
  event.stopPropagation()
  active.value = Math.min(assets.length - 1, active.value + 1)
}
function selectSlide(event: Event, index: number) {
  event.stopPropagation()
  active.value = index
}
function selectTimeline(index: number) {
  hoveredTimeline.value = index
  timeActive.value = Math.round(index)
}
</script>

<template>
  <div class="card-demo" :class="`card-${config.interactionType}`" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div v-if="isSpread" class="card-stage">
      <motion.div
        v-for="index in cards"
        :key="index"
        class="demo-card"
        :class="{ stamp: config.interactionType === 'stamp-arc' }"
        :animate="spreadTransform(index)"
        :transition="spreadTransition()"
        :style="spreadStyle(index)"
      >
        <span class="card-number">0{{ index + 1 }}</span>
        <span class="card-line" /><span class="card-line short" />
      </motion.div>
    </div>

    <template v-else-if="config.interactionType === 'carousel'">
      <div class="arc-carousel-window">
        <motion.div class="arc-carousel-track" :animate="{ x: -active * 160 }" :transition="{ type: 'spring', bounce: .1, duration: .8 }">
          <motion.div
            v-for="(item, index) in assets"
            :key="item.title"
            class="arc-carousel-slide"
            :animate="{
              rotate: hovered ? (index - active) * 20 : (index - active) * 5,
              scale: index === active ? 1.05 : hovered ? .65 : .8,
              y: hovered ? (index - active) * 24 : 0,
            }"
            :transition="{ type: 'spring', bounce: .2, duration: .8 }"
          >
            <div class="carousel-title" :class="{ active: index === active }">{{ item.title }}</div>
            <img :src="item.src" :alt="item.title" referrerpolicy="no-referrer" @click="selectSlide($event, index)" />
          </motion.div>
        </motion.div>
      </div>
      <div class="carousel-controls original-controls">
        <button aria-label="Previous card" @click="previous"><ChevronLeft :size="14" /></button>
        <span class="dots"><i v-for="(_, index) in assets" :key="index" :class="{ active: index === active }" @click="selectSlide($event, index)" /></span>
        <button aria-label="Next card" @click="next"><ChevronRight :size="14" /></button>
      </div>
    </template>

    <template v-else-if="config.interactionType === 'coverflow'">
      <div class="coverflow-stage">
        <motion.div
          v-for="(item, index) in assets"
          :key="item.title"
          class="coverflow-card"
          :initial="false"
          :animate="{
            x: (index - active) * 32,
            rotateY: index === active ? 0 : index < active ? 38 : -38,
            z: index === active ? 50 : -Math.abs(index - active) * 50,
            scale: index === active ? 1.1 : 1 - Math.abs(index - active) * .08,
            opacity: Math.abs(index - active) > 2 ? 0 : 1 - Math.abs(index - active) * .25,
          }"
          :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
          :style="{ zIndex: 100 - Math.abs(index - active) }"
          @click="selectSlide($event, index)"
        >
          <img :src="item.src" :alt="item.title" referrerpolicy="no-referrer" />
          <motion.div class="coverflow-title" :animate="{ opacity: index === active ? 1 : 0, y: index === active ? 0 : -5 }">{{ item.title }}</motion.div>
        </motion.div>
      </div>
      <div class="carousel-controls original-controls coverflow-controls">
        <button aria-label="Previous card" @click="previous"><ChevronLeft :size="14" /></button>
        <span class="dots"><i v-for="(_, index) in assets" :key="index" :class="{ active: index === active }" @click="selectSlide($event, index)" /></span>
        <button aria-label="Next card" @click="next"><ChevronRight :size="14" /></button>
      </div>
    </template>

    <template v-else>
      <svg class="goo-filter" aria-hidden="true"><defs><filter id="amicro-time-machine-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter></defs></svg>
      <div class="time-machine-stage">
        <motion.div
          v-for="(item, index) in assets"
          :key="item.title"
          class="time-card"
          :initial="false"
          :animate="{
            z: index < timeActive ? 200 : -(index - timeActive) * 60,
            y: index < timeActive ? 300 : -(index - timeActive) * 12,
            rotateX: index < timeActive ? -20 : (index - timeActive) * 2,
            opacity: index < timeActive ? 0 : 1 - Math.abs(index - timeActive) * .2,
            scale: index < timeActive ? 1.3 : 1,
          }"
          :transition="{ type: 'spring', stiffness: 250, damping: 25, mass: .8 }"
          :style="{ zIndex: assets.length - index, filter: 'url(#amicro-time-machine-goo)' }"
        ><img :src="item.src" :alt="item.title" referrerpolicy="no-referrer" /><span /></motion.div>
      </div>
      <div class="timeline" @mouseleave="hoveredTimeline = null">
        <template v-for="node in timelineNodes" :key="`${node.type}-${node.index}`">
          <button v-if="node.type === 'main'" class="timeline-main" @mouseenter="selectTimeline(node.index)" @click.stop="timeActive = node.index">
            <motion.span v-if="hoveredTimeline === node.index" class="timeline-date" :class="{ selected: timeActive === node.index }" :initial="{ opacity: 0, filter: 'blur(2px)', scale: .8 }" :animate="{ opacity: 1, filter: 'blur(0px)', scale: 1 }" :transition="{ duration: .15 }">{{ node.date }}</motion.span>
            <motion.i :class="{ selected: timeActive === node.index }" :animate="{ scaleX: hoveredTimeline === null ? 1 : timeActive === node.index ? 1.4 : Math.abs(node.index - hoveredTimeline) < .5 ? 1.25 : 1 }" :transition="{ type: 'spring', stiffness: 400, damping: 25 }" />
          </button>
          <div v-else class="timeline-sub" @mouseenter="selectTimeline(node.index)" @click.stop="timeActive = Math.round(node.index)">
            <motion.i :animate="{ scaleX: hoveredTimeline === null ? 1 : Math.abs(node.index - hoveredTimeline) <= .5 ? 1.15 : 1, opacity: hoveredTimeline === null ? .3 : Math.abs(node.index - hoveredTimeline) <= .5 ? .5 : .3 }" :transition="{ type: 'spring', stiffness: 400, damping: 25 }" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
