"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import {
  Client,
  DesignerLevel,
  Order,
  OrderStatus,
  TeamMember,
  clients,
  creativeOutput,
  designerLevelLabels,
  formatCurrency,
  funnel,
  getClient,
  getTeamMember,
  monthlyRevenue,
  orders,
  payouts,
  team,
} from "@/data/crm"
import { useRole } from "@/lib/roleContext"
import { cx, formatters } from "@/lib/utils"
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  GripVertical,
  Minus,
  PackageSearch,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import * as React from "react"

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]
type BriefMode = "single" | "split"
type CalculatorKey = "creative" | "adapt" | "resize"
type CalculatorCountKey = "creative"
type DeadlineMode = "date" | "duration"
type PaymentMethod = "prepaid" | "deposit" | "postpaid"
type InvoiceKind = "prepaid" | "postpaid"
type InvoiceStatus = "pending" | "paid"
type GeoOption = {
  code: string
  country: string
}

type PaymentInvoice = {
  id: string
  orderId: string
  clientId: string
  managerId: string
  kind: InvoiceKind
  status: InvoiceStatus
  amount: number
  dueDate: string
  createdAt: string
  note: string
}

const paymentTermsLabels: Record<PaymentMethod, string> = {
  prepaid: "Предоплата",
  deposit: "Депозит",
  postpaid: "Постоплата",
}

const statusMeta: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  new: { label: "Новый", variant: "default" },
  assigned: { label: "Назначен", variant: "warning" },
  in_progress: { label: "В работе", variant: "default" },
  review: { label: "На проверке", variant: "warning" },
  revision: { label: "Правки", variant: "error" },
  approved: { label: "Выполнен", variant: "success" },
  paid: { label: "Оплачен", variant: "success" },
  cancelled: { label: "Отменён", variant: "neutral" },
}

const statusDots: Record<string, string> = {
  online: "bg-emerald-500",
  busy: "bg-amber-500",
  away: "bg-blue-500",
  offline: "bg-gray-400",
}

const statusLabels: Record<TeamMember["status"], string> = {
  online: "Онлайн",
  busy: "Занят",
  away: "Отошел",
  offline: "Офлайн",
}

const textareaClassName =
  "min-h-32 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:placeholder-gray-500"

const geoCatalog: GeoOption[] = [
  { code: "US", country: "США" },
  { code: "CA", country: "Канада" },
  { code: "BR", country: "Бразилия" },
  { code: "MX", country: "Мексика" },
  { code: "CL", country: "Чили" },
  { code: "AR", country: "Аргентина" },
  { code: "CO", country: "Колумбия" },
  { code: "PE", country: "Перу" },
  { code: "PL", country: "Польша" },
  { code: "RO", country: "Румыния" },
  { code: "HU", country: "Венгрия" },
  { code: "DE", country: "Германия" },
  { code: "FR", country: "Франция" },
  { code: "IT", country: "Италия" },
  { code: "ES", country: "Испания" },
  { code: "PT", country: "Португалия" },
  { code: "NL", country: "Нидерланды" },
  { code: "BE", country: "Бельгия" },
  { code: "AT", country: "Австрия" },
  { code: "CH", country: "Швейцария" },
  { code: "CZ", country: "Чехия" },
  { code: "SK", country: "Словакия" },
  { code: "GB", country: "Великобритания" },
  { code: "IE", country: "Ирландия" },
  { code: "SE", country: "Швеция" },
  { code: "NO", country: "Норвегия" },
  { code: "FI", country: "Финляндия" },
  { code: "DK", country: "Дания" },
  { code: "GR", country: "Греция" },
  { code: "TR", country: "Турция" },
  { code: "UA", country: "Украина" },
  { code: "KZ", country: "Казахстан" },
  { code: "TJ", country: "Таджикистан" },
  { code: "UZ", country: "Узбекистан" },
  { code: "KG", country: "Кыргызстан" },
  { code: "TM", country: "Туркменистан" },
  { code: "MD", country: "Молдова" },
  { code: "BY", country: "Беларусь" },
  { code: "GE", country: "Грузия" },
  { code: "AM", country: "Армения" },
  { code: "AZ", country: "Азербайджан" },
  { code: "IL", country: "Израиль" },
  { code: "AE", country: "ОАЭ" },
  { code: "SA", country: "Саудовская Аравия" },
  { code: "ZA", country: "ЮАР" },
  { code: "EG", country: "Египет" },
  { code: "NG", country: "Нигерия" },
  { code: "KE", country: "Кения" },
  { code: "IN", country: "Индия" },
  { code: "ID", country: "Индонезия" },
  { code: "TH", country: "Таиланд" },
  { code: "VN", country: "Вьетнам" },
  { code: "PH", country: "Филиппины" },
  { code: "MY", country: "Малайзия" },
  { code: "SG", country: "Сингапур" },
  { code: "JP", country: "Япония" },
  { code: "KR", country: "Южная Корея" },
  { code: "CN", country: "Китай" },
  { code: "HK", country: "Гонконг" },
  { code: "TW", country: "Тайвань" },
  { code: "AU", country: "Австралия" },
  { code: "NZ", country: "Новая Зеландия" },
]

const imageFormats = [
  "16:9 (горизонтальный)",
  "9:16 (вертикальный)",
  "1:1 (квадрат)",
  "4:5 (лента)",
  "3:2 (горизонтальный)",
  "2:3 (вертикальный)",
  "5:4 (баннер)",
  "1.91:1 (лента Meta)",
  "21:9 (ультраширокий)",
  "6:5 (нативный баннер)",
]

const deadlineDurations = [
  "1 день",
  "2 дня",
  "3 дня",
  "5 дней",
  "7 дней",
  "10 дней",
  "14 дней",
]

const creativeTypes = ["Статика", "Моушн"]

const paymentInvoices: PaymentInvoice[] = [
  {
    id: "INV-2048",
    orderId: "ORD-1842",
    clientId: "cl-1",
    managerId: "tm-1",
    kind: "prepaid",
    status: "pending",
    amount: 4680.5,
    dueDate: "2026-05-31",
    createdAt: "2026-05-31",
    note: "Предоплата перед запуском production.",
  },
  {
    id: "INV-2047",
    orderId: "ORD-1838",
    clientId: "cl-2",
    managerId: "tm-1",
    kind: "postpaid",
    status: "pending",
    amount: 2380.75,
    dueDate: "2026-06-03",
    createdAt: "2026-05-29",
    note: "Постоплата по закрытому пакету креативов.",
  },
  {
    id: "INV-2046",
    orderId: "ORD-1841",
    clientId: "cl-4",
    managerId: "tm-2",
    kind: "prepaid",
    status: "paid",
    amount: 3240,
    dueDate: "2026-05-28",
    createdAt: "2026-05-27",
    note: "Оплата подтверждена менеджером.",
  },
  {
    id: "INV-2045",
    orderId: "ORD-1835",
    clientId: "cl-3",
    managerId: "tm-2",
    kind: "postpaid",
    status: "pending",
    amount: 2880.25,
    dueDate: "2026-06-07",
    createdAt: "2026-05-26",
    note: "Клиент работает по недельной постоплате.",
  },
]

type KanbanColumnId = "new" | "assigned" | "in_progress" | "review" | "done"

const kanbanColumns: {
  id: KanbanColumnId
  title: string
  targetStatus: OrderStatus
  accent: string
}[] = [
  {
    id: "new",
    title: "Новый",
    targetStatus: "new",
    accent: "bg-blue-500",
  },
  {
    id: "assigned",
    title: "Назначен",
    targetStatus: "assigned",
    accent: "bg-amber-500",
  },
  {
    id: "in_progress",
    title: "В работе",
    targetStatus: "in_progress",
    accent: "bg-violet-500",
  },
  {
    id: "review",
    title: "На проверке",
    targetStatus: "review",
    accent: "bg-orange-500",
  },
  {
    id: "done",
    title: "Выполнен",
    targetStatus: "approved",
    accent: "bg-emerald-500",
  },
]

const kanbanStatusToColumn: Partial<Record<OrderStatus, KanbanColumnId>> = {
  new: "new",
  assigned: "assigned",
  in_progress: "in_progress",
  review: "review",
  revision: "review",
  approved: "done",
  paid: "done",
}

function getOrderBrief(order: Order) {
  return order.brief
}

function getKanbanColumnId(status: OrderStatus) {
  return kanbanStatusToColumn[status] ?? null
}

function getKanbanColumnOrders(rows: Order[], columnId: KanbanColumnId) {
  return rows.filter((order) => getKanbanColumnId(order.status) === columnId)
}

function getPriorityLabel(priority: Order["priority"]) {
  const labels = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
  }

  return labels[priority]
}

function getPriorityDotClass(priority: Order["priority"]) {
  return priority === "high"
    ? "bg-rose-500"
    : priority === "medium"
      ? "bg-amber-400"
      : "bg-emerald-500"
}

function PriorityLabel({ priority }: { priority: Order["priority"] }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cx("size-2.5 rounded-full", getPriorityDotClass(priority))} />
      {getPriorityLabel(priority)}
    </span>
  )
}

function getPriorityClasses(priority: Order["priority"]) {
  return priority === "high"
    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
    : priority === "medium"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
}

function getGeoOptions() {
  const clientGeo = clients.flatMap((client) => client.geo)
  const orderGeo = orders.flatMap((order) => order.geo)
  const knownCodes = new Set(geoCatalog.map((geo) => geo.code))
  const extraGeo = Array.from(new Set([...clientGeo, ...orderGeo]))
    .filter((code) => !knownCodes.has(code))
    .map((code) => ({ code, country: "другое GEO" }))

  return [...geoCatalog, ...extraGeo].sort((a, b) => a.code.localeCompare(b.code))
}

