import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, Home } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const showBackToDashboard = location.pathname !== '/';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">BloodConnect</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {showBackToDashboard && (
              <Link to="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/auth/dashboard">
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-sm">
            <div className="py-4 space-y-4">
              <a href="#home" className="block text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#how-it-works" className="block text-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#about" className="block text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="block text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <div className="pt-4 space-y-2">
                {showBackToDashboard && (
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                )}
                {user ? (
                  <>
                    <Link to="/auth/dashboard" className="block">
                      <Button variant="outline" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="block">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth/signup" className="block">
                      <Button variant="hero" className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};