<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion-v'
import { ArrowDownAZ, Grid2X2, LayoutGrid, List, Menu, Moon, Sparkles, Sun, X } from '@lucide/vue'
import GithubIcon from './components/GithubIcon.vue'
import AnimatedButton from './components/AnimatedButton.vue'
import CardDemo from './components/CardDemo.vue'
import CliPage from './components/CliPage.vue'
import SkillsPage from './components/SkillsPage.vue'
import { buttonsData } from './data/buttons'
import { cardsData, type CardConfig } from './data/cards'
import { getButtonCode, getCardCode, themeToggleCode } from './utils/codeGenerator'

type PageMode = 'home' | 'cli' | 'skills'
type CatalogTab = 'buttons' | 'cards' | 'carousels'
type LayoutMode = 'list' | 'grid' | 'matrix'

const page = ref<PageMode>('home')
const tab = ref<CatalogTab>('buttons')
const layout = ref<LayoutMode>('grid')
const alphabetical = ref(false)
const theme = ref<'dark' | 'light'>('dark')
const mobileMenu = ref(false)
const toast = ref<string | null>(null)
const stars = ref<number | null>(null)
let toastTimer: number | undefined

const sortedButtons = computed(() => alphabetical.value ? [...buttonsData].sort((a, b) => a.label.localeCompare(b.label)) : buttonsData)
const sortedCards = computed(() => {
  const category = tab.value === 'cards' ? 'spreads' : 'carousels'
  const list = cardsData.filter(card => card.category === category)
  return alphabetical.value ? [...list].sort((a, b) => a.label.localeCompare(b.label)) : list
})

function syncRoute() {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  page.value = hash === 'cli' || hash === 'skills' ? hash : 'home'
}
function navigate(next: PageMode) {
  window.location.hash = next === 'home' ? '' : next
  page.value = next
  mobileMenu.value = false
}
function showToast(message: string) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = null), 2200)
}
async function copy(text: string, label: string) {
  try { await navigator.clipboard.writeText(text); showToast(`${label} Vue code copied`) }
  catch { showToast('Clipboard access failed') }
}
async function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  await copy(themeToggleCode, 'Theme toggle')
}
function copyCard(card: CardConfig) { return copy(getCardCode(card), card.label) }
function browseCatalog() { document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' }) }

onMounted(() => {
  syncRoute()
  window.addEventListener('hashchange', syncRoute)
  fetch('https://api.github.com/repos/weepwood/Amicro-Vue')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => { stars.value = data.stargazers_count })
    .catch(() => { stars.value = null })
})
onBeforeUnmount(() => window.removeEventListener('hashchange', syncRoute))
</script>

