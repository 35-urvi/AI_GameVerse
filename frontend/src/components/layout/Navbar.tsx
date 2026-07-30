import { useState } from "react";
import {
  Gamepad2,
  Moon,
  Search,
  Sparkles,
  Sun,
  Layers,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:px-8">
      {/* Brand Logo & Title */}
      <Link to="/games" className="group flex items-center gap-3 transition-transform hover:scale-[1.01]">
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-500 shadow-md shadow-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
          <Gamepad2 className="h-5 w-5 text-white" />
        </div> */}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              AI GameVerse
            </h1>
            {/* <Badge variant="outline" className="hidden sm:inline-flex border-primary/30 bg-primary/10 text-[10px] text-primary">
              <Sparkles className="mr-1 h-2.5 w-2.5" />
              Arena
            </Badge> */}
          </div>
          <p className="text-[11px] text-muted-foreground/80 font-medium">
            AI Algorithm & Problem Solving Hub
          </p>
        </div>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI games..."
            className="h-9 pl-9 pr-3 text-xs bg-muted/40 border-border/60 focus-visible:ring-primary/40 rounded-full"
          />
        </form>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-9 w-9 rounded-full"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Quick Games Counter */}
        <Link to="/games">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex gap-1.5 h-9 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-semibold text-primary"
          >
            <Layers className="h-3.5 w-3.5" />
            Games Catalog
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full transition-transform hover:rotate-12"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </Button>
      </div>

      {/* Mobile Search Input expansion */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b bg-background p-3 shadow-md sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games & algorithms..."
              className="pl-9 pr-3 text-xs rounded-full"
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}

export default Navbar;