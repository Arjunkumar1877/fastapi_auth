import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Settings, CheckSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
    className?: string;  
  }

interface NavItemType {
title: string;
icon: JSX.Element;  
href: string;
}
  

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/"
    },
    {
      title: "Profile",
      icon: <User className="h-4 w-4" />,
      href: "/profile"
    },
    {
      title: "Tasks",
      icon: <CheckSquare className="h-4 w-4" />,
      href: "/tasks"
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings"
    }
  ];

  const NavItem: React.FC<{ item: NavItemType }> = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate(item.href)}
      >
        {item.icon}
        <span className="ml-2">{item.title}</span>
      </Button>
    );
  };

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`hidden lg:flex h-screen flex-col fixed left-0 top-0 w-64 border-r bg-background ${className}`}>
        <div className="p-6">
          <h1 className="text-xl font-bold">FastApp</h1>
        </div>
        <Separator />
        <SidebarContent />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;