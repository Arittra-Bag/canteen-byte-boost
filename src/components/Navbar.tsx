
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  History,
  Home,
  Utensils,
  BarChart
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isStudent = currentUser?.role === "student";
  const isCanteenManager = currentUser?.role === "canteen_manager";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
      <nav className="container max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="w-6 h-6 text-teal-400" />
            <span className="font-semibold text-xl">ByteBoost</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isStudent && (
              <>
                <Link to="/" className="text-sm font-medium hover:text-teal-400 transition">Home</Link>
                <Link to="/nutrition" className="text-sm font-medium hover:text-teal-400 transition">Nutrition</Link>
                <Link to="/orders" className="text-sm font-medium hover:text-teal-400 transition">Orders</Link>
              </>
            )}
            
            {isCanteenManager && (
              <>
                <Link to="/" className="text-sm font-medium hover:text-teal-400 transition">Dashboard</Link>
                <Link to="/menu" className="text-sm font-medium hover:text-teal-400 transition">Menu</Link>
                <Link to="/analytics" className="text-sm font-medium hover:text-teal-400 transition">Analytics</Link>
              </>
            )}
          </div>

          {/* Right side - buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {isStudent && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{currentUser.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {isStudent && (
                      <DropdownMenuItem onClick={() => navigate("/orders")} className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="ghost"
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && currentUser && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-4 animate-fade-in">
            {isStudent && (
              <div className="flex flex-col space-y-4">
                <Link to="/" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="h-4 w-4" /> Home
                </Link>
                <Link to="/nutrition" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <Utensils className="h-4 w-4" /> Nutrition
                </Link>
                <Link to="/orders" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <History className="h-4 w-4" /> Orders
                </Link>
              </div>
            )}
            
            {isCanteenManager && (
              <div className="flex flex-col space-y-4">
                <Link to="/" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/menu" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <Utensils className="h-4 w-4" /> Menu
                </Link>
                <Link to="/analytics" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <BarChart className="h-4 w-4" /> Analytics
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
