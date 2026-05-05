"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Palette, RotateCcw } from "lucide-react"
import type { ThemePalette } from "@/lib/journey-data"
import { defaultPalette, presetPalettes } from "@/lib/journey-data"

type Props = {
  palette: ThemePalette
  onChange: (palette: ThemePalette) => void
}

const fields: { key: keyof Omit<ThemePalette, "name">; label: string; hint: string }[] = [
  { key: "primary", label: "Primary", hint: "Brand / journey arrows" },
  { key: "accent", label: "Accent", hint: "Magenta highlights" },
  { key: "agentic", label: "Agentic", hint: "Amber process blocks" },
  { key: "human", label: "Human", hint: "Blue control blocks" },
  { key: "common", label: "Common agents", hint: "Reusable agent layer" },
  { key: "stage", label: "Stage agents", hint: "Stage-specific agent cards" },
]

export function ThemeCustomizer({ palette, onChange }: Props) {
  const update = (key: keyof ThemePalette, value: string) => {
    onChange({ ...palette, [key]: value, name: "Custom" })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Palette className="size-4" />
          Theme
          <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
            {palette.name}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold">Presets</p>
          <p className="text-xs text-muted-foreground">Swap the entire palette</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {presetPalettes.map((p) => {
            const active = p.name === palette.name
            return (
              <button
                key={p.name}
                onClick={() => onChange(p)}
                className={`group flex items-center gap-2 rounded-lg border p-2 text-left transition hover:border-primary/50 hover:bg-muted/50 ${
                  active ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex -space-x-1">
                  {[p.primary, p.accent, p.agentic, p.common].map((c, i) => (
                    <span
                      key={i}
                      className="size-4 rounded-full ring-2 ring-background"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium">{p.name}</span>
              </button>
            )
          })}
        </div>

        <Separator className="my-4" />

        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Custom colors</p>
            <p className="text-xs text-muted-foreground">Fine-tune each role</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultPalette)}
            className="h-7 gap-1 text-xs"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        </div>

        <div className="grid gap-3">
          {fields.map((f) => (
            <div key={f.key} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <Input
                type="color"
                value={palette[f.key] as string}
                onChange={(e) => update(f.key, e.target.value)}
                className="size-9 cursor-pointer p-1"
              />
              <div>
                <Label className="text-xs font-medium">{f.label}</Label>
                <p className="text-[10px] text-muted-foreground">{f.hint}</p>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {(palette[f.key] as string).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
