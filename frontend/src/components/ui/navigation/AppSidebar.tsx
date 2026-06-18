"use client"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
  useSidebar,
} from "@/components/Sidebar"
import { cx, focusRing } from "@/lib/utils"
import { RiArrowDownSFill } from "@remixicon/react"
import {
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Gauge,
  House,
  KanbanSquare,
  PackageSearch,
  ReceiptText,
  Trophy,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Logo } from "../../../../public/Logo"
import { UserProfile } from "./UserProfile"

const navigation = [
  {
    name: "Дашборд",
    href: "/dashboard",
    icon: House,
    notifications: false,
  },
  {
    name: "Заказы",
    href: "/orders",
    icon: PackageSearch,
    notifications: 6,
  },
  {
    name: "Канбан",
    href: "/kanban",
    icon: KanbanSquare,
    notifications: false,
  },
  {
    name: "Счета",
    href: "/invoices",
    icon: ReceiptText,
    notifications: 2,
  },
] as const

const navigation2 = [
  {
    name: "Операции",
    href: "/team",
    icon: Gauge,
    children: [
      {
        name: "Команда",
        href: "/team",
      },
      {
        name: "Лидерборд",
        href: "/leaderboard",
      },
      {
        name: "Клиенты",
        href: "/clients",
      },
      {
        name: "Аналитика",
        href: "/analytics",
      },
    ],
  },
  {
    name: "Управление",
    href: "/finance",
    icon: BriefcaseBusiness,
    children: [
      {
        name: "Финансы",
        href: "/finance",
      },
      {
        name: "Прайс-лист",
        href: "/settings/pricelist",
      },
    ],
  },
] as const

const collapsedNavigation = [
  ...navigation,
  { name: "Команда", href: "/team", icon: Users },
  { name: "Лидерборд", href: "/leaderboard", icon: Trophy },
  { name: "Клиенты", href: "/clients", icon: BriefcaseBusiness },
  { name: "Финансы", href: "/finance", icon: CircleDollarSign },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
] as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    navigation2[0].name,
    navigation2[1].name,
  ])
  const toggleMenu = (name: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item: string) => item !== name)
        : [...prev, name],
    )
  }
  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-925">
      <SidebarHeader className={cx("px-3 py-4", isCollapsed && "items-center px-2")}>
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <span className="flex size-9 shrink-0 items-center justify-center">
              {/* Показываем только иконку (левую часть лого) в свёрнутом виде */}
              <svg width="36" height="36" viewBox="0 0 175 284" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 196.5C0 244.825 39.175 284 87.5 284L87.5 196.5C87.5 148.175 48.3249 109 0 109L0 196.5Z" fill="#39ACFF" />
                <path d="M91.1972 109H87.5L87.5 284C135.825 284 175 244.825 175 196.5V192.803C175 146.52 137.48 109 91.1972 109Z" fill="#39ACFF" />
              </svg>
            </span>
          ) : (
            <Logo className="h-7 w-auto text-gray-950 dark:text-white" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className={cx(isCollapsed && "hidden")}>
          <SidebarGroupContent>
            <Input type="search" placeholder="Поиск..." className="[&>input]:sm:py-1.5" />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className={cx("pt-0", isCollapsed && "px-2")}>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {(isCollapsed ? collapsedNavigation : navigation).map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={
                      pathname === item.href ||
                      (item.href === "/dashboard" && pathname === "/")
                    }
                    icon={item.icon}
                    notifications={
                      "notifications" in item && !isCollapsed
                        ? item.notifications
                        : false
                    }
                    className={cx(isCollapsed && "justify-center")}
                    title={item.name}
                  >
                    <span className={cx(isCollapsed && "sr-only")}>
                      {item.name}
                    </span>
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className={cx("px-3", isCollapsed && "hidden")}>
          <Divider className="my-0 py-0" />
        </div>
        <SidebarGroup className={cx(isCollapsed && "hidden")}>
          <SidebarGroupContent>
            <SidebarMenu className={cx("space-y-4", isCollapsed && "space-y-1")}>
              {navigation2.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    title={item.name}
                    className={cx(
                      "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 hover:dark:bg-gray-900 hover:dark:text-gray-50",
                      isCollapsed && "justify-center",
                      focusRing,
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon
                        className="size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      <span className={cx(isCollapsed && "sr-only")}>
                        {item.name}
                      </span>
                    </div>
                    {!isCollapsed && (
                      <RiArrowDownSFill
                        className={cx(
                          openMenus.includes(item.name)
                            ? "rotate-0"
                            : "-rotate-90",
                          "size-5 shrink-0 transform text-gray-400 transition-transform duration-150 ease-in-out dark:text-gray-600",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  {item.children && openMenus.includes(item.name) && !isCollapsed && (
                    <SidebarMenuSub>
                      <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.name}>
                          <SidebarSubLink
                            href={child.href}
                            isActive={pathname === child.href}
                          >
                            {child.name}
                          </SidebarSubLink>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        {isCollapsed ? (
          <div className="flex justify-center">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              title="Иван Иванов"
              aria-hidden="true"
            >
              ИИ
            </span>
          </div>
        ) : (
          <UserProfile />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
