import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary animate-glow" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Aibotclip
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Catalog
          </Link>
          <Link to="/request" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact Us
          </Link>
        </div>

        <Link to="/catalog">
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>;
};
export default Navbar;