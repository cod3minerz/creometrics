"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { DesignerLevel, designerLevelLabels } from "@/data/crm"
import { PriceListEntry, WorkType, defaultPriceList } from "@/data/pricelist"
import { useRole } from "@/lib/roleContext"
import { Check, Save } from "lucide-react"
import * as React from "react"
import { PageHeader } from "./CrmBlocks"

const designerLevels: DesignerLevel[] = [
  "intern_1",
  "intern_2",
  "diz",
  "middle_diz",
  "senior_diz",
]

export function PriceListPage() {
  const { can } = useRole()
  const [entries, setEntries] = React.useState<PriceListEntry[]>(defaultPriceList)
  const [saved, setSaved] = React.useState(false)
  const canEdit = can("edit_pricelist")

  const updatePrice = (workType: WorkType, level: DesignerLevel, raw: string) => {
    const value = raw.trim() === "" || raw === "—" ? null : Number(raw.replace(",", "."))
    setEntries((current) =>
      current.map((entry) =>
        entry.workType === workType
          ? { ...entry, prices: { ...entry.prices, [level]: Number.isFinite(value) ? value : null } }
          : entry,
      ),
    )
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const videoEntries = entries.filter((e) => e.category === "video")
  const staticEntries = entries.filter((e) => e.category === "static")

  return (
    <>
      <PageHeader
        title="Прайс-лист"
        description="Ставки выплат дизайнерам по уровням и типам работ. Используется для автоматического расчёта выплат."
        action={
          canEdit ? (
            <Button className="gap-2" onClick={handleSave}>
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              {saved ? "Сохранено" : "Сохранить"}
            </Button>
          ) : undefined
        }
      />
      {!canEdit && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          Просмотр прайс-листа. Редактирование доступно только администратору.
        </div>
      )}
      <section className="border-b border-gray-200 p-4 sm:p-6 dark:border-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-950 dark:text-gray-50">Видео</h2>
          <Badge variant="default">7 типов работ</Badge>
        </div>
        <PriceTable entries={videoEntries} canEdit={canEdit} onUpdate={updatePrice} />
      </section>
      <section className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-950 dark:text-gray-50">Статика</h2>
          <Badge variant="neutral">4 типа работ</Badge>
        </div>
        <PriceTable entries={staticEntries} canEdit={canEdit} onUpdate={updatePrice} />
      </section>
    </>
  )
}

function PriceTable({
  entries,
  canEdit,
  onUpdate,
}: {
  entries: PriceListEntry[]
  canEdit: boolean
  onUpdate: (workType: WorkType, level: DesignerLevel, value: string) => void
}) {
  return (
    <TableRoot>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="w-48">Тип работы</TableHeaderCell>
            {designerLevels.map((level) => (
              <TableHeaderCell key={level} className="text-center">
                {designerLevelLabels[level]}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.workType}>
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {entry.label}
              </TableCell>
              {designerLevels.map((level) => {
                const price = entry.prices[level]
                return (
                  <TableCell key={level} className="text-center">
                    {canEdit ? (
                      <input
                        type="text"
                        defaultValue={price !== null ? String(price) : ""}
                        placeholder="—"
                        onChange={(e) => onUpdate(entry.workType, level, e.target.value)}
                        className={`w-20 rounded border px-2 py-1 text-center text-sm tabular-nums outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                          ${price === null
                            ? "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600"
                            : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
                          }`}
                      />
                    ) : price !== null ? (
                      <span className="tabular-nums text-gray-900 dark:text-gray-50">
                        ${price}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  )
}
