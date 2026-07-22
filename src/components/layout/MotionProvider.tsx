'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Lässt alle framer-motion-Komponenten die System-Einstellung „Bewegung
 * reduzieren“ respektieren (`reducedMotion="user"`): Transform-/Layout-
 * Animationen werden dann automatisch unterdrückt, Opazität bleibt erhalten.
 * Ergänzt die CSS-Regel in globals.css und deckt die JS-gesteuerten
 * Animationen ab, die eine reine Media-Query nicht stoppen kann.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