<template>
  <MotionConfig reducedMotion="user">
    <div class="app-shell" :data-theme="theme">
      <header class="site-header">
        <div class="nav-wrap">
          <button class="brand" @click="navigate('home')"><span class="brand-mark">»</span><strong>Amicro</strong><em>Vue</em></button>
          <nav class="desktop-nav">
            <button :class="{ active: page === 'home' }" @click="navigate('home')">Components</button>
            <button :class="{ active: page === 'cli' }" @click="navigate('cli')">CLI Install</button>
            <button :class="{ active: page === 'skills' }" @click="navigate('skills')">Motion Anatomy</button>
          </nav>
          <div class="nav-actions">
            <a class="round-action repo-action" href="https://github.com/weepwood/Amicro-Vue" target="_blank" rel="noreferrer"><GithubIcon :size="16" /><span>{{ stars ?? 'Star' }}</span></a>
            <button class="round-action" title="Toggle theme and copy Vue code" @click="toggleTheme"><component :is="theme === 'dark' ? Sun : Moon" :size="16" /></button>
            <button class="round-action mobile-toggle" @click="mobileMenu = !mobileMenu"><component :is="mobileMenu ? X : Menu" :size="17" /></button>
          </div>
        </div>
        <AnimatePresence>
          <motion.nav v-if="mobileMenu" class="mobile-nav" :initial="{ opacity: 0, height: 0, y: -6 }" :animate="{ opacity: 1, height: 'auto', y: 0 }" :exit="{ opacity: 0, height: 0, y: -6 }">
            <button @click="navigate('home')">Components</button><button @click="navigate('cli')">CLI Install</button><button @click="navigate('skills')">Motion Anatomy</button>
          </motion.nav>
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        <motion.div v-if="page === 'cli'" key="cli" :initial="{ opacity: 0, y: 14 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -14 }"><CliPage /></motion.div>
        <motion.div v-else-if="page === 'skills'" key="skills" :initial="{ opacity: 0, y: 14 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -14 }"><SkillsPage /></motion.div>
        <motion.main v-else key="home" class="home" :initial="{ opacity: 0, y: 14 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -14 }">
          <section class="hero">
            <motion.span class="hero-badge" :initial="{ opacity: 0, scale: .9 }" :animate="{ opacity: 1, scale: 1 }"><Sparkles :size="14" /> React experience, native Vue implementation</motion.span>
            <h1>Amicro — Micro-transitions</h1>
            <p>A Vue 3 port of the original interaction catalog, rebuilt with Motion for Vue, TypeScript and compositor-friendly animation primitives.</p>
            <div class="hero-actions">
              <motion.a href="https://github.com/weepwood/Amicro-Vue" target="_blank" :whileHover="{ scale: 1.04, y: -1 }" :whilePress="{ scale: .98 }"><GithubIcon :size="16" /> GitHub Repo</motion.a>
              <motion.button :whileHover="{ scale: 1.04, y: -1 }" :whilePress="{ scale: .98 }" @click="browseCatalog"><ArrowDownAZ :size="15" /> Browse components</motion.button>
            </div>
          </section>

          <section id="catalog" class="catalog">
            <div class="controls">
              <div class="segmented wide">
                <button :class="{ active: tab === 'buttons' }" @click="tab = 'buttons'">Buttons</button>
                <button :class="{ active: tab === 'cards' }" @click="tab = 'cards'">Card Spreads</button>
                <button :class="{ active: tab === 'carousels' }" @click="tab = 'carousels'">3D Carousels</button>
              </div>
              <div class="control-side">
                <button class="sort-button" :class="{ active: alphabetical }" @click="alphabetical = !alphabetical"><ArrowDownAZ :size="15" /> A–Z</button>
                <div v-if="tab === 'buttons'" class="segmented layouts">
                  <button :class="{ active: layout === 'list' }" title="List" @click="layout = 'list'"><List :size="15" /></button>
                  <button :class="{ active: layout === 'grid' }" title="Grid" @click="layout = 'grid'"><LayoutGrid :size="15" /></button>
                  <button :class="{ active: layout === 'matrix' }" title="Matrix" @click="layout = 'matrix'"><Grid2X2 :size="15" /></button>
                </div>
              </div>
            </div>

            <LayoutGroup>
              <motion.div v-if="tab === 'buttons'" layout class="component-grid" :class="`layout-${layout}`">
                <motion.article v-for="button in sortedButtons" :key="button.id" layout class="component-cell" :whileHover="{ y: layout === 'matrix' ? -2 : -4 }">
                  <AnimatedButton :config="button" :layout-mode="layout" :theme="theme" />
                  <div v-if="layout !== 'matrix'" class="cell-meta"><span>{{ button.label }}</span><button @click="copy(getButtonCode(button), button.label)">Copy Vue</button></div>
                </motion.article>
              </motion.div>

              <motion.div v-else layout class="card-grid">
                <motion.article v-for="card in sortedCards" :key="card.id" layout class="card-cell" :whileHover="{ y: -5 }">
                  <CardDemo :config="card" :theme="theme" />
                  <div class="card-copy"><div><strong>{{ card.label }}</strong><p>{{ card.description }}</p></div><button @click="copyCard(card)">Copy Vue</button></div>
                </motion.article>
              </motion.div>
            </LayoutGroup>
          </section>
        </motion.main>
      </AnimatePresence>

      <footer><span>Vue 3 + Motion for Vue</span><a href="https://github.com/Subhan-code/Amicro--Micro-transitions-" target="_blank" rel="noreferrer">Original React project ↗</a></footer>

      <AnimatePresence>
        <motion.div v-if="toast" class="toast" :initial="{ opacity: 0, y: 16, scale: .95 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :exit="{ opacity: 0, y: 10, scale: .97 }">{{ toast }}</motion.div>
      </AnimatePresence>
    </div>
  </MotionConfig>
</template>
