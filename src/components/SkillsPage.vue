<script setup lang="ts">
import { Activity, Gauge, Layers3, MousePointer2, ShieldCheck, Sparkles } from '@lucide/vue'
import { motion } from 'motion-v'

const items = [
  { icon: Gauge, title: 'Spring tuning', text: 'High stiffness gives quick intent; enough damping prevents visible oscillation.' },
  { icon: Layers3, title: 'Layout animation', text: 'Motion measures layout changes and resolves them with transform-based FLIP animation.' },
  { icon: MousePointer2, title: 'Gesture state', text: 'Hover, press, focus and touch all map to the same small set of visual states.' },
  { icon: Activity, title: 'Cheap properties', text: 'The port prioritises transform and opacity so the compositor can avoid costly layout work.' },
  { icon: ShieldCheck, title: 'Reduced motion', text: 'MotionConfig respects the operating-system reduced-motion preference.' },
  { icon: Sparkles, title: 'Layered timing', text: 'Small delays between icon, label and accent layers create continuity without slowing the UI.' },
]
</script>

<template>
  <main class="subpage">
    <div class="subpage-head"><span class="eyebrow"><Sparkles :size="14" /> Motion anatomy</span><h1>Why the transitions feel smooth</h1><p>The effect comes from continuity, interruption-safe springs and careful rendering choices—not from adding a long duration.</p></div>
    <section class="skills-grid">
      <motion.article v-for="(item, index) in items" :key="item.title" :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * .045 }" :whileHover="{ y: -4 }">
        <component :is="item.icon" :size="19" /><h2>{{ item.title }}</h2><p>{{ item.text }}</p>
      </motion.article>
    </section>
  </main>
</template>
