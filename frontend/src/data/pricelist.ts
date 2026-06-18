import { DesignerLevel } from "./crm"

export type WorkType =
  | "video_1"
  | "video_50plus"
  | "gif"
  | "krujok"
  | "gambla"
  | "adapt_video"
  | "resize_video"
  | "static_1"
  | "avatar_1"
  | "adapt_static"
  | "resize_static"

export type WorkCategory = "video" | "static"

export type PriceListEntry = {
  workType: WorkType
  label: string
  category: WorkCategory
  prices: Record<DesignerLevel, number | null>
}

export const workTypeLabels: Record<WorkType, string> = {
  video_1: "1 видео",
  video_50plus: "Видео 50+ сек",
  gif: "Гиф",
  krujok: "Кружок",
  gambla: "Гембла",
  adapt_video: "Адапт видео",
  resize_video: "Ресайз видео",
  static_1: "1 статика",
  avatar_1: "1 аватарка",
  adapt_static: "Адапт статики",
  resize_static: "Ресайз статики",
}

export const defaultPriceList: PriceListEntry[] = [
  {
    workType: "video_1",
    label: "1 видео",
    category: "video",
    prices: { intern_1: 10, intern_2: 12.5, diz: 15, middle_diz: 17.5, senior_diz: 17.5 },
  },
  {
    workType: "video_50plus",
    label: "Видео 50+ сек",
    category: "video",
    prices: { intern_1: 15, intern_2: 17.5, diz: 22.5, middle_diz: 22.5, senior_diz: 25 },
  },
  {
    workType: "gif",
    label: "Гиф",
    category: "video",
    prices: { intern_1: null, intern_2: null, diz: 7.5, middle_diz: 10, senior_diz: 12.5 },
  },
  {
    workType: "krujok",
    label: "Кружок",
    category: "video",
    prices: { intern_1: null, intern_2: null, diz: 7.5, middle_diz: 10, senior_diz: 12.5 },
  },
  {
    workType: "gambla",
    label: "Гембла",
    category: "video",
    prices: { intern_1: 15, intern_2: 17.5, diz: 20, middle_diz: 20, senior_diz: 22.5 },
  },
  {
    workType: "adapt_video",
    label: "Адапт видео",
    category: "video",
    prices: { intern_1: 2.5, intern_2: 2.5, diz: 2.5, middle_diz: 2.5, senior_diz: 5 },
  },
  {
    workType: "resize_video",
    label: "Ресайз видео",
    category: "video",
    prices: { intern_1: 2.5, intern_2: 2.5, diz: 2.5, middle_diz: 2.5, senior_diz: 5 },
  },
  {
    workType: "static_1",
    label: "1 статика",
    category: "static",
    prices: { intern_1: 3.5, intern_2: 3.5, diz: 3.5, middle_diz: 3.5, senior_diz: 3.5 },
  },
  {
    workType: "avatar_1",
    label: "1 аватарка",
    category: "static",
    prices: { intern_1: null, intern_2: null, diz: 5, middle_diz: 5, senior_diz: 5 },
  },
  {
    workType: "adapt_static",
    label: "Адапт статики",
    category: "static",
    prices: { intern_1: 1, intern_2: 1, diz: 1, middle_diz: 1, senior_diz: 1 },
  },
  {
    workType: "resize_static",
    label: "Ресайз статики",
    category: "static",
    prices: { intern_1: 1, intern_2: 1, diz: 1, middle_diz: 1, senior_diz: 1 },
  },
]
