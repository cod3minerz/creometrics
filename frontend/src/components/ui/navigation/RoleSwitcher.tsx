"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { AppRole } from "@/data/crm"
import { roleLabels, useRole } from "@/lib/roleContext"

const roles: AppRole[] = ["admin", "manager", "teamlead", "designer"]

export function RoleSwitcher() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Роль:</span>
      <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
        <SelectTrigger className="h-8 w-40 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r} className="text-xs">
              {roleLabels[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
