import type { Component } from 'vue'
import {
  Apple, ArrowRight, Star, Cloud, CloudUpload, Copy, Check, Heart, Link, Send,
  Play, Pause, Settings, Trash2, Bell, BellRing, Search, X, Moon, Sun, Mic, MicOff,
  Video, VideoOff, Volume2, VolumeX, Lock, Unlock, Folder, FolderOpen, Eye, EyeOff,
  Bookmark, ThumbsUp, Download, Upload, User, UserCheck, Pen, Wifi, WifiOff, Battery,
  BatteryCharging, Maximize, Minimize, RefreshCw,
} from '@lucide/vue'
import GithubIcon from '../components/GithubIcon.vue'

export type InteractionType =
  | 'slide-arrow' | 'sparkle' | 'morph' | 'pulse' | 'rotate' | 'shake' | 'ring'
  | 'color-morph' | 'glare' | 'text-reveal' | 'magnetic' | 'expand-ring' | 'focus-blur'

export interface ButtonConfig {
  id: string
  label: string
  icon1: Component
  icon2?: Component
  interactionType: InteractionType
  accent?: string
  persistent?: boolean
}

export const buttonsData: ButtonConfig[] = [
  { id: '1', label: 'Download for Mac', icon1: Apple, icon2: ArrowRight, interactionType: 'slide-arrow' },
  { id: '2', label: 'Star on GitHub', icon1: GithubIcon, icon2: Star, interactionType: 'sparkle', accent: '#facc15' },
  { id: '3', label: 'Deploy App', icon1: Cloud, icon2: CloudUpload, interactionType: 'morph', accent: '#60a5fa' },
  { id: '4', label: 'Copy Hash', icon1: Copy, icon2: Check, interactionType: 'morph', accent: '#34d399', persistent: true },
  { id: '5', label: 'Sponsor', icon1: Heart, interactionType: 'pulse', accent: '#ec4899' },
  { id: '6', label: 'Share', icon1: Link, icon2: Send, interactionType: 'morph', accent: '#60a5fa' },
  { id: '7', label: 'Preview', icon1: Play, icon2: Pause, interactionType: 'morph', accent: '#4ade80' },
  { id: '8', label: 'Settings', icon1: Settings, interactionType: 'rotate' },
  { id: '9', label: 'Delete', icon1: Trash2, interactionType: 'shake', accent: '#f87171' },
  { id: '10', label: 'Subscribe', icon1: Bell, icon2: BellRing, interactionType: 'ring', accent: '#fb923c' },
  { id: '11', label: 'Search', icon1: Search, icon2: X, interactionType: 'morph' },
  { id: '12', label: 'Theme', icon1: Moon, icon2: Sun, interactionType: 'morph', accent: '#facc15' },
  { id: '13', label: 'Microphone', icon1: Mic, icon2: MicOff, interactionType: 'morph', accent: '#f87171' },
  { id: '14', label: 'Camera', icon1: Video, icon2: VideoOff, interactionType: 'morph', accent: '#f87171' },
  { id: '15', label: 'Volume', icon1: Volume2, icon2: VolumeX, interactionType: 'morph', accent: '#a3a3a3' },
  { id: '16', label: 'Lock', icon1: Lock, icon2: Unlock, interactionType: 'morph', accent: '#34d399' },
  { id: '17', label: 'Directory', icon1: Folder, icon2: FolderOpen, interactionType: 'morph', accent: '#60a5fa' },
  { id: '18', label: 'Visibility', icon1: Eye, icon2: EyeOff, interactionType: 'morph', accent: '#a3a3a3' },
  { id: '19', label: 'Save Later', icon1: Bookmark, icon2: Bookmark, interactionType: 'color-morph', accent: '#60a5fa' },
  { id: '20', label: 'Like', icon1: ThumbsUp, icon2: ThumbsUp, interactionType: 'color-morph', accent: '#3b82f6' },
  { id: '21', label: 'Download', icon1: Download, icon2: Check, interactionType: 'morph', accent: '#34d399', persistent: true },
  { id: '22', label: 'Upload', icon1: Upload, icon2: Check, interactionType: 'morph', accent: '#60a5fa', persistent: true },
  { id: '23', label: 'Account', icon1: User, icon2: UserCheck, interactionType: 'morph', accent: '#34d399' },
  { id: '24', label: 'Submit', icon1: Send, icon2: Check, interactionType: 'morph', accent: '#34d399', persistent: true },
  { id: '25', label: 'Edit', icon1: Pen, icon2: Check, interactionType: 'morph', accent: '#34d399', persistent: true },
  { id: '26', label: 'Network', icon1: Wifi, icon2: WifiOff, interactionType: 'morph', accent: '#f87171' },
  { id: '27', label: 'Power', icon1: Battery, icon2: BatteryCharging, interactionType: 'morph', accent: '#34d399' },
  { id: '28', label: 'Expand', icon1: Maximize, icon2: Minimize, interactionType: 'morph' },
  { id: '29', label: 'Reload', icon1: RefreshCw, interactionType: 'rotate' },
  { id: '30', label: 'Favorite', icon1: Star, icon2: Star, interactionType: 'color-morph', accent: '#facc15' },
  { id: '31', label: 'Glare Shine', icon1: Star, interactionType: 'glare' },
  { id: '32', label: 'Text Reveal', icon1: ArrowRight, interactionType: 'text-reveal' },
  { id: '33', label: 'Magnetic Field', icon1: GithubIcon, interactionType: 'magnetic' },
  { id: '34', label: 'Expand Ring', icon1: Link, interactionType: 'expand-ring' },
  { id: '35', label: 'Focus Blur Links', icon1: Link, interactionType: 'focus-blur' },
]
