import { SidebarProvider, SidebarTrigger } from "@/components/Sidebar"
import { AppSidebar } from "@/components/ui/navigation/AppSidebar"
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs"
import { RoleSwitcher } from "@/components/ui/navigation/RoleSwitcher"
import { ThemeToggle } from "@/components/ui/navigation/ThemeToggle"
import { RoleProvider } from "@/lib/roleContext"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import localFont from "next/font/local"
import { cookies } from "next/headers"
import "./globals.css"
import { siteConfig } from "./siteConfig"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["CRM", "Dashboard", "Creative production", "Traffic arbitrage"],
  authors: [
    {
      name: "Creometrics",
      url: "",
    },
  ],
  creator: "Creometrics",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@creativeops",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar:state")?.value
  const defaultOpen = sidebarState ? sidebarState === "true" : true

  return (
    <html lang="ru" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-white antialiased dark:bg-gray-925`}
      >
        <ThemeProvider
          defaultTheme="light"
          disableTransitionOnChange
          attribute="class"
        >
          <RoleProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <div className="min-w-0 w-full overflow-x-hidden bg-white dark:bg-gray-925">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-925">
                  <SidebarTrigger className="-ml-1" />
                  <div className="mr-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <Breadcrumbs />
                  <div className="ml-auto flex items-center gap-3">
                    <RoleSwitcher />
                    <ThemeToggle />
                  </div>
                </header>
                <main className="min-w-0 overflow-x-hidden bg-white dark:bg-gray-925">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
