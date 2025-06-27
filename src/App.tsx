import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { HomePage } from "./pages/home";
import { ProductsPage } from "./pages/products";
import { ProductDetailPage } from "./pages/product-detail";
import { ContactsPage } from "./pages/contacts";
import { ErrorPage } from "./pages/error-page";
import { AboutPage } from "./pages/about";
import { CartPage } from "./pages/cart";
import { CartProvider } from "./context/cart-context";

export default function App() {
  // State to track if there's a server error
  const [hasServerError, setHasServerError] = React.useState(false);

  // Simulate error detection
  React.useEffect(() => {
    // Listen for fetch errors that might indicate server issues
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Check if response is a server error (5xx)
        if (response.status >= 500 && response.status < 600) {
          setHasServerError(true);
        }
        
        return response;
      } catch (error) {
        // Network errors might also indicate server issues
        setHasServerError(true);
        throw error;
      }
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Add improved navigation state handling
  React.useEffect(() => {
    // Store the current location before unloading
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      sessionStorage.setItem('lastVisitedPath', currentPath);
    };
    
    // Handle browser back/forward navigation
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const lastPath = sessionStorage.getItem('lastVisitedPath') || '';
      
      // If navigating from product detail to products list
      if (lastPath.includes('/products/') && currentPath === '/products') {
        // The products page component will handle restoring the page and scroll position
      }
      
      // Update the last visited path
      sessionStorage.setItem('lastVisitedPath', currentPath);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Set initial path
    sessionStorage.setItem('lastVisitedPath', window.location.pathname);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // If server error is detected, show the error page
  if (hasServerError) {
    return (
      <CartProvider>
        <Layout>
          <ErrorPage code={502} />
        </Layout>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products" component={ProductsPage} />
          <Route exact path="/products/:id" component={ProductDetailPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/contacts" component={ContactsPage} />
          <Route exact path="/cart" component={CartPage} />
          {/* Add explicit route for error page */}
          <Route path="/error" component={() => <ErrorPage />} />
          {/* Catch-all route for 404 errors */}
          <Route path="*" component={() => <ErrorPage code={404} title="Страница не найдена" message="Извините, запрашиваемая страница не существует." />} />
        </Switch>
      </Layout>
    </CartProvider>
  );
}