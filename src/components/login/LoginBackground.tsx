"use client"

import { motion } from "framer-motion"

const orbs = [
  { left: "8%", top: "15%", size: 480, delay: 0, duration: 18 },
  { left: "65%", top: "55%", size: 360, delay: 3, duration: 22 },
  { left: "40%", top: "80%", size: 280, delay: 6, duration: 16 },
]

const chips = [
  { label: "25:00", sub: "focus timer", left: "6%", top: "28%", delay: 0.4 },
  { label: "4 tâches", sub: "aujourd'hui", left: "74%", top: "18%", delay: 0.8 },
  { label: "2h 14m", sub: "session active", left: "78%", top: "68%", delay: 1.2 },
  { label: "92%", sub: "complétion", left: "8%", top: "65%", delay: 1.6 },
]

const dots = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.8) % 100}%`,
  delay: (i * 0.4) % 5,
  duration: 8 + (i % 5),
  size: i % 3 === 0 ? 3 : 2,
}))

export function LoginBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
          backgroundSize: "60px 60px",
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
              "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
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
            bottom: "-10px",
            width: dot.size,
            height: dot.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -700],
            opacity: [0, 0.25, 0.15, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* floating chips */}
      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          className="absolute"
          style={{ left: chip.left, top: chip.top }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: chip.delay, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 5 + Math.random() * 2,
              delay: chip.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-[#161616]/80 border border-[#2a2a2a] rounded-xl px-3 py-2 backdrop-blur-sm"
          >
            <p className="text-sm font-medium text-white/70 tabular-nums">
              {chip.label}
            </p>
            <p className="text-[10px] text-neutral-600 mt-0.5">{chip.sub}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
