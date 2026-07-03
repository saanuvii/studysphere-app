"use client"

import * as React from "react"
import {
  Brain,
  Calendar,
  CheckSquare,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,

  Target,
  BarChart,

  Moon,
  Sun
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: FileText,
  },
  {
    title: "Subjects",
    url: "/dashboard/subjects",
    icon: FolderOpen,
  },
  {
    title: "AI Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "PDF Library",
    url: "/dashboard/library",
    icon: GraduationCap,
  },
]

const studyItems = [
  {
    title: "Flashcards",
    url: "/dashboard/flashcards",
    icon: Brain,
  },
  {
    title: "Quizzes",
    url: "/dashboard/quizzes",
    icon: Target,
  },
  {
    title: "Planner",
    url: "/dashboard/planner",
    icon: Calendar,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/40 bg-sidebar/95 backdrop-blur">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full justify-start">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Brain className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg">StudySphere</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Study Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex justify-start gap-2 px-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="group-data-[collapsible=icon]:hidden">Toggle Theme</span>
          </Button>
        </div>
        <div className="p-2 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="group-data-[collapsible=icon]:hidden">
            <UserButton />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <UserButton />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