function toNumber(value: string | number) {
  const parsed = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCalculatorCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function ChartSkeleton() {
  return (
    <div className="mt-6 flex h-72 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-500">
      Загрузка графика...
    </div>
  )
}

const LazyBarChart = dynamic(
  () => import("@/components/BarChart").then((mod) => mod.BarChart),
  {
    ssr: false,
    loading: ChartSkeleton,
  },
)

const LazyComboChart = dynamic(
  () => import("@/components/ComboChart").then((mod) => mod.ComboChart),
  {
    ssr: false,
    loading: ChartSkeleton,
  },
)

function Avatar({ member }: { member?: TeamMember }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white ring-1 ring-gray-200 dark:bg-gray-50 dark:text-gray-950 dark:ring-gray-800">
        {member?.initials ?? "?"}
      </span>
      <span className="truncate">{member?.name ?? "Не назначен"}</span>
    </span>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={cx(
            "h-full rounded-full",
            value > 85 ? "bg-rose-500" : value > 70 ? "bg-amber-500" : "bg-emerald-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="tabular-nums text-gray-700 dark:text-gray-300">{value}%</span>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 px-4 py-5 sm:flex-row sm:items-center sm:px-6 dark:border-gray-800">
      <div>
        <h1 className="text-xl font-semibold text-gray-950 dark:text-gray-50">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}

export function MetricGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-1 divide-y divide-gray-200 border-b border-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:divide-gray-800 dark:border-gray-800">
      {children}
    </dl>
  )
}

export function MetricCard({
  label,
  value,
  delta,
  tone = "up",
}: {
  label: string
  value: string
  delta: string
  tone?: "up" | "down" | "neutral"
}) {
  const Icon = tone === "down" ? ArrowDownRight : ArrowUpRight

  return (
    <div className="p-4 sm:p-6">
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</dt>
      <dd className="mt-2 flex items-end justify-between gap-3">
        <span className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
          {value}
        </span>
        <span
          className={cx(
            "inline-flex items-center gap-1 text-xs font-medium",
            tone === "down"
              ? "text-rose-600 dark:text-rose-400"
              : tone === "neutral"
                ? "text-gray-500 dark:text-gray-400"
                : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {tone !== "neutral" && <Icon className="size-3.5" aria-hidden="true" />}
          {delta}
        </span>
      </dd>
    </div>
  )
}

export function Toolbar({ search, children }: { search: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-2 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <Input type="search" placeholder={search} className="sm:w-72 [&>input]:py-1.5" />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {children}
        <Button variant="secondary" className="gap-2 py-1.5">
          <Download className="size-4 text-gray-400" aria-hidden="true" />
          Экспорт
        </Button>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}

export function DashboardOverview() {
  const activeOrders = orders.filter((order) => !["paid", "cancelled"].includes(order.status))
  const billableOrders = orders.filter((order) => order.status !== "cancelled")
  const completed = orders.reduce((sum, order) => sum + order.completedCreatives, 0)
  const planned = orders.reduce((sum, order) => sum + order.packageSize, 0)
  const completionRate = planned ? Math.round((completed / planned) * 100) : 0
  const revenue = billableOrders.reduce((sum, order) => sum + order.price, 0)
  const activeRevenue = activeOrders.reduce((sum, order) => sum + order.price, 0)
  const avgOrderPrice = billableOrders.length ? Math.round(revenue / billableOrders.length) : 0
  const clientBalance = clients.reduce((sum, client) => sum + client.balance, 0)
  const clientDebt = clients.reduce((sum, client) => sum + client.debt, 0)
  const pendingPayouts = payouts
    .filter((payout) => payout.status !== "paid")
    .reduce((sum, payout) => sum + payout.amount, 0)
  const statusBreakdown = Object.entries(statusMeta).map(([status, meta]) => ({
    status,
    label: meta.label,
    count: orders.filter((order) => order.status === status).length,
    value: orders
      .filter((order) => order.status === status)
      .reduce((sum, order) => sum + order.price, 0),
  }))
  const creativeTypeBreakdown = ["Статика", "Моушн"].map((type) => {
    const rows = orders.filter((order) => order.creativeType === type)
    return {
      type,
      completed: rows.reduce((sum, order) => sum + order.completedCreatives, 0),
      planned: rows.reduce((sum, order) => sum + order.packageSize, 0),
      revenue: rows.reduce((sum, order) => sum + order.price, 0),
    }
  })

  return (
    <>
      <PageHeader
        title="Дашборд"
        description="Операционная сводка по заказам, команде, клиентским балансам и производству креативов."
      />
      <MetricGrid>
        <MetricCard label="Активные заказы" value={`${activeOrders.length}`} delta={`${orders.length} всего`} />
        <MetricCard label="Выполнено крео" value={`${completed}`} delta={`${completionRate}% от плана`} />
        <MetricCard label="План крео" value={`${planned}`} delta="по всем пакетам" tone="neutral" />
        <MetricCard label="Выручка заказов" value={formatCurrency(revenue)} delta={`${billableOrders.length} оплачиваемых`} />
        <MetricCard label="В активной работе" value={formatCurrency(activeRevenue)} delta="не закрытый pipeline" tone="neutral" />
        <MetricCard label="Средний чек" value={formatCurrency(avgOrderPrice)} delta="по заказам" />
        <MetricCard label="Баланс клиентов" value={formatCurrency(clientBalance)} delta="доступно" tone="neutral" />
        <MetricCard label="К выплате" value={formatCurrency(pendingPayouts)} delta={`долг клиентов ${formatCurrency(clientDebt)}`} tone={clientDebt > 0 ? "down" : "neutral"} />
      </MetricGrid>
      <div className="grid grid-cols-1 gap-0 border-b border-gray-200 lg:grid-cols-2 dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r dark:border-gray-800">
          <SectionTitle title="Производство по неделям" description="Статика, видео и лендинги в работе команды." />
          <LazyBarChart
            data={creativeOutput}
            index="week"
            categories={["Static", "Video", "Landing"]}
            colors={["blue", "emerald", "amber"]}
            yAxisWidth={44}
            valueFormatter={(value) => formatters.unit(value)}
            className="mt-6 h-72"
          />
        </div>
        <div className="p-4 sm:p-6">
          <SectionTitle title="Воронка заказов" description="Количество заказов по этапам production-flow." />
          <LazyBarChart
            data={funnel}
            index="stage"
            categories={["Orders"]}
            colors={["blue"]}
            valueFormatter={(value) => formatters.unit(value)}
            className="mt-6 h-72"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 border-b border-gray-200 lg:grid-cols-3 dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r dark:border-gray-800">
          <SectionTitle title="Статусы заказов" description="Срез по количеству и сумме заказов." />
          <ul className="mt-5 space-y-3">
            {statusBreakdown.map((item) => (
              <li key={item.status} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="text-right font-medium tabular-nums text-gray-950 dark:text-gray-50">
                  {item.count} · {formatCurrency(item.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r dark:border-gray-800">
          <SectionTitle title="Типы креативов" description="План, факт и выручка по production-типу." />
          <ul className="mt-5 space-y-3">
            {creativeTypeBreakdown.map((item) => (
              <li key={item.type} className="rounded-md border border-gray-200 p-3 text-sm dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-gray-950 dark:text-gray-50">{item.type}</span>
                  <span className="tabular-nums text-gray-500">{item.completed}/{item.planned}</span>
                </div>
                <ProgressBar value={item.planned ? Math.round((item.completed / item.planned) * 100) : 0} />
                <div className="mt-2 text-xs text-gray-500">{formatCurrency(item.revenue)} выручки</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 sm:p-6">
          <SectionTitle title="Клиентская база" description="Баланс, долг, LTV и активные клиенты." />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricMini label="Активные" value={`${clients.filter((client) => client.status !== "paused").length}`} />
            <MetricMini label="LTV базы" value={formatCurrency(clients.reduce((sum, client) => sum + client.ltv, 0))} />
            <MetricMini label="Баланс" value={formatCurrency(clientBalance)} />
            <MetricMini label="Долг" value={formatCurrency(clientDebt)} />
          </div>
        </div>
      </div>
    </>
  )
}

export function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-950 dark:text-gray-50">{title}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{description}</p>
    </div>
  )
}

const teamRoleLabels: Record<string, string> = {
  manager: "Менеджер",
  designer: "Дизайнер",
  teamlead: "Тимлид",
}

export function TeamTable({ rows = team }: { rows?: TeamMember[] }) {
  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Сотрудник</TableHeaderCell>
            <TableHeaderCell>Роль</TableHeaderCell>
            <TableHeaderCell>Уровень</TableHeaderCell>
            <TableHeaderCell>Статус</TableHeaderCell>
            <TableHeaderCell>Загрузка</TableHeaderCell>
            <TableHeaderCell>Активные</TableHeaderCell>
            <TableHeaderCell>Крео</TableHeaderCell>
            <TableHeaderCell>SLA</TableHeaderCell>
            <TableHeaderCell>Выплата</TableHeaderCell>
            <TableHeaderCell>USDT кошелёк</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="font-medium text-gray-950 dark:text-gray-50">
                  <Avatar member={member} />
                </div>
                <div className="mt-1 text-xs text-gray-500">{member.specialization}</div>
              </TableCell>
              <TableCell>{teamRoleLabels[member.role] ?? member.role}</TableCell>
              <TableCell>
                {member.level ? (
                  <Badge variant="neutral">{designerLevelLabels[member.level as DesignerLevel]}</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <span className={cx("size-2 rounded-full", statusDots[member.status])} />
                  {statusLabels[member.status]}
                </span>
              </TableCell>
              <TableCell><ProgressBar value={member.workload} /></TableCell>
              <TableCell>{member.activeOrders}</TableCell>
              <TableCell>{member.completedCreatives || "—"}</TableCell>
              <TableCell>{member.sla}%</TableCell>
              <TableCell>
                {member.payoutDue ? (
                  <span className="font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(member.payoutDue)}
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {member.usdtWallet ? (
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {member.usdtWallet.slice(0, 8)}…
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

export function ClientTable({ rows = clients }: { rows?: Client[] }) {
  const getClientLastOrder = (clientId: string) =>
    orders.find((order) => order.clientId === clientId)
  const getClientPostpaidDebt = (clientId: string) =>
    paymentInvoices
      .filter(
        (invoice) =>
          invoice.clientId === clientId &&
          invoice.kind === "postpaid" &&
          invoice.status !== "paid",
      )
      .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Клиент</TableHeaderCell>
            <TableHeaderCell>Режим оплаты</TableHeaderCell>
            <TableHeaderCell>Последний заказ</TableHeaderCell>
            <TableHeaderCell>Заказы</TableHeaderCell>
            <TableHeaderCell>Баланс</TableHeaderCell>
            <TableHeaderCell>Долг постоплата</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((client) => {
            const lastOrder = getClientLastOrder(client.id)
            const postpaidDebt = getClientPostpaidDebt(client.id)

            return (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-gray-950 dark:text-gray-50">
                  {client.name}
                </TableCell>
                <TableCell>
                  <Select defaultValue={client.paymentTerms}>
                    <SelectTrigger className="min-w-36 py-1.5">
                      <SelectValue placeholder="Режим оплаты" />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Предоплата</SelectItem>
                    <SelectItem value="deposit">Депозит</SelectItem>
                    <SelectItem value="postpaid">Постоплата</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
                <TableCell>
                  {lastOrder ? (
                    <span>
                      <span className="block font-medium text-gray-950 dark:text-gray-50">
                        {lastOrder.id}
                      </span>
                      <span className="text-xs text-gray-500">{lastOrder.deadlineLabel}</span>
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{client.activeOrders}</TableCell>
                <TableCell>{formatCurrency(client.balance)}</TableCell>
                <TableCell className={postpaidDebt ? "text-rose-600 dark:text-rose-400" : ""}>
                  {postpaidDebt ? formatCurrency(postpaidDebt) : "—"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

export function OrderTable({
  rows = orders,
  compact = false,
  onSelect,
}: {
  rows?: Order[]
  compact?: boolean
  onSelect?: (order: Order) => void
}) {
  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Заказ</TableHeaderCell>
            <TableHeaderCell>Клиент</TableHeaderCell>
            <TableHeaderCell>Параметры</TableHeaderCell>
            <TableHeaderCell>Статус</TableHeaderCell>
            <TableHeaderCell>Команда</TableHeaderCell>
            <TableHeaderCell>Прогресс</TableHeaderCell>
            <TableHeaderCell>Дедлайн</TableHeaderCell>
            <TableHeaderCell>Сумма</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((order) => {
            const client = getClient(order.clientId)
            const designer = getTeamMember(order.designerId)
            const manager = getTeamMember(order.managerId)
            const progress = Math.round((order.completedCreatives / order.packageSize) * 100)

            return (
              <TableRow
                key={order.id}
                onClick={() => onSelect?.(order)}
                className={cx(
                  onSelect &&
                    "cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-900/60",
                )}
              >
                <TableCell>
                  <div className="font-medium text-gray-950 dark:text-gray-50">{order.id}</div>
                  <div className="mt-1 max-w-64 truncate text-xs text-gray-500">{order.title}</div>
                  <div className="mt-1 text-xs text-gray-500">{order.creativeType} · {order.language}</div>
                </TableCell>
                <TableCell>
                  <div>{client?.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{order.vertical} · {order.geo.join(", ")}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-56 truncate text-sm text-gray-900 dark:text-gray-100">
                    {order.imageFormats.join(", ")}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <PriorityLabel priority={order.priority} />
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Avatar member={designer} />
                    {!compact && <div className="text-xs text-gray-500">PM: {manager?.name}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm tabular-nums">
                    {order.completedCreatives}/{order.packageSize}
                  </div>
                  <ProgressBar value={progress} />
                </TableCell>
                <TableCell>
                  <div className={order.priority === "high" ? "font-medium text-rose-600 dark:text-rose-400" : ""}>
                    {order.deadlineLabel}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{order.deadline}</div>
                </TableCell>
                <TableCell>{formatCurrency(order.price)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

export function TeamPage() {
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")

  return (
    <>
      <PageHeader
        title="Команда"
        description="Менеджеры и дизайнеры проекта: загрузка, SLA, активные заказы, выплаты и производительность."
        action={
          <Button className="gap-2" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Инвайт
          </Button>
        }
      />
      <MetricGrid>
        <MetricCard label="Сотрудников" value={`${team.length}`} delta="2 менеджера" tone="neutral" />
        <MetricCard label="Средняя загрузка" value={`${Math.round(team.reduce((sum, member) => sum + member.workload, 0) / team.length)}%`} delta="+4%" />
        <MetricCard label="Средний SLA" value={`${Math.round(team.reduce((sum, member) => sum + member.sla, 0) / team.length)}%`} delta="стабильно" tone="neutral" />
        <MetricCard label="Выплаты дизайнерам" value={formatCurrency(team.reduce((sum, member) => sum + member.payoutDue, 0))} delta="май" />
      </MetricGrid>
      <Toolbar search="Поиск по команде...">
        <Select defaultValue="all">
          <SelectTrigger className="py-1.5 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="manager">Менеджеры</SelectItem>
            <SelectItem value="designer">Дизайнеры</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>
      <TeamTable />
      <Drawer open={inviteOpen} onOpenChange={setInviteOpen}>
        <DrawerContent className="sm:max-w-md">
          <DrawerHeader>
            <DrawerTitle>Инвайт в команду</DrawerTitle>
            <DrawerDescription>
              Введите почту сотрудника, которому нужно отправить приглашение.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <LabeledField label="Email">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="designer@creometrics.local"
              />
            </LabeledField>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Закрыть
            </Button>
            <Button
              className="gap-2"
              disabled={!inviteEmail.includes("@")}
              onClick={() => setInviteOpen(false)}
            >
              <UserPlus className="size-4" />
              Отправить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export function ClientsPage() {
  const [clientOpen, setClientOpen] = React.useState(false)
  const [clientName, setClientName] = React.useState("")
  const [clientManagerId, setClientManagerId] = React.useState("tm-1")
  const [clientBalance, setClientBalance] = React.useState("")
  const [clientPaymentTerms, setClientPaymentTerms] = React.useState<PaymentMethod>("prepaid")
  const managerOptions = team.filter((member) => member.role === "manager")

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Клиентские балансы, вертикали, GEO, активные заказы и менеджеры аккаунтов."
        action={
          <Button className="gap-2" onClick={() => setClientOpen(true)}>
            <Plus className="size-4" />
            Новый клиент
          </Button>
        }
      />
      <MetricGrid>
        <MetricCard label="Активных клиентов" value={`${clients.filter((client) => client.status !== "paused").length}`} delta="+1 за неделю" />
        <MetricCard label="LTV базы" value={formatCurrency(clients.reduce((sum, client) => sum + client.ltv, 0))} delta="+14%" />
        <MetricCard label="Баланс клиентов" value={formatCurrency(clients.reduce((sum, client) => sum + client.balance, 0))} delta="доступно" tone="neutral" />
        <MetricCard label="Долги" value={formatCurrency(clients.reduce((sum, client) => sum + client.debt, 0))} delta="нужен follow-up" tone="down" />
      </MetricGrid>
      <Toolbar search="Поиск клиентов...">
        <Button variant="secondary" className="gap-2 py-1.5">
          <Filter className="size-4 text-gray-400" />
          Фильтры
        </Button>
      </Toolbar>
      <ClientTable />
      <Drawer open={clientOpen} onOpenChange={setClientOpen}>
        <DrawerContent className="sm:max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Новый клиент</DrawerTitle>
            <DrawerDescription>
              Карточка клиента для заказов, баланса и условий оплаты.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledField label="Название клиента">
                <Input
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Например: Lead Hunters Team"
                />
              </LabeledField>
              <LabeledField label="Менеджер">
                <Select value={clientManagerId} onValueChange={setClientManagerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите менеджера" />
                  </SelectTrigger>
                  <SelectContent>
                    {managerOptions.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>
              <LabeledField label="Стартовый депозит, USD">
                <Input
                  type="number"
                  enableStepper={false}
                  min={0}
                  value={clientBalance}
                  onChange={(event) => setClientBalance(event.target.value)}
                  placeholder="0"
                />
              </LabeledField>
              <LabeledField label="Условия оплаты">
                <Select
                  value={clientPaymentTerms}
                  onValueChange={(value) => setClientPaymentTerms(value as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите условия" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Оплата сразу</SelectItem>
                    <SelectItem value="deposit">Депозит</SelectItem>
                    <SelectItem value="postpaid">Постоплата</SelectItem>
                  </SelectContent>
                </Select>
              </LabeledField>
              <div className="sm:col-span-2">
                <LabeledField label="Комментарий">
                  <textarea
                    className={textareaClassName}
                    placeholder="Контакты, лимиты постоплаты, особенности согласования."
                  />
                </LabeledField>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={() => setClientOpen(false)}>
              Закрыть
            </Button>
            <Button disabled={!clientName.trim()} onClick={() => setClientOpen(false)}>
              Создать клиента
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function OrderDrawer({
  open,
  onOpenChange,
  mode,
  order,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "details" | "create" | "brief" | "payment"
  order?: Order | null
}) {
  const client = order ? getClient(order.clientId) : undefined
  const manager = order ? getTeamMember(order.managerId) : undefined
  const designer = order ? getTeamMember(order.designerId) : undefined
  const progress = order
    ? Math.round((order.completedCreatives / order.packageSize) * 100)
    : 0
  const geoOptions = React.useMemo(() => getGeoOptions(), [])
  const designerOptions = React.useMemo(
    () => team.filter((member) => member.role === "designer"),
    [],
  )
  const [manualClient, setManualClient] = React.useState(false)
  const [selectedClientId, setSelectedClientId] = React.useState(clients[0]?.id ?? "")
  const [manualClientName, setManualClientName] = React.useState("")
  const [selectedDesignerId, setSelectedDesignerId] = React.useState(
    designerOptions[0]?.id ?? "",
  )
  const [creativeType, setCreativeType] = React.useState(creativeTypes[0])
  const [geoFields, setGeoFields] = React.useState<string[]>([geoOptions[0]?.code ?? "US"])
  const [imageFormatFields, setImageFormatFields] = React.useState<string[]>([imageFormats[0]])
  const [language, setLanguage] = React.useState("")
  const [priority, setPriority] = React.useState<Order["priority"]>("medium")
  const [deadlineMode, setDeadlineMode] = React.useState<DeadlineMode>("duration")
  const [deadlineDate, setDeadlineDate] = React.useState("")
  const [deadlineDuration, setDeadlineDuration] = React.useState(deadlineDurations[1])
  const [briefMode, setBriefMode] = React.useState<BriefMode>("single")
  const [singleBrief, setSingleBrief] = React.useState("")
  const [creativeCount, setCreativeCount] = React.useState(1)
  const [splitBriefs, setSplitBriefs] = React.useState<string[]>([""])
  const [budget, setBudget] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    clients[0]?.paymentTerms ?? "prepaid",
  )
  const [calculatorOpen, setCalculatorOpen] = React.useState(false)
  const [calculatorPrices, setCalculatorPrices] = React.useState<Record<CalculatorKey, string>>({
    creative: "",
    adapt: "",
    resize: "",
  })
  const [calculatorCounts, setCalculatorCounts] = React.useState<Record<CalculatorCountKey, number>>({
    creative: 1,
  })

  React.useEffect(() => {
    if (!open || mode !== "create") return

    setManualClient(false)
    setSelectedClientId(clients[0]?.id ?? "")
    setManualClientName("")
    setSelectedDesignerId(designerOptions[0]?.id ?? "")
    setCreativeType(creativeTypes[0])
    setGeoFields([geoOptions[0]?.code ?? "US"])
    setImageFormatFields([imageFormats[0]])
    setLanguage("")
    setPriority("medium")
    setDeadlineMode("duration")
    setDeadlineDate("")
    setDeadlineDuration(deadlineDurations[1])
    setBriefMode("single")
    setSingleBrief("")
    setCreativeCount(1)
    setSplitBriefs([""])
    setBudget("")
    setPaymentMethod(clients[0]?.paymentTerms ?? "prepaid")
    setCalculatorOpen(false)
    setCalculatorPrices({ creative: "", adapt: "", resize: "" })
    setCalculatorCounts({ creative: 1 })
  }, [designerOptions, geoOptions, mode, open])

  React.useEffect(() => {
    setSplitBriefs((currentBriefs) =>
      Array.from({ length: creativeCount }, (_, index) => currentBriefs[index] ?? ""),
    )
    setCalculatorCounts((currentCounts) => ({
      ...currentCounts,
      creative: creativeCount,
    }))
  }, [creativeCount])

  React.useEffect(() => {
    if (manualClient) {
      setPaymentMethod("prepaid")
      return
    }

    const currentClient = clients.find((clientItem) => clientItem.id === selectedClientId)
    setPaymentMethod(currentClient?.paymentTerms ?? "prepaid")
  }, [manualClient, selectedClientId])

  const billableGeoCount = Math.max(geoFields.length - 1, 0)
  const billableFormatCount = Math.max(imageFormatFields.length - 1, 0)
  const calculatorCreativeCount = calculatorCounts.creative
  const calculatorTotal =
    toNumber(calculatorPrices.creative) * calculatorCreativeCount +
    toNumber(calculatorPrices.adapt) * billableGeoCount * calculatorCreativeCount +
    toNumber(calculatorPrices.resize) * billableFormatCount * calculatorCreativeCount
  const clientIsValid = manualClient
    ? manualClientName.trim().length > 0
    : selectedClientId.length > 0
  const geoIsValid = geoFields.some((geo) => geo.length > 0)
  const briefIsValid =
    briefMode === "single"
      ? singleBrief.trim().length > 0
      : splitBriefs.length === creativeCount &&
        splitBriefs.every((brief) => brief.trim().length > 0)
  const budgetIsValid = toNumber(budget) > 0
  const selectedClient = clients.find((clientItem) => clientItem.id === selectedClientId)
  const budgetValue = toNumber(budget)
  const depositBalance = manualClient ? 0 : (selectedClient?.balance ?? 0)
  const depositAfterOrder = depositBalance - budgetValue
  const depositIsAvailable = paymentMethod !== "deposit" || (!manualClient && depositAfterOrder >= 0)
  const createDisabled = !(
    clientIsValid &&
    geoIsValid &&
    briefIsValid &&
    budgetIsValid &&
    depositIsAvailable
  )

  const addGeoField = () => {
    const nextGeo =
      geoOptions.find((geo) => !geoFields.includes(geo.code))?.code ??
      geoOptions[0]?.code ??
      "US"
    setGeoFields((currentGeoFields) => [...currentGeoFields, nextGeo])
  }

  const addImageFormatField = () => {
    const nextFormat =
      imageFormats.find((format) => !imageFormatFields.includes(format)) ??
      imageFormats[0]
    setImageFormatFields((currentFormats) => [...currentFormats, nextFormat])
  }

  const applyCalculatorTotal = () => {
    if (calculatorTotal <= 0) return
    setBudget(Number(calculatorTotal.toFixed(2)).toString())
    setCalculatorOpen(false)
  }

  const titles = {
    details: order ? `${order.id}: ${order.title}` : "Детали заказа",
    create: "Создание заказа",
    brief: order ? `ТЗ по заказу ${order.id}` : "Техническое задание",
    payment: order ? `Оплата ${order.id}` : "Оплата заказа",
  }

  const descriptions = {
    details: "Подробная карточка заказа, команда, прогресс, дедлайн и клиентский контекст.",
    create: "Заполните клиента, сроки, бюджет, производство и ТЗ для передачи заказа в работу.",
    brief: "ТЗ, ограничения, форматы и требования к сдаче креативов.",
    payment: "Счет, клиентский баланс, выплата дизайнеру и состояние оплаты.",
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>{titles[mode]}</DrawerTitle>
          <DrawerDescription>{descriptions[mode]}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {mode === "create" ? (
            <div className="space-y-5">
              <FormSection title="Основное">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <LabeledField
                    label="Клиент"
                    action={
                      <InlineToggle
                        checked={manualClient}
                        onChange={setManualClient}
                        label="Ручной ввод"
                      />
                    }
                  >
                    {manualClient ? (
                      <Input
                        value={manualClientName}
                        onChange={(event) => setManualClientName(event.target.value)}
                        placeholder="Введите имя клиента"
                      />
                    ) : (
                      <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите клиента" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((clientItem) => (
                            <SelectItem key={clientItem.id} value={clientItem.id}>
                              {clientItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </LabeledField>
                  <LabeledField label="Дизайнер">
                    <Select value={selectedDesignerId} onValueChange={setSelectedDesignerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите дизайнера" />
                      </SelectTrigger>
                      <SelectContent>
                        {designerOptions.map((designerItem) => (
                          <SelectItem key={designerItem.id} value={designerItem.id}>
                            {designerItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </LabeledField>
                  <LabeledField label="Приоритет">
                    <Select value={priority} onValueChange={(value) => setPriority(value as Order["priority"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приоритет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low"><PriorityLabel priority="low" /></SelectItem>
                        <SelectItem value="medium"><PriorityLabel priority="medium" /></SelectItem>
                        <SelectItem value="high"><PriorityLabel priority="high" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </LabeledField>
                  <div>
                    <div className="mb-1.5 flex min-h-5 items-center">
                      <label className="text-sm font-medium text-gray-950 dark:text-gray-50">
                        Дедлайн
                      </label>
                    </div>
                    <div className="grid grid-cols-[132px_1fr] gap-2">
                      <SegmentedControl
                        value={deadlineMode}
                        onChange={setDeadlineMode}
                        className="h-10"
                        options={[
                          { value: "duration", label: "Срок" },
                          { value: "date", label: "Дата" },
                        ]}
                      />
                      {deadlineMode === "date" ? (
                        <Input
                          type="datetime-local"
                          value={deadlineDate}
                          onChange={(event) => setDeadlineDate(event.target.value)}
                        />
                      ) : (
                        <Select value={deadlineDuration} onValueChange={setDeadlineDuration}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите срок" />
                          </SelectTrigger>
                          <SelectContent>
                            {deadlineDurations.map((duration) => (
                              <SelectItem key={duration} value={duration}>
                                {duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Бюджет">
                <LabeledField label="Бюджет, USD">
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      type="number"
                      enableStepper={false}
                      min={0}
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                      placeholder="0"
                    />
                    <Button
                      type="button"
                      variant={calculatorOpen ? "primary" : "secondary"}
                      className="gap-2 px-3"
                      onClick={() => setCalculatorOpen((current) => !current)}
                    >
                      <Calculator className="size-4" />
                      Калькулятор
                    </Button>
                  </div>
                </LabeledField>
                {calculatorOpen && (
                  <div className="mt-4">
                    <BudgetCalculatorPanel
                      calculatorTotal={calculatorTotal}
                      calculatorPrices={calculatorPrices}
                      calculatorCounts={calculatorCounts}
                      billableGeoCount={billableGeoCount}
                      totalGeoCount={geoFields.length}
                      billableFormatCount={billableFormatCount}
                      totalFormatCount={imageFormatFields.length}
                      setCalculatorPrices={setCalculatorPrices}
                      setCalculatorCounts={setCalculatorCounts}
                      applyCalculatorTotal={applyCalculatorTotal}
                    />
                  </div>
                )}
              </FormSection>

              <FormSection
                title="Оплата"
                description="Менеджер выбирает сценарий оплаты при оформлении ТЗ."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <LabeledField label="Способ оплаты">
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                      disabled={!manualClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите способ оплаты" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prepaid">Оплата сразу</SelectItem>
                        <SelectItem value="deposit">Депозит</SelectItem>
                        <SelectItem value="postpaid">Постоплата</SelectItem>
                      </SelectContent>
                    </Select>
                    {!manualClient && (
                      <p className="mt-1.5 text-xs text-gray-500">
                        Режим подтянут из карточки клиента: {paymentTermsLabels[paymentMethod]}.
                      </p>
                    )}
                  </LabeledField>
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-gray-900/40">
                    {paymentMethod === "prepaid" && (
                      <>
                        <p className="font-medium text-gray-950 dark:text-gray-50">
                          Счет попадет в раздел счетов на оплату
                        </p>
                        <p className="mt-1 text-gray-500">
                          Заказ ждет подтверждения в разделе счетов. После подтверждения менеджером статус можно менять на оплаченный.
                        </p>
                      </>
                    )}
                    {paymentMethod === "deposit" && (
                      <>
                        <p className="font-medium text-gray-950 dark:text-gray-50">
                          Списание с внутреннего баланса клиента
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <MetricMini label="Баланс" value={formatCurrency(depositBalance)} />
                          <MetricMini label="Сумма" value={formatCurrency(budgetValue)} />
                          <MetricMini label="Остаток" value={formatCurrency(depositAfterOrder)} />
                        </div>
                        {!depositIsAvailable && (
                          <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                            Для депозита нужен зарегистрированный клиент с достаточным балансом.
                          </p>
                        )}
                      </>
                    )}
                    {paymentMethod === "postpaid" && (
                      <>
                        <p className="font-medium text-gray-950 dark:text-gray-50">
                          Заказ уйдет в долг клиента
                        </p>
                        <p className="mt-1 text-gray-500">
                          Заказ считается оплаченным по условиям клиента, сумма уйдет в долг постоплаты и будет погашаться отдельно.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="Производство"
                description="Тип креатива, язык, форматы и GEO для ресайзов и адаптов."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <LabeledField label="Тип креатива">
                    <Select value={creativeType} onValueChange={setCreativeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        {creativeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </LabeledField>
                  <LabeledField label="Язык">
                    <Input
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      placeholder="Например: русский, английский, испанский"
                    />
                  </LabeledField>
                </div>

                <div className="mt-4 rounded-md border border-gray-200 p-3 dark:border-gray-800">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-gray-950 dark:text-gray-50">
                      Форматы изображения
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2 py-1.5"
                      onClick={addImageFormatField}
                    >
                      <Plus className="size-4" />
                      Добавить формат
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {imageFormatFields.map((format, index) => (
                      <div key={`${format}-${index}`} className="flex items-center gap-2">
                        <Select
                          value={format}
                          onValueChange={(nextFormat) =>
                            setImageFormatFields((currentFormats) =>
                              currentFormats.map((currentFormat, formatIndex) =>
                                formatIndex === index ? nextFormat : currentFormat,
                              ),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите формат" />
                          </SelectTrigger>
                          <SelectContent>
                            {imageFormats.map((formatOption) => (
                              <SelectItem key={formatOption} value={formatOption}>
                                {formatOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="size-10 shrink-0 p-0 text-gray-500"
                            aria-label="Удалить формат"
                            onClick={() =>
                              setImageFormatFields((currentFormats) =>
                                currentFormats.filter((_, formatIndex) => formatIndex !== index),
                              )
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-gray-200 p-3 dark:border-gray-800">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-gray-950 dark:text-gray-50">
                      GEO
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2 py-1.5"
                      onClick={addGeoField}
                    >
                      <Plus className="size-4" />
                      Добавить GEO
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {geoFields.map((geo, index) => (
                      <div key={`${geo}-${index}`} className="flex items-start gap-2">
                        <GeoPicker
                          value={geo}
                          options={geoOptions}
                          onChange={(nextGeo) =>
                            setGeoFields((currentGeoFields) =>
                              currentGeoFields.map((currentGeo, geoIndex) =>
                                geoIndex === index ? nextGeo : currentGeo,
                              ),
                            )
                          }
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-1 size-10 shrink-0 p-0 text-gray-500"
                            aria-label="Удалить GEO"
                            onClick={() =>
                              setGeoFields((currentGeoFields) =>
                                currentGeoFields.filter((_, geoIndex) => geoIndex !== index),
                              )
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FormSection>

              <FormSection title="Техническое задание">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mt-1 text-xs text-gray-500">
                      Выберите единое ТЗ для всего заказа или отдельное ТЗ под каждый креатив.
                    </p>
                  </div>
                  <SegmentedControl
                    value={briefMode}
                    onChange={setBriefMode}
                    options={[
                      { value: "single", label: "Единое ТЗ" },
                      { value: "split", label: "Раздельное ТЗ" },
                    ]}
                  />
                </div>
                {briefMode === "single" ? (
                  <div className="mt-4">
                    <textarea
                      value={singleBrief}
                      onChange={(event) => setSingleBrief(event.target.value)}
                      placeholder="Опишите оффер, аудиторию, форматы, референсы, запреты и требования к сдаче."
                      className={textareaClassName}
                    />
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Количество креативов
                      </span>
                      <CounterControl
                        value={creativeCount}
                        min={1}
                        max={50}
                        onChange={setCreativeCount}
                      />
                    </div>
                    <div className="space-y-3">
                      {splitBriefs.map((brief, index) => (
                        <div key={index}>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            ТЗ креатива #{index + 1}
                          </label>
                          <textarea
                            value={brief}
                            onChange={(event) =>
                              setSplitBriefs((currentBriefs) =>
                                currentBriefs.map((currentBrief, briefIndex) =>
                                  briefIndex === index
                                    ? event.target.value
                                    : currentBrief,
                                ),
                              )
                            }
                            placeholder="Отдельная гипотеза, угол, формат, текст или референс."
                            className={cx(textareaClassName, "min-h-24")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>
            </div>
          ) : mode === "brief" ? (
            <div className="space-y-5 text-sm">
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                <p className="font-medium text-gray-950 dark:text-gray-50">Цель</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {order
                    ? getOrderBrief(order)
                    : "Подготовить пакет креативов для performance-теста: 3 визуальные гипотезы, короткие хуки, локализация и варианты CTA для A/B запуска."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Статика 1080x1080", "Stories 1080x1920", "Видео до 15 сек", "Preview для клиента"].map((item) => (
                  <div key={item} className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-950 dark:text-gray-50">Ограничения</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
                  <li>Без запрещенных claim-ов и медицинских гарантий.</li>
                  <li>Тексты на языке GEO, без машинного тона.</li>
                  <li>Сдача исходников и превью в клиентскую папку.</li>
                </ul>
              </div>
            </div>
          ) : mode === "payment" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricMini label="Сумма заказа" value={formatCurrency(order?.price ?? 0)} />
                <MetricMini label="Выплата дизайнеру" value={formatCurrency(order?.payout ?? 0)} />
                <MetricMini label="Маржа" value={formatCurrency((order?.price ?? 0) - (order?.payout ?? 0))} />
              </div>
              <div className="rounded-md border border-gray-200 p-4 text-sm dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Клиент</span>
                  <span className="font-medium text-gray-950 dark:text-gray-50">{client?.name}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500">Баланс клиента</span>
                  <span>{formatCurrency(client?.balance ?? 0)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500">Статус</span>
                  {order && <StatusBadge status={order.status} />}
                </div>
              </div>
            </div>
          ) : order ? (
            <div className="space-y-5">
	              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
	                <MetricMini label="Клиент" value={client?.name ?? "—"} />
	                <MetricMini label="Прогресс" value={`${order.completedCreatives}/${order.packageSize}`} />
	                <MetricMini label="Дедлайн" value={order.deadlineLabel} />
	                <MetricMini label="Сумма" value={formatCurrency(order.price)} />
	              </div>
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
	                    <p className="font-medium text-gray-950 dark:text-gray-50">Статус и производство</p>
	                    <p className="mt-1 text-sm text-gray-500">
	                      {order.creativeType} · {order.language} · {order.geo.join(", ")}
	                    </p>
	                  </div>
	                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4">
                  <ProgressBar value={progress} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-950 dark:text-gray-50">Менеджер</p>
                  <div className="mt-3 text-sm"><Avatar member={manager} /></div>
                </div>
                <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-950 dark:text-gray-50">Дизайнер</p>
                  <div className="mt-3 text-sm"><Avatar member={designer} /></div>
                </div>
              </div>
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-950 dark:text-gray-50">Техническое задание</p>
                  <Badge variant="neutral">ТЗ</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {getOrderBrief(order)}
                </p>
	                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
	                  <MetricMini label="Тип" value={order.creativeType} />
	                  <MetricMini label="Язык" value={order.language} />
	                  <MetricMini label="Срок" value={order.deadlineLabel} />
	                  <MetricMini label="Форматы" value={order.imageFormats.join(", ")} />
	                  <MetricMini label="GEO" value={order.geo.join(", ")} />
	                  <MetricMini label="Приоритет" value={getPriorityLabel(order.priority)} />
	                </div>
              </div>
            </div>
          ) : null}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          {mode === "create" && (
            <Button disabled={createDisabled} onClick={() => onOpenChange(false)}>
              Создать заказ
            </Button>
          )}
          {mode === "payment" && <Button>Выставить счет</Button>}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-gray-950 dark:text-gray-50">
        {value}
      </div>
    </div>
  )
}

function BudgetCalculatorPanel({
  calculatorTotal,
  calculatorPrices,
  calculatorCounts,
  billableGeoCount,
  totalGeoCount,
  billableFormatCount,
  totalFormatCount,
  setCalculatorPrices,
  setCalculatorCounts,
  applyCalculatorTotal,
}: {
  calculatorTotal: number
  calculatorPrices: Record<CalculatorKey, string>
  calculatorCounts: Record<CalculatorCountKey, number>
  billableGeoCount: number
  totalGeoCount: number
  billableFormatCount: number
  totalFormatCount: number
  setCalculatorPrices: React.Dispatch<React.SetStateAction<Record<CalculatorKey, string>>>
  setCalculatorCounts: React.Dispatch<React.SetStateAction<Record<CalculatorCountKey, number>>>
  applyCalculatorTotal: () => void
}) {
  return (
    <div
      className="rounded-md border border-blue-200 bg-blue-50/80 p-4 shadow-sm ring-1 ring-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:ring-blue-500/10"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          applyCalculatorTotal()
        }
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-950 dark:text-gray-50">
            Калькулятор бюджета
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Адапты и ресайзы считаются на каждый креатив: доп. GEO/форматы умножаются на количество крео.
          </p>
        </div>
        <Badge variant={calculatorTotal > 0 ? "success" : "neutral"}>
          {formatCalculatorCurrency(calculatorTotal)}
        </Badge>
      </div>
      <div className="space-y-3">
        <CalculatorRow
          label="Креативы"
          priceLabel="Цена за креатив"
          price={calculatorPrices.creative}
          count={calculatorCounts.creative}
          onPriceChange={(value) =>
            setCalculatorPrices((currentPrices) => ({
              ...currentPrices,
              creative: value,
            }))
          }
          onCountChange={(value) =>
            setCalculatorCounts((currentCounts) => ({
              ...currentCounts,
              creative: value,
            }))
          }
        />
        <CalculatorRow
          label="Адапты"
          priceLabel="Цена за адапт"
          price={calculatorPrices.adapt}
          count={billableGeoCount * calculatorCounts.creative}
          countLabel={`${billableGeoCount} доп. GEO × ${calculatorCounts.creative} крео`}
          onPriceChange={(value) =>
            setCalculatorPrices((currentPrices) => ({
              ...currentPrices,
              adapt: value,
            }))
          }
        />
        <CalculatorRow
          label="Ресайзы"
          priceLabel="Цена за ресайз"
          price={calculatorPrices.resize}
          count={billableFormatCount * calculatorCounts.creative}
          countLabel={`${billableFormatCount} доп. форматов × ${calculatorCounts.creative} крео`}
          onPriceChange={(value) =>
            setCalculatorPrices((currentPrices) => ({
              ...currentPrices,
              resize: value,
            }))
          }
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          className="gap-2"
          disabled={calculatorTotal <= 0}
          onClick={applyCalculatorTotal}
        >
          Готово
        </Button>
      </div>
    </div>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-md border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/45">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-50">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function LabeledField({
  label,
  action,
  children,
}: {
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex min-h-5 items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-950 dark:text-gray-50">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  )
}

function getGeoLabel(code: string, options: GeoOption[]) {
  const geo = options.find((option) => option.code === code)
  return geo ? `${geo.code} (${geo.country})` : code
}

function GeoPicker({
  value,
  options,
  onChange,
}: {
  value: string
  options: GeoOption[]
  onChange: (value: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return options

    return options.filter((option) => {
      const label = `${option.code} ${option.country}`.toLowerCase()
      return label.includes(normalizedQuery)
    })
  }, [options, query])

  return (
    <div className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-950">
      <Input
        value={open ? query : getGeoLabel(value, options)}
        onFocus={() => {
          setOpen(true)
          setQuery("")
        }}
        onChange={(event) => {
          setOpen(true)
          setQuery(event.target.value)
        }}
        placeholder="Начните вводить GEO или страну"
        inputClassName="py-1.5"
      />
      {open && (
        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
          {filteredOptions.slice(0, 40).map((option) => {
            const selected = value === option.code

            return (
              <button
                key={option.code}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.code)
                  setQuery("")
                  setOpen(false)
                }}
                className={cx(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition",
                  selected
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-white dark:text-gray-300 hover:dark:bg-gray-900",
                )}
              >
                <span className="font-medium">{option.code}</span>
                <span className={cx("text-xs", selected ? "text-blue-50" : "text-gray-500")}>
                  {option.country}
                </span>
              </button>
            )
          })}
          {filteredOptions.length === 0 && (
            <div className="rounded px-2 py-2 text-xs text-gray-500">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InlineToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200"
    >
      <span
        className={cx(
          "flex h-5 w-9 items-center rounded-full border p-0.5 transition",
          checked
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 bg-gray-100 dark:border-gray-800 dark:bg-gray-900",
        )}
      >
        <span
          className={cx(
            "size-3.5 rounded-full bg-white transition",
            checked && "translate-x-4",
          )}
        />
      </span>
      {label}
    </button>
  )
}

function SegmentedControl<TValue extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: TValue
  onChange: (value: TValue) => void
  options: { value: TValue; label: string }[]
  className?: string
}) {
  return (
    <div className={cx("grid grid-cols-2 rounded-md border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-950", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cx(
            "rounded px-3 py-1.5 text-sm font-medium transition",
            value === option.value
              ? "bg-white text-gray-950 shadow-sm dark:bg-gray-900 dark:text-gray-50"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CounterControl({
  value,
  min = 0,
  max = 999,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  const decrease = () => onChange(Math.max(min, value - 1))
  const increase = () => onChange(Math.min(max, value + 1))

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        className="size-8 rounded-full p-0"
        disabled={value <= min}
        onClick={decrease}
      >
        <Minus className="size-4" />
      </Button>
      <span className="flex h-8 min-w-10 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-semibold tabular-nums text-gray-950 dark:border-gray-800 dark:text-gray-50">
        {value}
      </span>
      <Button
        type="button"
        variant="secondary"
        className="size-8 rounded-full p-0"
        disabled={value >= max}
        onClick={increase}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

function CalculatorRow({
  label,
  priceLabel,
  price,
  count,
  countLabel,
  onPriceChange,
  onCountChange,
}: {
  label: string
  priceLabel: string
  price: string
  count: number
  countLabel?: string
  onPriceChange: (value: string) => void
  onCountChange?: (value: number) => void
}) {
  const subtotal = toNumber(price) * count

  return (
    <div className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-white p-3 sm:grid-cols-[1fr_auto_auto] sm:items-end dark:border-gray-800 dark:bg-gray-925">
      <LabeledField label={priceLabel}>
        <Input
          type="number"
          enableStepper={false}
          min={0}
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder="0"
        />
      </LabeledField>
      <div>
        <div className="mb-1.5 text-sm font-medium text-gray-950 dark:text-gray-50">
          {label}
        </div>
        {onCountChange ? (
          <CounterControl value={count} min={0} max={999} onChange={onCountChange} />
        ) : (
          <div className="flex h-8 min-w-24 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-3 text-sm font-semibold tabular-nums text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            {countLabel ?? count}
          </div>
        )}
      </div>
      <div className="rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-950">
        <div className="text-xs text-gray-500">Сумма</div>
        <div className="mt-1 font-semibold tabular-nums text-gray-950 dark:text-gray-50">
          {formatCalculatorCurrency(subtotal)}
        </div>
      </div>
    </div>
  )
}

const dailyCreativeStats: Record<string, number[]> = {
  "tm-3": [14, 12, 16, 9, 11],
  "tm-4": [11, 15, 10, 13, 8],
  "tm-5": [8, 9, 12, 7, 10],
  "tm-6": [16, 10, 14, 12, 13],
}

const leaderboardDays = ["Пн", "Вт", "Ср", "Чт", "Пт"]

function getLeaderboardRows() {
  const designers = team.filter((member) => member.role === "designer")

  return designers
    .map((designer) => {
      const daily = dailyCreativeStats[designer.id] ?? [0, 0, 0, 0, 0]
      const stars = daily.reduce((sum, _, dayIndex) => {
        const dayRank = designers
          .map((member) => ({
            id: member.id,
            value: dailyCreativeStats[member.id]?.[dayIndex] ?? 0,
          }))
          .sort((a, b) => b.value - a.value)
          .findIndex((item) => item.id === designer.id)

        return sum + Math.max(5 - dayRank, 0)
      }, 0)
      const weekCreatives = daily.reduce((sum, value) => sum + value, 0)
      const workDays = daily.filter((value) => value > 0).length || 1

      return {
        ...designer,
        daily,
        stars,
        weekCreatives,
        avgPerDay: Number((weekCreatives / workDays).toFixed(1)),
      }
    })
    .sort((a, b) => b.stars - a.stars || b.avgPerDay - a.avgPerDay)
}

export function LeaderboardPage() {
  const designers = getLeaderboardRows()
  const leader = designers[0]
  const totalStars = designers.reduce((sum, designer) => sum + designer.stars, 0)
  const totalWeekCreatives = designers.reduce((sum, designer) => sum + designer.weekCreatives, 0)

  return (
    <>
      <PageHeader
        title="Лидерборд"
        description="Рейтинг дизайнеров по рабочим дням: 1 место получает 5 звезд, 2 место — 4, дальше до 1 звезды за 5 место."
      />
      <MetricGrid>
        <MetricCard label="Лидер недели" value={leader?.name ?? "—"} delta={`${leader?.stars ?? 0} звезд`} />
        <MetricCard label="Крео за неделю" value={`${totalWeekCreatives}`} delta="по всем дизайнерам" />
        <MetricCard label="Всего звезд" value={`${totalStars}`} delta="начислено за 5 дней" tone="neutral" />
        <MetricCard label="Лучший темп" value={`${leader?.avgPerDay ?? 0}/день`} delta="крео за рабочий день" />
      </MetricGrid>
      <section className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-800">
        <SectionTitle
          title="Рейтинг по звездам"
          description="Чем чаще дизайнер попадает в дневной топ по количеству выполненных крео, тем выше глобальный рейтинг."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-4">
          {designers.map((designer, index) => (
            <div
              key={designer.id}
              className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-50">
                    #{index + 1}
                  </div>
                  <Avatar member={designer} />
                </div>
                <Badge variant={index === 0 ? "success" : index === 1 ? "default" : "neutral"}>
                  {designer.stars} звезд
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <MetricMini label="Неделя" value={`${designer.weekCreatives}`} />
                <MetricMini label="В день" value={`${designer.avgPerDay}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="p-4 sm:p-6">
          <SectionTitle
            title="Дневные результаты"
            description="Простая таблица: сколько крео сделал дизайнер за каждый рабочий день и сколько звезд получил."
          />
        </div>
        <TableRoot className="border-t border-gray-200 dark:border-gray-800">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Место</TableHeaderCell>
                <TableHeaderCell>Дизайнер</TableHeaderCell>
                {leaderboardDays.map((day) => (
                  <TableHeaderCell key={day}>{day}</TableHeaderCell>
                ))}
                <TableHeaderCell>Неделя</TableHeaderCell>
                <TableHeaderCell>Крео/день</TableHeaderCell>
                <TableHeaderCell>Звезды</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {designers.map((designer, index) => (
                <TableRow key={designer.id}>
                  <TableCell className="font-semibold text-gray-950 dark:text-gray-50">#{index + 1}</TableCell>
                  <TableCell><Avatar member={designer} /></TableCell>
                  {designer.daily.map((value, dayIndex) => (
                    <TableCell key={`${designer.id}-${dayIndex}`}>{value}</TableCell>
                  ))}
                  <TableCell>{designer.weekCreatives}</TableCell>
                  <TableCell>{designer.avgPerDay}</TableCell>
                  <TableCell>
                    <Badge variant={index === 0 ? "success" : "neutral"}>{designer.stars}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </section>
    </>
  )
}

function OrdersKanban({
  rows,
  onSelect,
  onChange,
  onStatusChange,
}: {
  rows: Order[]
  onSelect: (order: Order) => void
  onChange: (orders: Order[]) => void
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
}) {
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null)
  const activeOrder = activeOrderId
    ? rows.find((order) => order.id === activeOrderId)
    : null
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveOrderId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id)
    const overId = event.over ? String(event.over.id) : null
    setActiveOrderId(null)

    if (!overId) return

    const activeItem = rows.find((order) => order.id === activeId)
    const overOrder = rows.find((order) => order.id === overId)
    const overColumn = kanbanColumns.find((column) => column.id === overId)
    const targetColumnId = overOrder
      ? getKanbanColumnId(overOrder.status)
      : overColumn?.id

    if (!activeItem || !targetColumnId) return

    const targetStatus = kanbanColumns.find(
      (column) => column.id === targetColumnId,
    )?.targetStatus

    if (!targetStatus) return

    const statusUpdatedRows = rows.map((order) =>
      order.id === activeId ? { ...order, status: targetStatus } : order,
    )

    if (!overOrder || activeId === overId) {
      onChange(statusUpdatedRows)
      return
    }

    const oldIndex = statusUpdatedRows.findIndex((order) => order.id === activeId)
    const newIndex = statusUpdatedRows.findIndex((order) => order.id === overId)

    onChange(arrayMove(statusUpdatedRows, oldIndex, newIndex))
  }

  return (
    <div className="max-w-full overflow-hidden border-t border-gray-200 dark:border-gray-800">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveOrderId(null)}
      >
        <div className="max-w-full overflow-x-auto overscroll-x-contain px-4 py-5 sm:px-6">
          <div className="flex w-max max-w-none gap-4">
            {kanbanColumns.map((column) => {
              const columnOrders = getKanbanColumnOrders(rows, column.id)

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  orders={columnOrders}
                  onSelect={onSelect}
                  onStatusChange={onStatusChange}
                />
              )
            })}
          </div>
        </div>
        <DragOverlay>
          {activeOrder ? (
            <KanbanCard order={activeOrder} onSelect={() => undefined} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function KanbanColumn({
  column,
  orders,
  onSelect,
  onStatusChange,
}: {
  column: (typeof kanbanColumns)[number]
  orders: Order[]
  onSelect: (order: Order) => void
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <section
      ref={setNodeRef}
      className={cx(
        "flex h-[calc(100vh-17rem)] min-h-[520px] w-[320px] shrink-0 flex-col rounded-md border border-gray-200 bg-gray-50/80 transition dark:border-gray-800 dark:bg-gray-900/35",
        isOver &&
          "border-blue-400 bg-blue-50/70 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-500/10",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-3 dark:border-gray-800">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cx("h-6 w-1 rounded-full", column.accent)} />
          <h2 className="truncate text-sm font-semibold text-gray-950 dark:text-gray-50">
            {column.title}
          </h2>
          <span className="rounded-md bg-white px-2 py-0.5 text-xs tabular-nums text-gray-600 ring-1 ring-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:ring-gray-800">
            {orders.length}
          </span>
        </div>
        <Button variant="ghost" className="size-8 p-0" aria-label="Добавить заказ">
          <Plus className="size-4" />
        </Button>
      </div>
      <SortableContext
        items={orders.map((order) => order.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {orders.map((order) => (
            <SortableKanbanCard
              key={order.id}
              order={order}
              onSelect={onSelect}
              onStatusChange={onStatusChange}
            />
          ))}
          {orders.length === 0 && (
            <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white/60 p-3 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-950/40">
              Перетащите заказ сюда
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  )
}

function SortableKanbanCard({
  order,
  onSelect,
  onStatusChange,
}: {
  order: Order
  onSelect: (order: Order) => void
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <KanbanCard
      ref={setNodeRef}
      order={order}
      onSelect={onSelect}
      onStatusChange={onStatusChange}
      style={style}
      isDragging={isDragging}
      dragAttributes={attributes}
      dragListeners={listeners}
    />
  )
}

function getDeadlineUrgency(deadline: string): "overdue" | "soon" | "ok" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(deadline)
  deadlineDate.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "overdue"
  if (diffDays <= 2) return "soon"
  return "ok"
}

const KanbanCard = React.forwardRef<
  HTMLDivElement,
  {
    order: Order
    onSelect: (order: Order) => void
    onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
    style?: React.CSSProperties
    isDragging?: boolean
    overlay?: boolean
    dragAttributes?: React.HTMLAttributes<HTMLButtonElement>
    dragListeners?: React.HTMLAttributes<HTMLButtonElement>
  }
>(function KanbanCard(
  {
    order,
    onSelect,
    onStatusChange,
    style,
    isDragging,
    overlay,
    dragAttributes,
    dragListeners,
  },
  ref,
) {
  const { can } = useRole()
  const client = getClient(order.clientId)
  const designer = getTeamMember(order.designerId)
  const progress = Math.round((order.completedCreatives / order.packageSize) * 100)
  const urgency = getDeadlineUrgency(order.deadline)

  return (
    <div
      ref={ref}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect(order)
        }
      }}
      className={cx(
        "group rounded-md border bg-white text-left shadow-sm transition dark:bg-gray-950",
        urgency === "overdue"
          ? "border-rose-300 dark:border-rose-500/40"
          : urgency === "soon"
            ? "border-amber-300 dark:border-amber-500/40"
            : "border-gray-200 dark:border-gray-800",
        "hover:shadow-md",
        isDragging && "opacity-45",
        overlay && "w-[320px] rotate-2 shadow-xl ring-2 ring-blue-500/20",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-2.5 dark:border-gray-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-gray-950 dark:text-gray-50">
              {order.id}
            </span>
            <span
              className={cx(
                "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium",
                getPriorityClasses(order.priority),
              )}
            >
              <PriorityLabel priority={order.priority} />
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{order.title}</p>
        </div>
        <button
          type="button"
          aria-label="Перетащить заказ"
          className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
          {...dragAttributes}
          {...dragListeners}
          onClick={(event) => event.stopPropagation()}
        >
          <GripVertical className="size-4" />
        </button>
      </div>
      <div className="space-y-2.5 p-2.5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate font-medium text-gray-700 dark:text-gray-300">{client?.name ?? "Клиент"}</span>
          <span className="shrink-0 font-semibold tabular-nums text-gray-950 dark:text-gray-50">
            {formatCurrency(order.price)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="neutral">{order.creativeType}</Badge>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {order.geo.join(", ")}
          </span>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>{order.completedCreatives}/{order.packageSize} крео</span>
            <span>{progress}%</span>
          </div>
          <span className="block h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <span
              className={cx(
                "block h-full rounded-full",
                progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-blue-500" : "bg-amber-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px]">
          {designer ? (
            <span className="flex items-center gap-1.5 truncate text-gray-500">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[9px] font-semibold text-white dark:bg-gray-50 dark:text-gray-950">
                {designer.initials}
              </span>
              <span className="truncate">{designer.name}</span>
            </span>
          ) : (
            <span className="text-gray-400">Не назначен</span>
          )}
          <span
            className={cx(
              "shrink-0 flex items-center gap-1",
              urgency === "overdue"
                ? "text-rose-600 dark:text-rose-400"
                : urgency === "soon"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500",
            )}
          >
            <CalendarClock className="size-3" />
            {order.deadlineLabel}
          </span>
        </div>
        {onStatusChange && (
          <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-2 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            {order.status === "new" && can("assign_designer") && (
              <button
                type="button"
                onClick={() => onStatusChange(order.id, "assigned")}
                className="rounded bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25"
              >
                Назначить
              </button>
            )}
            {order.status === "assigned" && can("start_order") && (
              <button
                type="button"
                onClick={() => onStatusChange(order.id, "in_progress")}
                className="rounded bg-violet-100 px-2 py-1 text-[11px] font-medium text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25"
              >
                Приступить
              </button>
            )}
            {order.status === "in_progress" && can("submit_review") && (
              <button
                type="button"
                onClick={() => onStatusChange(order.id, "review")}
                className="rounded bg-orange-100 px-2 py-1 text-[11px] font-medium text-orange-700 transition hover:bg-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/25"
              >
                На проверку
              </button>
            )}
            {order.status === "review" && can("approve_order") && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange(order.id, "approved")}
                  className="rounded bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
                >
                  Принять
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(order.id, "revision")}
                  className="rounded bg-rose-100 px-2 py-1 text-[11px] font-medium text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25"
                >
                  Правки
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export function KanbanPage() {
  const [boardOrders, setBoardOrders] = React.useState<Order[]>(orders)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <>
      <PageHeader
        title="Канбан"
        description="Production-доска: новый → назначен → в работе → на проверке → выполнен."
        action={
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/orders">
              <PackageSearch className="size-4" />
              Список заказов
            </Link>
          </Button>
        }
      />
      <MetricGrid>
        <MetricCard label="Новые" value={`${boardOrders.filter((order) => order.status === "new").length}`} delta="ждут назначения" tone="neutral" />
        <MetricCard label="Назначены" value={`${boardOrders.filter((order) => order.status === "assigned").length}`} delta="дизайнер не принял" tone="neutral" />
        <MetricCard label="В работе" value={`${boardOrders.filter((order) => order.status === "in_progress").length}`} delta="активное производство" />
        <MetricCard label="На проверке" value={`${boardOrders.filter((order) => order.status === "review").length}`} delta="ревью тимлида" tone={boardOrders.filter((o) => o.status === "review").length > 0 ? "down" : "neutral"} />
      </MetricGrid>
      <OrdersKanban
        rows={boardOrders}
        onSelect={(order) => {
          setSelectedOrder(order)
          setDrawerOpen(true)
        }}
        onChange={(nextOrders) => {
          setBoardOrders(nextOrders)
          setSelectedOrder((currentOrder) => {
            if (!currentOrder) return currentOrder
            return nextOrders.find((order) => order.id === currentOrder.id) ?? currentOrder
          })
        }}
        onStatusChange={(orderId, newStatus) => {
          setBoardOrders((current) =>
            current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
          )
        }}
      />
      <OrderDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode="details"
        order={selectedOrder}
      />
    </>
  )
}

export function OrdersPage() {
  const [page, setPage] = React.useState(1)
  const [drawerMode, setDrawerMode] = React.useState<
    "details" | "create" | "brief" | "payment"
  >("details")
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const pageSize = 5
  const pageCount = Math.ceil(orders.length / pageSize)
  const paginatedOrders = orders.slice((page - 1) * pageSize, page * pageSize)

  const openDrawer = (
    mode: "details" | "create" | "brief" | "payment",
    order?: Order,
  ) => {
    setDrawerMode(mode)
    setSelectedOrder(order ?? null)
    setDrawerOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Заказы"
        description="Все пакеты креативов: статус, дедлайн, команда, клиент, прогресс и деньги."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="gap-2" onClick={() => openDrawer("create")}>
              <Plus className="size-4" />
              Создать заказ
            </Button>
          </div>
        }
      />
      <MetricGrid>
        <MetricCard label="Всего заказов" value={`${orders.length}`} delta="все статусы" tone="neutral" />
        <MetricCard label="В производстве" value={`${orders.filter((order) => order.status === "in_progress").length}`} delta="контроль загрузки" />
        <MetricCard label="На ревью/правках" value={`${orders.filter((order) => ["review", "revision"].includes(order.status)).length}`} delta="нужны решения" tone="down" />
        <MetricCard label="К оплате" value={formatCurrency(orders.filter((order) => order.status !== "paid").reduce((sum, order) => sum + order.price, 0))} delta="pipeline" />
      </MetricGrid>
      <Toolbar search="Поиск заказов...">
        <Select defaultValue="all">
          <SelectTrigger className="py-1.5 sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="in_design">В дизайне</SelectItem>
            <SelectItem value="review">Ревью</SelectItem>
            <SelectItem value="revision">Правки</SelectItem>
            <SelectItem value="paid">Оплачено</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>
      <OrderTable rows={paginatedOrders} onSelect={(order) => openDrawer("details", order)} />
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-4 text-sm sm:flex-row sm:px-6 dark:border-gray-800">
        <span className="text-gray-500">
          Показаны {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, orders.length)} из {orders.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="gap-2 py-1.5"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="size-4" />
            Назад
          </Button>
          <span className="rounded-md border border-gray-200 px-3 py-2 text-gray-700 dark:border-gray-800 dark:text-gray-300">
            {page} / {pageCount}
          </span>
          <Button
            variant="secondary"
            className="gap-2 py-1.5"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Вперед
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <OrderDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        order={selectedOrder}
      />
    </>
  )
}

function InvoiceTable({
  rows,
  isPaid,
  onConfirm,
  selectedIds = [],
  onToggle,
  selectable = false,
}: {
  rows: PaymentInvoice[]
  isPaid: (invoice: PaymentInvoice) => boolean
  onConfirm: (invoice: PaymentInvoice) => void
  selectedIds?: string[]
  onToggle?: (invoiceId: string) => void
  selectable?: boolean
}) {
  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            {selectable && <TableHeaderCell className="w-10" />}
            <TableHeaderCell>Счет</TableHeaderCell>
            <TableHeaderCell>Заказ</TableHeaderCell>
            <TableHeaderCell>Клиент</TableHeaderCell>
            <TableHeaderCell>Менеджер</TableHeaderCell>
            <TableHeaderCell>Сумма</TableHeaderCell>
            <TableHeaderCell>Срок</TableHeaderCell>
            <TableHeaderCell>Статус</TableHeaderCell>
            <TableHeaderCell>Действие</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((invoice) => {
            const client = getClient(invoice.clientId)
            const manager = getTeamMember(invoice.managerId)
            const paid = isPaid(invoice)

            return (
              <TableRow key={invoice.id}>
                {selectable && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(invoice.id)}
                      disabled={paid}
                      onChange={() => onToggle?.(invoice.id)}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950"
                      aria-label={`Выбрать ${invoice.id}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium text-gray-950 dark:text-gray-50">
                  {invoice.id}
                  <div className="mt-1 text-xs font-normal text-gray-500">{invoice.note}</div>
                </TableCell>
                <TableCell>{invoice.orderId}</TableCell>
                <TableCell>{client?.name ?? "—"}</TableCell>
                <TableCell><Avatar member={manager} /></TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={paid ? "success" : "warning"}>
                    {paid ? "Оплачен" : "Ждет оплаты"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant={paid ? "secondary" : "primary"}
                    className="gap-2 py-1.5"
                    disabled={paid}
                    onClick={() => onConfirm(invoice)}
                  >
                    <Check className="size-4" />
                    Подтвердить
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

function DepositTable({
  rows,
}: {
  rows: {
    id: string
    order: Order
    client?: Client
    amount: number
    balanceBefore: number
    balanceAfter: number
  }[]
}) {
  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Операция</TableHeaderCell>
            <TableHeaderCell>Заказ</TableHeaderCell>
            <TableHeaderCell>Клиент</TableHeaderCell>
            <TableHeaderCell>Баланс до</TableHeaderCell>
            <TableHeaderCell>Списание</TableHeaderCell>
            <TableHeaderCell>Остаток</TableHeaderCell>
            <TableHeaderCell>Статус</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-gray-950 dark:text-gray-50">{row.id}</TableCell>
              <TableCell>{row.order.id}</TableCell>
              <TableCell>{row.client?.name ?? "—"}</TableCell>
              <TableCell>{formatCurrency(row.balanceBefore)}</TableCell>
              <TableCell>{formatCurrency(row.amount)}</TableCell>
              <TableCell>{formatCurrency(row.balanceAfter)}</TableCell>
              <TableCell>
                <Badge variant={row.balanceAfter >= 0 ? "success" : "error"}>
                  {row.balanceAfter >= 0 ? "Списано" : "Недостаточно"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getPreviousWeekRange(currentDate = new Date("2026-06-01T12:00:00+03:00")) {
  const day = currentDate.getDay() || 7
  const currentMonday = new Date(currentDate)
  currentMonday.setDate(currentDate.getDate() - day + 1)

  const previousMonday = new Date(currentMonday)
  previousMonday.setDate(currentMonday.getDate() - 7)

  const previousSunday = new Date(previousMonday)
  previousSunday.setDate(previousMonday.getDate() + 6)

  return {
    from: toDateInputValue(previousMonday),
    to: toDateInputValue(previousSunday),
  }
}

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-")
  return `${day}.${month}.${year}`
}

function summarizePayoutOrders(rows: Order[]) {
  return rows.reduce(
    (summary, order) => ({
      orders: summary.orders + 1,
      creatives: summary.creatives + order.completedCreatives,
      adapts: summary.adapts + order.adaptCount,
      resizes: summary.resizes + order.resizeCount,
      amount: summary.amount + order.payout,
    }),
    { orders: 0, creatives: 0, adapts: 0, resizes: 0, amount: 0 },
  )
}

function PayoutOrdersTable({
  rows,
  selectedIds,
  visibleUnpaidSelected,
  onToggle,
  onToggleAll,
}: {
  rows: Order[]
  selectedIds: string[]
  visibleUnpaidSelected: boolean
  onToggle: (orderId: string) => void
  onToggleAll: () => void
}) {
  return (
    <TableRoot className="border-t border-gray-200 dark:border-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="w-10">
              <input
                type="checkbox"
                checked={visibleUnpaidSelected}
                onChange={onToggleAll}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950"
                aria-label="Выбрать все видимые заказы"
              />
            </TableHeaderCell>
            <TableHeaderCell>Заказ</TableHeaderCell>
            <TableHeaderCell>Клиент</TableHeaderCell>
            <TableHeaderCell>Дизайнер</TableHeaderCell>
            <TableHeaderCell>Уровень</TableHeaderCell>
            <TableHeaderCell>USDT</TableHeaderCell>
            <TableHeaderCell>Принят</TableHeaderCell>
            <TableHeaderCell>Крео</TableHeaderCell>
            <TableHeaderCell>Адапты</TableHeaderCell>
            <TableHeaderCell>Ресайзы</TableHeaderCell>
            <TableHeaderCell>Сумма</TableHeaderCell>
            <TableHeaderCell>Статус выплаты</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((order) => {
            const client = getClient(order.clientId)
            const designer = getTeamMember(order.designerId)
            const paid = order.payoutStatus === "paid"

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    disabled={paid}
                    onChange={() => onToggle(order.id)}
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-950"
                    aria-label={`Выбрать ${order.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-950 dark:text-gray-50">{order.id}</div>
                  <div className="mt-1 max-w-56 truncate text-xs text-gray-500">{order.title}</div>
                </TableCell>
                <TableCell>{client?.name ?? "—"}</TableCell>
                <TableCell><Avatar member={designer} /></TableCell>
                <TableCell>
                  {designer?.level ? (
                    <Badge variant="neutral">{designerLevelLabels[designer.level as DesignerLevel]}</Badge>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {designer?.usdtWallet ? (
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {designer.usdtWallet.slice(0, 8)}…
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDateLabel(order.acceptedAt)}</TableCell>
                <TableCell>{order.completedCreatives}</TableCell>
                <TableCell>{order.adaptCount}</TableCell>
                <TableCell>{order.resizeCount}</TableCell>
                <TableCell className="font-semibold text-gray-950 dark:text-gray-50">
                  {formatCurrency(order.payout)}
                </TableCell>
                <TableCell>
                  <Badge variant={paid ? "success" : "warning"}>
                    {paid ? "Выплачено" : "Не выплачено"}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="py-10 text-center text-gray-500">
                Нет заказов по выбранным фильтрам
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableRoot>
  )
}

export function InvoicesPage() {
  const [activeTab, setActiveTab] = React.useState<"prepaid" | "postpaid" | "deposit">("prepaid")
  const [confirmedInvoiceIds, setConfirmedInvoiceIds] = React.useState<string[]>([])
  const [selectedPostpaidIds, setSelectedPostpaidIds] = React.useState<string[]>([])
  const [postpaidClientFilter, setPostpaidClientFilter] = React.useState("all")
  const [postpaidDateFrom, setPostpaidDateFrom] = React.useState("")
  const [postpaidDateTo, setPostpaidDateTo] = React.useState("")
  const [selectedInvoice, setSelectedInvoice] = React.useState<PaymentInvoice | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const isInvoicePaid = (invoice: PaymentInvoice) =>
    invoice.status === "paid" || confirmedInvoiceIds.includes(invoice.id)
  const prepaidRows = paymentInvoices.filter((invoice) => invoice.kind === "prepaid")
  const postpaidRows = paymentInvoices.filter((invoice) => invoice.kind === "postpaid")
  const filteredPostpaidRows = postpaidRows.filter((invoice) => {
    const clientMatches =
      postpaidClientFilter === "all" || invoice.clientId === postpaidClientFilter
    const fromMatches = !postpaidDateFrom || invoice.createdAt >= postpaidDateFrom
    const toMatches = !postpaidDateTo || invoice.createdAt <= postpaidDateTo

    return clientMatches && fromMatches && toMatches
  })
  const pendingPrepaid = prepaidRows
    .filter((invoice) => !isInvoicePaid(invoice))
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const postpaidDebt = postpaidRows
    .filter((invoice) => !isInvoicePaid(invoice))
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const depositOperations = orders.slice(0, 4).map((order, index) => {
    const client = getClient(order.clientId)
    const amount = index % 2 === 0 ? order.price * 0.6 : order.price * 0.35

    return {
      id: `DEP-${2040 - index}`,
      order,
      client,
      amount,
      balanceBefore: client?.balance ?? 0,
      balanceAfter: (client?.balance ?? 0) - amount,
    }
  })
  const depositWriteOffs = depositOperations.reduce((sum, item) => sum + item.amount, 0)

  const openConfirm = (invoice: PaymentInvoice) => {
    setSelectedInvoice(invoice)
    setConfirmOpen(true)
  }

  const confirmInvoice = () => {
    if (!selectedInvoice) return
    setConfirmedInvoiceIds((current) =>
      current.includes(selectedInvoice.id) ? current : [...current, selectedInvoice.id],
    )
    setConfirmOpen(false)
  }
  const togglePostpaidInvoice = (invoiceId: string) => {
    setSelectedPostpaidIds((current) =>
      current.includes(invoiceId)
        ? current.filter((id) => id !== invoiceId)
        : [...current, invoiceId],
    )
  }
  const visibleUnpaidPostpaidIds = filteredPostpaidRows
    .filter((invoice) => !isInvoicePaid(invoice))
    .map((invoice) => invoice.id)
  const allVisiblePostpaidSelected =
    visibleUnpaidPostpaidIds.length > 0 &&
    visibleUnpaidPostpaidIds.every((id) => selectedPostpaidIds.includes(id))
  const toggleAllVisiblePostpaid = () => {
    setSelectedPostpaidIds((current) =>
      allVisiblePostpaidSelected
        ? current.filter((id) => !visibleUnpaidPostpaidIds.includes(id))
        : Array.from(new Set([...current, ...visibleUnpaidPostpaidIds])),
    )
  }
  const markSelectedPostpaidPaid = () => {
    setConfirmedInvoiceIds((current) =>
      Array.from(new Set([...current, ...selectedPostpaidIds])),
    )
    setSelectedPostpaidIds([])
  }

  return (
    <>
      <PageHeader
        title="Счета на оплату"
        description="Менеджер подтверждает предоплаты, закрывает постоплату и контролирует списания с депозитов клиентов."
      />
      <MetricGrid>
        <MetricCard label="Ждут подтверждения" value={formatCurrency(pendingPrepaid)} delta={`${prepaidRows.filter((invoice) => !isInvoicePaid(invoice)).length} счета`} />
        <MetricCard label="Постоплата" value={formatCurrency(postpaidDebt)} delta="крео в долг" tone="down" />
        <MetricCard label="Списано с депозитов" value={formatCurrency(depositWriteOffs)} delta="по текущим ТЗ" />
        <MetricCard label="Подтверждено" value={`${confirmedInvoiceIds.length}`} delta="за сессию" tone="neutral" />
      </MetricGrid>
      <div className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-800">
        <div className="inline-flex rounded-md border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-950">
          {[
            { value: "prepaid", label: "Оплата сразу" },
            { value: "postpaid", label: "Постоплата" },
            { value: "deposit", label: "Депозит" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
              className={cx(
                "rounded px-3 py-1.5 text-sm font-medium transition",
                activeTab === tab.value
                  ? "bg-white text-gray-950 shadow-sm dark:bg-gray-900 dark:text-gray-50"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "deposit" ? (
        <DepositTable rows={depositOperations} />
      ) : activeTab === "postpaid" ? (
        <>
          <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-end sm:p-6 dark:border-gray-800">
            <LabeledField label="Клиент">
              <Select value={postpaidClientFilter} onValueChange={setPostpaidClientFilter}>
                <SelectTrigger className="sm:w-64">
                  <SelectValue placeholder="Все клиенты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все клиенты</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabeledField>
            <LabeledField label="С даты">
              <Input
                type="date"
                value={postpaidDateFrom}
                onChange={(event) => setPostpaidDateFrom(event.target.value)}
              />
            </LabeledField>
            <LabeledField label="По дату">
              <Input
                type="date"
                value={postpaidDateTo}
                onChange={(event) => setPostpaidDateTo(event.target.value)}
              />
            </LabeledField>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Button
                type="button"
                variant="secondary"
                className="py-1.5"
                onClick={toggleAllVisiblePostpaid}
                disabled={visibleUnpaidPostpaidIds.length === 0}
              >
                {allVisiblePostpaidSelected ? "Снять выбор" : "Выбрать все"}
              </Button>
              <Button
                type="button"
                className="gap-2 py-1.5"
                disabled={selectedPostpaidIds.length === 0}
                onClick={markSelectedPostpaidPaid}
              >
                <Check className="size-4" />
                Пометить оплачено
              </Button>
            </div>
          </div>
          <InvoiceTable
            rows={filteredPostpaidRows}
            isPaid={isInvoicePaid}
            onConfirm={openConfirm}
            selectedIds={selectedPostpaidIds}
            onToggle={togglePostpaidInvoice}
            selectable
          />
        </>
      ) : (
        <InvoiceTable
          rows={prepaidRows}
          isPaid={isInvoicePaid}
          onConfirm={openConfirm}
        />
      )}
      <Drawer open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Подтверждение оплаты</DrawerTitle>
            <DrawerDescription>
              Проверьте входящую оплату вручную и подтвердите счет.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {selectedInvoice && (
              <div className="space-y-3 text-sm">
                <MetricMini label="Счет" value={selectedInvoice.id} />
                <MetricMini label="Заказ" value={selectedInvoice.orderId} />
                <MetricMini label="Клиент" value={getClient(selectedInvoice.clientId)?.name ?? "—"} />
                <MetricMini label="Сумма" value={formatCurrency(selectedInvoice.amount)} />
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400">
                  Платежный шлюз не используется: менеджер сверяет поступление во внешнем аккаунтинге или банке и вручную закрывает счет.
                </div>
              </div>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Закрыть
            </Button>
            <Button className="gap-2" onClick={confirmInvoice}>
              <Check className="size-4" />
              Подтвердить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export function FinancePage() {
  const designers = team.filter((member) => member.role === "designer")
  const previousWeek = getPreviousWeekRange()
  const [designerFilter, setDesignerFilter] = React.useState("all")
  const [periodPreset, setPeriodPreset] = React.useState("previous-week")
  const [dateFrom, setDateFrom] = React.useState(previousWeek.from)
  const [dateTo, setDateTo] = React.useState(previousWeek.to)
  const [payoutStatusFilter, setPayoutStatusFilter] = React.useState<"unpaid" | "paid" | "all">("unpaid")
  const [generatedFilters, setGeneratedFilters] = React.useState({
    designerId: "all",
    from: previousWeek.from,
    to: previousWeek.to,
    status: "unpaid" as "unpaid" | "paid" | "all",
  })
  const [payoutOrders, setPayoutOrders] = React.useState<Order[]>(orders)
  const [selectedOrderIds, setSelectedOrderIds] = React.useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const eligibleOrders = payoutOrders.filter((order) =>
    ["approved", "paid"].includes(order.status),
  )
  const filteredOrders = eligibleOrders.filter((order) => {
    const designerMatches =
      generatedFilters.designerId === "all" ||
      order.designerId === generatedFilters.designerId
    const fromMatches = order.acceptedAt >= generatedFilters.from
    const toMatches = order.acceptedAt <= generatedFilters.to
    const statusMatches =
      generatedFilters.status === "all" ||
      order.payoutStatus === generatedFilters.status

    return designerMatches && fromMatches && toMatches && statusMatches
  })
  const selectableOrderIds = filteredOrders
    .filter((order) => order.payoutStatus === "unpaid")
    .map((order) => order.id)
  const selectedOrders = filteredOrders.filter((order) =>
    selectedOrderIds.includes(order.id),
  )
  const visibleUnpaidSelected =
    selectableOrderIds.length > 0 &&
    selectableOrderIds.every((id) => selectedOrderIds.includes(id))
  const periodLabel = `${formatDateLabel(generatedFilters.from)} - ${formatDateLabel(generatedFilters.to)}`
  const periodTotal = filteredOrders
    .filter((order) => order.payoutStatus === "unpaid")
    .reduce((sum, order) => sum + order.payout, 0)
  const selectedSummary = summarizePayoutOrders(selectedOrders)
  const paidThisMonth = payoutOrders
    .filter((order) => order.payoutStatus === "paid" && order.payoutPaidAt?.startsWith("2026-05"))
    .reduce((sum, order) => sum + order.payout, 0)
  const unpaidRemainder = eligibleOrders
    .filter((order) => order.payoutStatus === "unpaid")
    .reduce((sum, order) => sum + order.payout, 0)

  const syncPeriodPreset = (preset: string) => {
    setPeriodPreset(preset)
    if (preset === "previous-week") {
      setDateFrom(previousWeek.from)
      setDateTo(previousWeek.to)
    }
  }
  const generateReport = () => {
    setGeneratedFilters({
      designerId: designerFilter,
      from: dateFrom,
      to: dateTo,
      status: payoutStatusFilter,
    })
    setSelectedOrderIds([])
  }
  const toggleOrder = (orderId: string) => {
    setSelectedOrderIds((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId],
    )
  }
  const toggleAllVisible = () => {
    setSelectedOrderIds((current) =>
      visibleUnpaidSelected
        ? current.filter((id) => !selectableOrderIds.includes(id))
        : Array.from(new Set([...current, ...selectableOrderIds])),
    )
  }
  const confirmPayout = () => {
    if (selectedOrders.length === 0) return
    const batchId = `PB-${generatedFilters.from}-${Date.now()}`

    setPayoutOrders((currentOrders) =>
      currentOrders.map((order) =>
        selectedOrderIds.includes(order.id)
          ? {
              ...order,
              payoutStatus: "paid",
              payoutPaidAt: new Date().toISOString().slice(0, 10),
              payoutBatchId: batchId,
            }
          : order,
      ),
    )
    setSelectedOrderIds([])
    setConfirmOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Финансы"
        description="Выплаты штатным дизайнерам по принятым клиентом заказам."
      />
      <MetricGrid>
        <MetricCard label="К выплате за период" value={formatCurrency(periodTotal)} delta={periodLabel} />
        <MetricCard label="Заказов в выборке" value={`${filteredOrders.length}`} delta={`${selectableOrderIds.length} не выплачено`} tone="neutral" />
        <MetricCard label="Уже выплачено за май" value={formatCurrency(paidThisMonth)} delta="по закрытым заказам" />
        <MetricCard label="Невыплаченный остаток" value={formatCurrency(unpaidRemainder)} delta="все принятые заказы" tone="down" />
      </MetricGrid>
      <section className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
          <LabeledField label="Дизайнер">
            <Select value={designerFilter} onValueChange={setDesignerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все дизайнеры" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все дизайнеры</SelectItem>
                {designers.map((designer) => (
                  <SelectItem key={designer.id} value={designer.id}>
                    {designer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabeledField>
          <LabeledField label="Период">
            <Select value={periodPreset} onValueChange={syncPeriodPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous-week">Прошлая неделя</SelectItem>
                <SelectItem value="custom">Свой период</SelectItem>
              </SelectContent>
            </Select>
          </LabeledField>
          <LabeledField label="С даты">
            <Input
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setPeriodPreset("custom")
                setDateFrom(event.target.value)
              }}
            />
          </LabeledField>
          <LabeledField label="По дату">
            <Input
              type="date"
              value={dateTo}
              onChange={(event) => {
                setPeriodPreset("custom")
                setDateTo(event.target.value)
              }}
            />
          </LabeledField>
          <Button className="gap-2" onClick={generateReport}>
            Сформировать
          </Button>
          <div className="lg:col-span-2">
            <LabeledField label="Статус выплаты">
              <Select
                value={payoutStatusFilter}
                onValueChange={(value) => setPayoutStatusFilter(value as "unpaid" | "paid" | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Статус выплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Не выплачено</SelectItem>
                  <SelectItem value="paid">Выплачено</SelectItem>
                  <SelectItem value="all">Все</SelectItem>
                </SelectContent>
              </Select>
            </LabeledField>
          </div>
        </div>
      </section>
      <PayoutOrdersTable
        rows={filteredOrders}
        selectedIds={selectedOrderIds}
        visibleUnpaidSelected={visibleUnpaidSelected}
        onToggle={toggleOrder}
        onToggleAll={toggleAllVisible}
      />
      <section className="grid grid-cols-1 gap-3 border-t border-gray-200 p-4 sm:grid-cols-5 sm:p-6 dark:border-gray-800">
        <MetricMini label="Выбрано заказов" value={`${selectedOrders.length}`} />
        <MetricMini label="Креативы" value={`${selectedSummary.creatives}`} />
        <MetricMini label="Адапты" value={`${selectedSummary.adapts}`} />
        <MetricMini label="Ресайзы" value={`${selectedSummary.resizes}`} />
        <div className="flex flex-col gap-2">
          <MetricMini label="Итого" value={formatCurrency(selectedSummary.amount)} />
          <Button
            className="gap-2"
            disabled={selectedOrders.length === 0}
            onClick={() => setConfirmOpen(true)}
          >
            <Check className="size-4" />
            Отметить выплату
          </Button>
        </div>
      </section>
      <Drawer
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) setConfirmOpen(false)
        }}
      >
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Подтверждение выплаты</DrawerTitle>
            <DrawerDescription>
              Проверьте выборку перед тем, как отметить заказы выплаченными.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-3 text-sm">
              <MetricMini
                label="Дизайнер"
                value={
                  generatedFilters.designerId === "all"
                    ? "Все дизайнеры"
                    : getTeamMember(generatedFilters.designerId)?.name ?? "—"
                }
              />
              <MetricMini label="Период" value={periodLabel} />
              <MetricMini label="Заказов" value={`${selectedOrders.length}`} />
              <MetricMini label="Сумма" value={formatCurrency(selectedSummary.amount)} />
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                После подтверждения выбранные заказы получат статус выплаты `Выплачено`.
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Отмена
            </Button>
            <Button className="gap-2" onClick={confirmPayout}>
              <Check className="size-4" />
              Да, отметить выплаченными
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export function AnalyticsPage() {
  const latestMonth = monthlyRevenue.at(-1)
  const previousMonth = monthlyRevenue.at(-2)
  const revenue = latestMonth?.Revenue ?? 0
  const expenses = latestMonth?.Expenses ?? 0
  const profit = latestMonth?.Profit ?? revenue - expenses
  const revenueGrowth = previousMonth?.Revenue
    ? Math.round(((revenue - previousMonth.Revenue) / previousMonth.Revenue) * 100)
    : 0
  const payoutCost = orders.reduce((sum, order) => sum + order.payout, 0)
  const orderRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.price, 0)
  const grossMargin = orderRevenue ? Math.round(((orderRevenue - payoutCost) / orderRevenue) * 100) : 0
  const pendingPayouts = payouts
    .filter((payout) => payout.status !== "paid")
    .reduce((sum, payout) => sum + payout.amount, 0)
  const totalDebt = clients.reduce((sum, client) => sum + client.debt, 0)
  const completedCreatives = orders.reduce((sum, order) => sum + order.completedCreatives, 0)
  const avgPayoutPerCreative = completedCreatives
    ? Math.round(payoutCost / completedCreatives)
    : 0
  const verticalEconomics = Array.from(new Set(orders.map((order) => order.vertical))).map((vertical) => {
    const rows = orders.filter((order) => order.vertical === vertical && order.status !== "cancelled")
    const verticalRevenue = rows.reduce((sum, order) => sum + order.price, 0)
    const verticalPayout = rows.reduce((sum, order) => sum + order.payout, 0)
    return {
      vertical,
      Revenue: verticalRevenue,
      Payouts: verticalPayout,
      Profit: verticalRevenue - verticalPayout,
    }
  })
  const clientEconomics = clients.map((client) => {
    const rows = orders.filter((order) => order.clientId === client.id && order.status !== "cancelled")
    const clientRevenue = rows.reduce((sum, order) => sum + order.price, 0)
    const clientPayout = rows.reduce((sum, order) => sum + order.payout, 0)
    return {
      ...client,
      revenue: clientRevenue,
      payout: clientPayout,
      margin: clientRevenue ? Math.round(((clientRevenue - clientPayout) / clientRevenue) * 100) : 0,
    }
  })
  const payoutStatus = ["pending", "scheduled", "paid"].map((status) => {
    const rows = payouts.filter((payout) => payout.status === status)
    return {
      status,
      count: rows.length,
      amount: rows.reduce((sum, payout) => sum + payout.amount, 0),
    }
  })

  return (
    <>
      <PageHeader
        title="Аналитика"
        description="Экономика проекта: выручка, себестоимость, маржа, выплаты, долги и прибыльность клиентов."
        action={<Button variant="secondary" className="gap-2"><CalendarClock className="size-4" />Май 2026</Button>}
      />
      <MetricGrid>
        <MetricCard label="Выручка месяца" value={formatCurrency(revenue)} delta={`${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% к прошлому`} />
        <MetricCard label="Прибыль" value={formatCurrency(profit)} delta={`${Math.round((profit / revenue) * 100)}% net margin`} />
        <MetricCard label="Себестоимость" value={formatCurrency(payoutCost)} delta="выплаты по заказам" tone="neutral" />
        <MetricCard label="Gross margin" value={`${grossMargin}%`} delta="после выплат дизайнерам" />
        <MetricCard label="Pending payouts" value={formatCurrency(pendingPayouts)} delta="ожидает выплаты" tone="neutral" />
        <MetricCard label="Долги клиентов" value={formatCurrency(totalDebt)} delta={`${clients.filter((client) => client.debt > 0).length} клиента`} tone={totalDebt > 0 ? "down" : "neutral"} />
        <MetricCard label="Средняя выплата/крео" value={formatCurrency(avgPayoutPerCreative)} delta="по закрытым крео" />
        <MetricCard label="Order revenue" value={formatCurrency(orderRevenue)} delta="без отмененных" tone="neutral" />
      </MetricGrid>
      <div className="grid grid-cols-1 border-b border-gray-200 lg:grid-cols-2 dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r dark:border-gray-800">
          <SectionTitle title="P&L по месяцам" description="Динамика выручки, расходов и прибыли." />
          <LazyComboChart
            data={monthlyRevenue}
            index="month"
            enableBiaxial
            barSeries={{
              categories: ["Revenue", "Expenses"],
              colors: ["blue", "amber"],
              valueFormatter: (value) => formatCurrency(value),
            }}
            lineSeries={{
              categories: ["Profit"],
              colors: ["emerald"],
              valueFormatter: (value) => formatCurrency(value),
            }}
            className="mt-6 h-72"
          />
        </div>
        <div className="p-4 sm:p-6">
          <SectionTitle title="Экономика по вертикалям" description="Выручка, выплаты и валовая прибыль." />
          <LazyBarChart
            data={verticalEconomics}
            index="vertical"
            categories={["Revenue", "Payouts", "Profit"]}
            colors={["blue", "amber", "emerald"]}
            valueFormatter={(value) => formatCurrency(value)}
            className="mt-6 h-72"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 border-b border-gray-200 lg:grid-cols-[1.25fr_0.75fr] dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r dark:border-gray-800">
          <SectionTitle title="Прибыльность клиентов" description="Сколько клиент приносит после выплат дизайнерам." />
          <TableRoot className="mt-5 border border-gray-200 dark:border-gray-800">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Клиент</TableHeaderCell>
                  <TableHeaderCell>Вертикаль</TableHeaderCell>
                  <TableHeaderCell>Выручка</TableHeaderCell>
                  <TableHeaderCell>Выплаты</TableHeaderCell>
                  <TableHeaderCell>Маржа</TableHeaderCell>
                  <TableHeaderCell>Долг</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientEconomics.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-gray-950 dark:text-gray-50">{client.name}</TableCell>
                    <TableCell>{client.vertical}</TableCell>
                    <TableCell>{formatCurrency(client.revenue)}</TableCell>
                    <TableCell>{formatCurrency(client.payout)}</TableCell>
                    <TableCell>{client.margin}%</TableCell>
                    <TableCell>{client.debt ? formatCurrency(client.debt) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRoot>
        </div>
        <div className="p-4 sm:p-6">
          <SectionTitle title="Статус выплат" description="Контроль суммы и количества выплат." />
          <ul className="mt-5 space-y-3">
            {payoutStatus.map((item) => (
              <li key={item.status} className="rounded-md border border-gray-200 p-3 text-sm dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-gray-950 dark:text-gray-50">
                    {item.status === "pending" ? "Ожидают" : item.status === "scheduled" ? "Запланированы" : "Оплачены"}
                  </span>
                  <span className="tabular-nums text-gray-500">{item.count}</span>
                </div>
                <div className="mt-2 text-lg font-semibold tabular-nums text-gray-950 dark:text-gray-50">
                  {formatCurrency(item.amount)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
export function QuickSearchButton() {
  return (
    <Button variant="secondary" className="hidden gap-2 py-1.5 md:inline-flex">
      <Search className="size-4 text-gray-400" />
      Быстрый поиск
    </Button>
  )
}

export function NavigationCard({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-gray-200 p-4 text-sm transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/60"
    >
      <span className="font-medium text-gray-950 dark:text-gray-50">{title}</span>
      <span className="mt-1 block text-gray-500">{detail}</span>
    </Link>
  )
}
