import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Map, Settings } from "lucide-react";
import { Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/calendar", icon: Calendar, label: "Calendário" },
    { href: "/territories", icon: Map, label: "Mapas" },
    { href: "/settings", icon: Settings, label: "Config" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-3 h-auto space-y-1 ${
                  isActive(href) 
                    ? "text-primary-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
