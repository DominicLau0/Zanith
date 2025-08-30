import { Home, Search, History, Heart, Plus, User, LogOut, Upload, Inbox, Calendar } from "lucide-react"
import { MdPerson } from "react-icons/md";

import { NavLink, Outlet, useNavigate, useLoaderData, useLocation} from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
  SidebarFooter,
  SidebarInset
} from "@/components/ui/sidebar"

import logo_dark from '../icons/dark-logo.png'
import logo_light from '../icons/white-logo.png'

export function AppSidebar({username}) {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Menu items.
    const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Upload",
        url: "/upload",
        icon: Inbox,
    },
    {
        title: "Profile",
        url: "/profile/" + username,
        icon: Calendar,
    },
    ]
    return (
        <Sidebar variant="inset" collapsible = "icon">
        <SidebarInset>
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <img src={logo_dark} className="size-7 object-scale-down block dark:hidden" alt="Logo"/>
                    <img src={logo_light} className="size-7 object-scale-down hidden dark:block"alt="Logo"/>
                    <span className="font-semibold text-base">Zanith</span>
                    <ThemeToggle />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/`)} isActive={location.pathname === "/"}>
                                    <Home/>
                                    <span>Home</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/search`)} isActive={location.pathname.startsWith("/search")}>
                                    <Search/>
                                    <span>Search</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/profile`)} isActive={location.pathname.startsWith("/profile")}>
                                    <MdPerson/>
                                    <span>Profile</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/upload`)} isActive={location.pathname === "/upload"}>
                                    <Upload/>
                                    <span>Upload Track</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/likes`)} isActive={location.pathname === "/likes"}>
                                    <Heart/>
                                    <span>Liked Songs</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate(`/history`)} isActive={location.pathname === ("/history")}>
                                    <History/>
                                    <span>History</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>

            </SidebarFooter>
        </SidebarInset>
        </Sidebar>
    )
}