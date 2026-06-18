"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const labels: Record<string, string> = {
  "/": "Дашборд",
  "/dashboard": "Дашборд",
  "/team": "Команда",
  "/leaderboard": "Лидерборд",
  "/clients": "Клиенты",
  "/orders": "Заказы",
  "/kanban": "Канбан",
  "/invoices": "Счета на оплату",
  "/finance": "Финансы",
  "/analytics": "Аналитика",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const label = labels[pathname] ?? "Дашборд"

  return (
    <>
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          <li className="flex">
            <Link
              href="/dashboard"
              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
            >
              Creometrics
            </Link>
          </li>
          <ChevronRight
            className="size-4 shrink-0 text-gray-600 dark:text-gray-400"
            aria-hidden="true"
          />
          <li className="flex">
            <div className="flex items-center">
              <Link
                href={pathname}
                aria-current="page"
                className="text-gray-900 dark:text-gray-50"
              >
                {label}
              </Link>
            </div>
          </li>
        </ol>
      </nav>
    </>
  )
}
