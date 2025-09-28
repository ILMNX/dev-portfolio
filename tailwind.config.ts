import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  // @ts-expect-error - safelist exists in Tailwind v4 but not in types
  safelist: [
    "bg-gradient-to-br",
    "from-slate-900/50",
    "via-purple-900/20",
    "to-slate-900/50",
    "backdrop-blur-sm",
    "backdrop-blur-md",
    "bg-white/5",
    "border-white/10",
  ],
}

export default config
