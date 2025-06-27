import React from 'react';
import { dbManager, Product, Category, ProductImage } from '../db/database';

export function useDatabase() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initDb = async () => {
      try {
        setIsLoading(true);
        await dbManager.initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setIsLoading(false);
      }
    };

    initDb();
  }, []);

  const getCategories = React.useCallback((): Category[] => {
    if (!isInitialized) return [];
    try {
      return dbManager.getCategories();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get categories'));
      return [];
    }
  }, [isInitialized]);

  const getProducts = React.useCallback((): Product[] => {
    if (!isInitialized) return [];
    try {
      return dbManager.getProducts();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get products'));
      return [];
    }
  }, [isInitialized]);

  const getProductById = React.useCallback((id: number): Product | null => {
    if (!isInitialized) return null;
    try {
      return dbManager.getProductById(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get product with id ${id}`));
      return null;
    }
  }, [isInitialized]);

  const getProductImages = React.useCallback((productId: number): ProductImage[] => {
    if (!isInitialized) return [];
    try {
      // Get images directly from the product object
      const product = dbManager.getProductById(productId);
      return product?.images || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get images for product ${productId}`));
      return [];
    }
  }, [isInitialized]);

  const getProductsByCategory = React.useCallback((categoryId: number): Product[] => {
    if (!isInitialized) return [];
    try {
      return dbManager.getProductsByCategory(categoryId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get products for category ${categoryId}`));
      return [];
    }
  }, [isInitialized]);

  return {
    isLoading,
    error,
    isInitialized,
    getCategories,
    getProducts,
    getProductById,
    getProductImages,
    getProductsByCategory
  };
}