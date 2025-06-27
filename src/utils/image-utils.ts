/**
 * Utility function to resolve image paths correctly for both local and remote images
 * @param path The image path to resolve
 * @returns The resolved image path
 */
export function resolveImagePath(path: string): string {
  // Check if the path is a local path starting with /images/
  if (path.startsWith('/images/')) {
    try {
      // For Vite, we need to use the import.meta.env.BASE_URL
      // This ensures the path is correctly resolved relative to the deployed base URL
      return `${import.meta.env.BASE_URL}${path.substring(1)}`;
    } catch (error) {
      console.error('Error resolving local image path:', error);
      // Fallback to the original path if there's an error
      return path;
    }
  }
  
  // If it's not a local path, return it as is (e.g., remote URLs)
  return path;
}

/**
 * Check if an image exists at the given path
 * @param path The image path to check
 * @returns Promise that resolves to true if the image exists, false otherwise
 */
export function checkImageExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = resolveImagePath(path);
  });
}

/**
 * Get a fallback image URL if the original image fails to load
 * @param productId The product ID to use in the fallback URL
 * @returns A fallback image URL
 */
export function getFallbackImage(productId: number): string {
  return `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + productId}`;
}