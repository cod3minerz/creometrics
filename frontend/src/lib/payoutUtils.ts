import { DesignerLevel, Order, TeamMember } from "@/data/crm"
import { PriceListEntry } from "@/data/pricelist"

export function calculateDesignerPayout(
  orders: Order[],
  designer: TeamMember,
  priceList: PriceListEntry[],
): number {
  const level: DesignerLevel = designer.level ?? "intern_1"

  return orders.reduce((total, order) => {
    const isVideo = order.creativeType === "Моушн"

    const baseEntry = priceList.find((e) =>
      isVideo ? e.workType === "video_1" : e.workType === "static_1",
    )
    const adaptEntry = priceList.find((e) =>
      isVideo ? e.workType === "adapt_video" : e.workType === "adapt_static",
    )
    const resizeEntry = priceList.find((e) =>
      isVideo ? e.workType === "resize_video" : e.workType === "resize_static",
    )

    const basePrice = baseEntry?.prices[level] ?? 0
    const adaptPrice = adaptEntry?.prices[level] ?? 0
    const resizePrice = resizeEntry?.prices[level] ?? 0

    const orderPayout =
      order.completedCreatives * (basePrice ?? 0) +
      order.adaptCount * (adaptPrice ?? 0) +
      order.resizeCount * (resizePrice ?? 0)

    return total + orderPayout
  }, 0)
}

export function getWeekRange(weekOffset = 0): { from: string; to: string; label: string } {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = (day === 0 ? -6 : 1 - day) + weekOffset * 7
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const labelFmt = new Intl.DateTimeFormat("ru", { day: "numeric", month: "short" })

  return {
    from: fmt(monday),
    to: fmt(sunday),
    label: `${labelFmt.format(monday)} – ${labelFmt.format(sunday)}`,
  }
}
