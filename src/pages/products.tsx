import React from "react";
import { Pagination, Button, Spinner } from "@heroui/react";
import { BreadcrumbsNav } from "../components/breadcrumbs";
import { ProductCard } from "../components/product-card";
import { useDatabase } from "../hooks/use-database";
import { useParams, useLocation } from "react-router-dom";
import { fallbackProducts, fallbackProductsByCategory } from "../components/fallback-data";

export const ProductsPage: React.FC = () => {
  // Get category from query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const categoryId = categoryParam ? parseInt(categoryParam) : null;
  
  // Get search query from URL
  const searchParam = queryParams.get('search');
  const [searchQuery, setSearchQuery] = React.useState(searchParam || "");
  
  // Improved page restoration logic
  React.useEffect(() => {
    // Get the navigation type - if user is using back/forward buttons
    const navigationType = window.performance && window.performance.getEntriesByType &&
      window.performance.getEntriesByType('navigation')[0] &&
      (window.performance.getEntriesByType('navigation')[0] as any).type;
    
    const isBackNavigation = navigationType === 'back_forward';
    const referrer = document.referrer;
    const isReturningFromProductDetail = referrer && referrer.includes('/products/');
    
    if (isBackNavigation || isReturningFromProductDetail) {
      // Restore the saved page if returning from product detail
      const savedPage = sessionStorage.getItem('productListPage');
      if (savedPage) {
        setCurrentPage(parseInt(savedPage));
      }
      
      // Restore scroll position after a short delay to ensure the page has rendered
      const savedScrollPosition = sessionStorage.getItem('productListScrollPosition');
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
        }, 100);
      }
    } else {
      // If not returning from product detail, reset to page 1 only when category/search changes
      if (categoryParam || searchParam) {
        setCurrentPage(1);
        sessionStorage.setItem('productListPage', '1');
      }
    }
  }, [categoryParam, searchParam]);

  // Start with page 1 by default, the useEffect above will update if needed
  const [currentPage, setCurrentPage] = React.useState(1);
  const { isLoading, error, getProducts, getProductsByCategory, getCategories, getProductImages } = useDatabase();
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<number | null>(categoryId);
  const [totalPages, setTotalPages] = React.useState(1);
  
  // Items per page
  const itemsPerPage = 8;

  React.useEffect(() => {
    if (!isLoading) {
      try {
        // Load categories
        const allCategories = getCategories();
        setCategories(allCategories);
        
        // Load products based on category filter and search query
        let filteredProducts = [];
        
        // First get all products or category-filtered products
        if (activeCategory) {
          filteredProducts = getProductsByCategory(activeCategory);
          if (filteredProducts.length === 0) {
            filteredProducts = fallbackProductsByCategory(activeCategory);
          }
        } else {
          filteredProducts = getProducts();
          if (filteredProducts.length === 0) {
            filteredProducts = fallbackProducts;
          }
        }
        
        // Then filter by search query if present
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setProducts(filteredProducts);
        
        // Calculate total pages
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
      } catch (err) {
        console.error("Error loading products:", err);
        const fallbackData = activeCategory ? fallbackProductsByCategory(activeCategory) : fallbackProducts;
        setProducts(fallbackData);
        setTotalPages(Math.ceil(fallbackData.length / itemsPerPage));
      }
    }
  }, [isLoading, getProducts, getProductsByCategory, getCategories, activeCategory, searchQuery]);

  // Update active category when URL param changes
  React.useEffect(() => {
    setActiveCategory(categoryId);
    
    // Only reset to page 1 when category changes, not when returning from product detail
    const referrer = document.referrer;
    const isReturningFromProductDetail = referrer && referrer.includes('/products/');
    
    if (!isReturningFromProductDetail) {
      setCurrentPage(1);
      sessionStorage.setItem('productListPage', '1');
    }
  }, [categoryId]);

  // Update search query when URL param changes
  React.useEffect(() => {
    setSearchQuery(searchParam || "");
    
    // Only reset to page 1 when search changes, not when returning from product detail
    const referrer = document.referrer;
    const isReturningFromProductDetail = referrer && referrer.includes('/products/');
    
    if (searchParam && !isReturningFromProductDetail) {
      setCurrentPage(1);
      sessionStorage.setItem('productListPage', '1');
    }
  }, [searchParam]);

  // Get category name for breadcrumb
  const getCategoryName = () => {
    if (!activeCategory) return "Все памятники";
    const category = categories.find(c => c.id === activeCategory);
    return category ? category.name : "Памятники";
  };

  const breadcrumbItems = [
    { label: getCategoryName(), href: activeCategory ? `/products?category=${activeCategory}` : "/products" },
  ];

  // Get product images for display - Updated to use embedded images
  const getProductMainImage = React.useCallback((productId: number) => {
    try {
      const product = products.find(p => p.id === productId);
      if (product && product.images && product.images.length > 0) {
        // Find the main image from the product's embedded images array
        const mainImage = product.images.find(img => img.is_main);
        if (mainImage) {
          return mainImage.image_url;
        }
        // If no main image is marked, use the first one
        return product.images[0].image_url;
      }
    } catch (err) {
      console.error(`Error getting images for product ${productId}:`, err);
    }
    return `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + productId}`;
  }, [products]);

  // Restore page and scroll position when returning to this page
  React.useEffect(() => {
    const savedPage = sessionStorage.getItem('productListPage');
    const savedScrollPosition = sessionStorage.getItem('productListScrollPosition');
    
    if (savedPage) {
      const pageNumber = parseInt(savedPage);
      setCurrentPage(pageNumber);
      
      // Make sure we have products before trying to paginate
      if (products.length > 0) {
        // No need to call handlePageChange here as it would reset scroll position
        // Just update the current page state
      }
      
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
        }, 100);
      }
    }
  }, [products.length]);
  
  // Save scroll position before navigating away
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('productListScrollPosition', window.scrollY.toString());
      sessionStorage.setItem('productListPage', currentPage.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      // Save current state when component unmounts (e.g., navigating to product detail)
      sessionStorage.setItem('productListScrollPosition', window.scrollY.toString());
      sessionStorage.setItem('productListPage', currentPage.toString());
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentPage]);
  
  // Update currentPage when pagination changes - improved to save both keys
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Save page in both storage keys to ensure consistency
    sessionStorage.setItem('currentProductsPage', page.toString());
    sessionStorage.setItem('productListPage', page.toString());
    window.scrollTo(0, 0);
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
        <span className="ml-2">Загрузка данных...</span>
      </div>
    );
  }

  if (error) {
    console.error("Database error:", error);
    // Use fallback data instead of showing error
    if (products.length === 0) {
      setProducts(fallbackProducts);
    }
  }

  const currentProducts = getCurrentPageProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbsNav items={breadcrumbItems} />
      
      <h1 className="text-2xl font-serif text-brown mt-4 mb-6">
        {searchQuery ? `Результаты поиска: "${searchQuery}"` : getCategoryName()}
      </h1>

      {/* Removed category filter buttons */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            discount={product.discount_price}
            image={getProductMainImage(product.id)}
          />
        ))}
      </div>
      
      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Товары не найдены</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination 
            total={totalPages} 
            initialPage={currentPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            classNames={{
              cursor: "bg-[#D68C37] text-white hover:bg-[#b17134]"
            }}
          />
        </div>
      )}
    </div>
  );
};