// Fallback data to use when database fails
export const fallbackProducts: Product[] = [
  // Vertical monument with embedded images
  { 
    id: 1, 
    title: "Вертикальный памятник 'Классика'", 
    price: 19000, 
    discount_price: 22000,
    category_id: 1,
    description: "Классический вертикальный памятник из черного гранита с полированной поверхностью.",
    base_price: 19000,
    images: [
      {
        id: 1,
        image_url: "https://img.heroui.chat/image/places?w=500&h=800&u=11",
        is_main: true
      }
    ],
    price_modifiers: {
      sizes: {
        "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
        "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"}
      }
    }
  },
  
  // Horizontal monument with embedded images
  { 
    id: 5, 
    title: "Горизонтальный памятник 'Вечность'", 
    price: 22500, 
    discount_price: 25000, 
    category_id: 2,
    description: "Горизонтальный памятник из черного габбро с плавными линиями.",
    base_price: 22500,
    images: [
      {
        id: 9,
        image_url: "https://img.heroui.chat/image/places?w=600&h=800&u=21",
        is_main: true
      },
      {
        id: 10,
        image_url: "https://img.heroui.chat/image/places?w=600&h=800&u=2051",
        is_main: false
      },
      {
        id: 11,
        image_url: "https://img.heroui.chat/image/places?w=600&h=800&u=2052",
        is_main: false
      }
    ],
    price_modifiers: {
      sizes: {
        "120x60x8": {price: 0, name: "120x60x8 см (Стандарт)"},
        "140x70x8": {price: 3500, name: "140x70x8 см (+3500 ₽)"},
        "160x80x8": {price: 7000, name: "160x80x8 см (+7000 ₽)"}
      },
      base_sizes: {
        "60x20x15": {price: 0, name: "60x20x15 см (Стандарт)"},
        "80x25x15": {price: 2200, name: "80x25x15 см (+2200 ₽)"},
        "100x30x15": {price: 4500, name: "100x30x15 см (+4500 ₽)"}
      },
      flower_sizes: {
        "120x60": {price: 0, name: "120x60 см (Стандарт)"},
        "140x70": {price: 1800, name: "140x70 см (+1800 ₽)"},
        "160x80": {price: 3600, name: "160x80 см (+3600 ₽)"}
      },
      polish_types: {
        "mirror": {price: 0, name: "Зеркальная (Стандарт)"},
        "combined": {price: 0, name: "Комбинированная (+15% к цене)"}
      },
      materials: {
        "black_granite": {price: 0, name: "Гранит черный (Стандарт)"},
        "gray_granite": {price: 3500, name: "Гранит серый (+3500 ₽)"},
        "marble": {price: 8200, name: "Мрамор (+8200 ₽)"}
      },
      engravings: {
        "text": {price: 3000, name: "Текст"},
        "portrait": {price: 7000, name: "Портрет"},
        "ornament": {price: 4000, name: "Орнамент"}
      }
    }
  }
];

export const fallbackCategories = [
  { id: 1, name: "Вертикальные памятники", image_url: "https://img.heroui.chat/image/places?w=300&h=200&u=1" },
  { id: 2, name: "Горизонтальные памятники", image_url: "https://img.heroui.chat/image/places?w=300&h=200&u=2" }
];

// Updated fallback product images function to be more dynamic
export const fallbackProductImages = (productId: number) => {
  // Generate a dynamic number of images based on product ID
  // This is just for fallback purposes
  const imageCount = Math.max(1, productId % 6 + 1); // 1-6 images
  const images = [];
  
  // Main image
  images.push({
    id: 1,
    product_id: productId,
    image_url: `https://img.heroui.chat/image/places?w=600&h=800&u=${productId}1`,
    is_main: true
  });
  
  // Additional images
  for (let i = 1; i < imageCount; i++) {
    images.push({
      id: i + 1,
      product_id: productId,
      image_url: `https://img.heroui.chat/image/places?w=600&h=800&u=${productId}2`,
      is_main: false
    });
  }
  
  return images;
};

export const cartSampleItems = [
  {
    id: "1",
    title: "Памятник из гранита (FALLBACK)",
    price: 3200,
    image: "https://img.heroui.chat/image/places?w=300&h=600&u=11",
    quantity: 1,
    articleNumber: "00001",
    description: "Натуральный гранит, 60x40x5 (FALLBACK DATA)"
  }
];

// Define proper interfaces to match the database types
interface ProductImage {
  id: number;
  image_url: string;
  is_main: boolean;
}

interface Product {
  id: number;
  title: string;
  price: number;
  discount_price: number;
  category_id: number;
  description: string;
  base_price: number;
  images: ProductImage[];
  price_modifiers?: {
    sizes?: {[key: string]: {price: number, name: string}},
    base_sizes?: {[key: string]: {price: number, name: string}},
    flower_sizes?: {[key: string]: {price: number, name: string}},
    polish_types?: {[key: string]: {price: number, name: string}},
    materials?: {[key: string]: {price: number, name: string}},
    engravings?: {[key: string]: {price: number, name: string}}
  };
}

// Add function to get fallback products by category
export const fallbackProductsByCategory = (categoryId: number): Product[] => {
  return fallbackProducts.filter(p => p.category_id === categoryId);
};