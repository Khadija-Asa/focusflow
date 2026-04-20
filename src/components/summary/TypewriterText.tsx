"use client"

import { useEffect, useState } from "react"

type Props = {
  text: string
  speed?: number
  onComplete?: () => void
}

export function TypewriterText({ text, speed = 18, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setDisplayed("")
    setIndex(0)
  }, [text])

  useEffect(() => {
    if (index >= text.length) {
      onComplete?.()
      return
    }

    const timeout = setTimeout(() => {
      setDisplayed((prev) => prev + text[index])
      setIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [index, text, speed, onComplete])

  return (
    <pre className="text-sm text-neutral-300 leading-7 whitespace-pre-wrap font-sans">
      {displayed}
      {index < text.length && (
        <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-pulse" />
      )}
    </pre>
  )
}