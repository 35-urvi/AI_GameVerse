import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      {/* Left */}
      {/* <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-muted-foreground">
            AI Gaming Platform
          </h2>

          <p className="text-xs text-muted-foreground/70">
            Challenge. Think. Win.
          </p>
        </div>
      </div> */}
      <div className="flex items-center gap-3">
  <Button
    variant="ghost"
    size="icon"
    className="md:hidden"
    onClick={onMenuClick}
    aria-label="Open menu"
  >
    <Menu className="h-5 w-5" />
  </Button>

  <div>
    <h2 className="text-sm font-medium text-muted-foreground">
      AI Gaming Platform
    </h2>

    <p className="text-xs text-muted-foreground/70">
      Challenge. Think. Win.
    </p>
  </div>
</div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Search */}
        {searchOpen && (
          <div className="hidden w-56 sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search games..."
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="ml-1 flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  G
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">
                  Guest Player
                </p>

                <p className="text-xs text-muted-foreground">
                  Player
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              My Statistics
            </DropdownMenuItem>

            <DropdownMenuItem>
              Saved Games
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Navbar;