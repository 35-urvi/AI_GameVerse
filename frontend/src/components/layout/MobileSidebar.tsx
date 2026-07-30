import {
  BarChart3,
  Gamepad2,
  Home,
  Save,
  Settings,
  Trophy,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Games",
    path: "/games",
    icon: Gamepad2,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "Statistics",
    path: "/statistics",
    icon: BarChart3,
  },
  {
    name: "Saved Games",
    path: "/saved-games",
    icon: Save,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function MobileSidebar({
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            AI GameVerse
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />

                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;