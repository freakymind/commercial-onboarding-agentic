"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { Agent, MaturityLevel, Stage } from "@/lib/journey-data"
import { maturityDescriptions } from "@/lib/journey-data"

type Mode = "add" | "edit"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: Mode
  initial?: Partial<Agent>
  stages: Stage[]
  onSave: (agent: Omit<Agent, "id"> & { id?: string }) => void
  onDelete?: (id: string) => void
}

export function AgentDialog({
  open,
  onOpenChange,
  mode,
  initial,
  stages,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState("")
  const [func, setFunc] = useState("")
  const [scope, setScope] = useState<"common" | "stage">("stage")
  const [stageId, setStageId] = useState<string>(stages[0]?.id ?? "")
  const [maturity, setMaturity] = useState<MaturityLevel>("L2")
  const [color, setColor] = useState<string>("")

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setFunc(initial?.function ?? "")
    setScope(initial?.scope ?? "stage")
    setStageId(initial?.stageId ?? stages[0]?.id ?? "")
    setMaturity(initial?.maturity ?? "L2")
    setColor(initial?.color ?? "")
  }, [open, initial, stages])

  const handleSave = () => {
    if (!name.trim() || !func.trim()) return
    onSave({
      id: initial?.id,
      name: name.trim(),
      function: func.trim(),
      scope,
      stageId: scope === "stage" ? stageId : undefined,
      maturity,
      color: color || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add agent" : "Edit agent"}</DialogTitle>
          <DialogDescription>
            Configure an AI agent in the onboarding operating model.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="agent-name">Agent name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adverse Media Agent"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agent-fn">Function</Label>
            <Textarea
              id="agent-fn"
              value={func}
              onChange={(e) => setFunc(e.target.value)}
              placeholder="What this agent does for the analyst or the case"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as "common" | "stage")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stage">Stage-specific</SelectItem>
                  <SelectItem value="common">Common reusable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Maturity</Label>
              <Select value={maturity} onValueChange={(v) => setMaturity(v as MaturityLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(maturityDescriptions) as MaturityLevel[]).map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl} — {maturityDescriptions[lvl].split("—")[0].trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {scope === "stage" && (
            <div className="grid gap-2">
              <Label>Journey stage</Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.number}. {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="agent-color">Card color (optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="agent-color"
                type="color"
                value={color || "#7B3FA0"}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 cursor-pointer p-1"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Leave blank to use theme default"
                className="flex-1"
              />
              {color && (
                <Button variant="ghost" size="sm" onClick={() => setColor("")}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {mode === "edit" && onDelete && initial?.id && (
            <Button
              variant="ghost"
              className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                onDelete(initial.id!)
                onOpenChange(false)
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !func.trim()}>
            {mode === "add" ? "Add agent" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
