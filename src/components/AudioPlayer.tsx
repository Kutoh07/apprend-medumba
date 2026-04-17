'use client'

import { useState } from 'react'

// Module-level singleton — stops previous audio before starting a new one
let currentAudio: HTMLAudioElement | null = null

interface AudioPlayerProps {
  audioPath?: string
  hasAudio: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-11 h-11',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export default function AudioPlayer({ audioPath, hasAudio, size = 'md' }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    if (!hasAudio || !audioPath) return

    // Stop whatever is currently playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }

    // Toggle off if this button was already playing
    if (playing) {
      setPlaying(false)
      return
    }

    const audio = new Audio(audioPath)
    currentAudio = audio

    audio.play().catch(() => {
      setPlaying(false)
      currentAudio = null
    })

    setPlaying(true)
    audio.onended = () => { setPlaying(false); currentAudio = null }
    audio.onerror = () => { setPlaying(false); currentAudio = null }
  }

  const base = `rounded-full flex items-center justify-center transition-all ${sizeClasses[size]}`
  const icon = iconSizes[size]

  if (!hasAudio) {
    return (
      <div className="relative group">
        <button
          disabled
          aria-label="Audio non disponible"
          className={`${base} bg-gray-100 text-gray-300 cursor-not-allowed`}
        >
          <MutedIcon className={icon} />
        </button>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
          Audio bientôt disponible
        </span>
      </div>
    )
  }

  return (
    <button
      onClick={handlePlay}
      aria-label={playing ? 'Arrêter la lecture' : 'Écouter la prononciation'}
      className={`${base} ${
        playing
          ? 'bg-accent text-white scale-95 shadow-md'
          : 'bg-accent/10 text-accent hover:bg-accent hover:text-white hover:scale-105'
      }`}
    >
      {playing ? (
        <SpeakerPlayingIcon className={`${icon} animate-pulse`} />
      ) : (
        <SpeakerIcon className={icon} />
      )}
    </button>
  )
}

function SpeakerIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  )
}

function SpeakerPlayingIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function MutedIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}
