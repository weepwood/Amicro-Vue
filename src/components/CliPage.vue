<script setup lang="ts">
import { Check, Copy, Package, Terminal } from '@lucide/vue'
import { ref } from 'vue'
import { motion } from 'motion-v'

const copied = ref<string | null>(null)
const commands = [
  { id: 'install', title: 'Install a component', command: 'npx amicro-vue@latest add magnetic-button' },
  { id: 'all', title: 'Install the complete catalog', command: 'npx amicro-vue@latest add --all' },
  { id: 'dev', title: 'Run this repository', command: 'npm install && npm run dev' },
]

async function copy(command: string, id: string) {
  await navigator.clipboard.writeText(command)
  copied.value = id
  window.setTimeout(() => (copied.value = null), 1600)
}
</script>

<template>
  <main class="subpage">
    <motion.div :initial="{ opacity: 0, y: 18 }" :animate="{ opacity: 1, y: 0 }" class="subpage-head">
      <span class="eyebrow"><Terminal :size="14" /> CLI workflow</span>
      <h1>Copy components, not a framework.</h1>
      <p>The Vue port keeps every transition as an editable single-file component. The CLI commands below document the intended distribution workflow.</p>
    </motion.div>
    <section class="command-list">
      <motion.article v-for="item in commands" :key="item.id" layout class="command-card" :whileHover="{ y: -3 }">
        <div><Package :size="18" /><strong>{{ item.title }}</strong></div>
        <code>{{ item.command }}</code>
        <button @click="copy(item.command, item.id)"><component :is="copied === item.id ? Check : Copy" :size="15" />{{ copied === item.id ? 'Copied' : 'Copy' }}</button>
      </motion.article>
    </section>
  </main>
</template>
