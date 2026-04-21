"use client"

import { motion } from "framer-motion"

const orbs = [
  { left: "5%", top: "10%", size: 420, delay: 0, duration: 20 },
  { left: "70%", top: "50%", size: 340, delay: 4, duration: 24 },
  { left: "35%", top: "85%", size: 260, delay: 8, duration: 18 },
]

const dots = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: `${(i * 2.9) % 100}%`,
  delay: (i * 0.28) % 8,
  duration: 8 + (i % 7),
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2.5 : 1.5,
}))

export function PageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background:
              "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            x: [0, 25, -18, 8, 0],
            y: [0, -18, 25, -8, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* floating dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: dot.left,
            bottom: "-8px",
            width: dot.size,
            height: dot.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -600],
            opacity: [0, 0.18, 0.1, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
