import React from "react";
import { Link } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Button, Badge, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Footer } from "./footer";
import { useCart } from "../context/cart-context";
import { SearchResults } from "./search-results";
import { useDatabase } from "../hooks/use-database";
import { fallbackProducts } from "../components/fallback-data";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Add state for mobile menu
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Add state for search functionality
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  
  const { totalItems } = useCart();
  const { getProducts, getProductImages } = useDatabase();

  // Handle click outside search results to close them
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search functionality
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    if (value.length >= 3) {
      try {
        // Get all products
        const allProducts = getProducts() || fallbackProducts;
        
        // Filter products by search query
        const filteredProducts = allProducts.filter(product => 
          product.title.toLowerCase().includes(value.toLowerCase())
        );
        
        // Get images and prepare results
        const results = filteredProducts.slice(0, 5).map(product => {
          let imageUrl = "";
          try {
            const images = getProductImages(product.id);
            if (images && images.length > 0) {
              imageUrl = images[0].image_url;
            }
          } catch (err) {
            imageUrl = `https://img.heroui.chat/image/places?w=100&h=150&u=${10 + product.id}`;
          }
          
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            image: imageUrl || `https://img.heroui.chat/image/places?w=100&h=150&u=${10 + product.id}`
          };
        });
        
        setSearchResults(results);
        setShowResults(true);
      } catch (err) {
        console.error("Error searching products:", err);
        setSearchResults([]);
      }
    } else {
      setShowResults(false);
    }
  };

  // Add event listener to save current path before unload
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Save any important state here if needed
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Reset product page when navigating to non-product pages
  const handleNavigation = (path: string) => {
    // If navigating to products page directly, preserve the current page
    if (path === '/products') {
      // Don't reset the page number
      return;
    }
    
    // If navigating to a non-product page, reset the product list page
    if (!path.match(/\/products\/\d+/) && !path.match(/\/products/)) {
      sessionStorage.setItem('currentProductsPage', '1');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        className="border-b border-white-300 bg-white shadow-sm header-navbar"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        position="sticky"
        shouldHideOnScroll={false}
        style={{ zIndex: 1000, backgroundColor: "#FFFFFF" }}
      >
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-brown font-bold text-2xl">LK</span>
            <span className="text-xs text-gray-800">Арт-Мастерская Леко</span>
          </Link>
        </NavbarBrand>
        
        <NavbarContent className="hidden md:flex gap-4" justify="center">
          <NavbarItem>
            <Link to="/" color="foreground">
              Главная
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/products" color="foreground">
              Каталог
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/about" color="foreground">
              О нас
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/contacts" color="foreground">
              Контакты
            </Link>
          </NavbarItem>
        </NavbarContent>
        
        <NavbarContent justify="end">
          <NavbarItem className="mobile-search-container">
            <div className="flex items-center gap-2" ref={searchRef}>
              <div className="relative">
                <Input
                  classNames={{
                    base: "max-w-[10rem] sm:max-w-[14rem]",
                    inputWrapper: "h-8 bg-white border border-white-300 shadow-sm",
                    input: "bg-white text-darkGreen font-medium",
                  }}
                  placeholder="Поиск..."
                  size="sm"
                  value={searchQuery}
                  onValueChange={handleSearch}
                  startContent={<Icon icon="lucide:search" className="text-gray-500 text-sm" />}
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                {showResults && (
                  <div className="absolute right-0 top-full mobile-search-results" style={{ width: '100vw', maxWidth: '400px' }}>
                    <SearchResults 
                      results={searchResults} 
                      query={searchQuery} 
                      onClose={() => setShowResults(false)} 
                    />
                  </div>
                )}
              </div>
              
              <Badge content={totalItems > 0 ? totalItems : undefined} color="default" size="sm" className="ml-2">
                <Button 
                  as={Link} 
                  to="/cart" 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  className="text-darkGreen"
                >
                  <Icon icon="lucide:shopping-cart" width={20} />
                </Button>
              </Badge>
            </div>
          </NavbarItem>
        </NavbarContent>
        
        <NavbarMenuToggle 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
          className="md:hidden"
        />
        
        <NavbarMenu className="pt-6 bg-white">
          <NavbarMenuItem>
            <Link 
              to="/" 
              className="w-full text-darkGreen hover:text-brown"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link 
              to="/products" 
              className="w-full text-darkGreen hover:text-brown"
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link 
              to="/about" 
              className="w-full text-darkGreen hover:text-brown"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link 
              to="/contacts" 
              className="w-full text-darkGreen hover:text-brown"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <main className="flex-grow relative">
        {children}
      </main>

      <Footer />
    </div>
  );
};