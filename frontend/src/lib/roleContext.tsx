"use client"

import { AppRole } from "@/data/crm"
import * as React from "react"

type RoleContextValue = {
  role: AppRole
  setRole: (role: AppRole) => void
  can: (action: RoleAction) => boolean
}

export type RoleAction =
  | "view_all_stats"
  | "create_order"
  | "assign_designer"
  | "start_order"
  | "submit_review"
  | "approve_order"
  | "manage_finance"
  | "manage_team"
  | "edit_pricelist"

const rolePermissions: Record<AppRole, RoleAction[]> = {
  admin: [
    "view_all_stats",
    "create_order",
    "assign_designer",
    "start_order",
    "submit_review",
    "approve_order",
    "manage_finance",
    "manage_team",
    "edit_pricelist",
  ],
  manager: ["create_order"],
  teamlead: ["assign_designer", "start_order", "submit_review", "approve_order"],
  designer: ["start_order", "submit_review"],
}

const RoleContext = React.createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<AppRole>("admin")

  const can = React.useCallback(
    (action: RoleAction) => rolePermissions[role].includes(action),
    [role],
  )

  return <RoleContext.Provider value={{ role, setRole, can }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = React.useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}

export const roleLabels: Record<AppRole, string> = {
  admin: "Администратор",
  manager: "Менеджер",
  teamlead: "Тимлид",
  designer: "Дизайнер",
}
