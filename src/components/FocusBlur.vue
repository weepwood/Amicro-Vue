<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'

const hovered = ref<number | null>(null)
const links = ['@X', '@Threads', '@GitHub']
</script>

<template>
  <div class="focus-links" @mouseleave="hovered = null">
    <span>[</span>
    <motion.a
      v-for="(link, index) in links"
      :key="link"
      href="#"
      :animate="{
        opacity: hovered === null || hovered === index ? 1 : 0.28,
        filter: hovered === null || hovered === index ? 'blur(0px)' : 'blur(2px)',
        scale: hovered === index ? 1.08 : 1,
      }"
      :transition="{ type: 'spring', stiffness: 420, damping: 28 }"
      @mouseenter="hovered = index"
      @click.prevent
    >{{ link }}</motion.a>
    <span>]</span>
  </div>
</template>
