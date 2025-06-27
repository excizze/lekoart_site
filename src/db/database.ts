import initSqlJs, { Database } from 'sql.js';

// Define types for our product data
export interface Product {
  id: number;
  title: string;
  price: number;
  discount_price: number;
  image_id?: string; // Made optional since we'll use images array instead
  category_id: number;
  description: string;
  base_price: number;
  images: ProductImage[]; // Added images array directly to Product interface
  price_modifiers?: {
    sizes?: {[key: string]: {price: number, name: string}},
    base_sizes?: {[key: string]: {price: number, name: string}},
    flower_sizes?: {[key: string]: {price: number, name: string}},
    polish_types?: {[key: string]: {price: number, name: string}},
    materials?: {[key: string]: {price: number, name: string}},
    engravings?: {[key: string]: {price: number, name: string}}
  };
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_main: boolean;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
}

// Mock database implementation for browser environments
class MockDatabaseManager {
  private static instance: MockDatabaseManager;
  private categories: Category[] = [];
  private products: Product[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): MockDatabaseManager {
    if (!MockDatabaseManager.instance) {
      MockDatabaseManager.instance = new MockDatabaseManager();
    }
    return MockDatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Create sample data
    this.createSampleData();
    this.isInitialized = true;
  }

  private createSampleData(): void {
    // Insert categories
    this.categories = [
      { id: 1, name: "Вертикальные памятники", image_url: "/images/1337.png" },
      { id: 2, name: "Горизонтальные памятники", image_url: "/images/1487.png" }
    ];
    
    // Insert products with images directly embedded
    this.products = [
      // Vertical monuments (category_id: 1) - only 2 products
      { 
        id: 1, 
        title: "Вертикальный памятник 'Классика'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/0000.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0001.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 2, 
        title: "Вертикальный памятник 'Волна'", 
        price: 15000, // Ensure consistent price
        discount_price: 15000,
        category_id: 1,
        description: "Вертикальный памятник из серого гранита с волнообразным верхом. Символизирует течение жизни и вечность.",
        base_price: 15000,
        images: [
          {
            id: 1,
            image_url: "/images/0002.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0003.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/0004.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "80x40x5": {price: 0, name: "80x40x5 см (Стандарт)"},
            "100x50x5": {price: 2000, name: "100x50x5 см (+2000 ₽)"},
            "120x60x5": {price: 4000, name: "120x60x5 см (+4000 ₽)"}
          },
          base_sizes: {
            "45x15x15": {price: 0, name: "45x15x15 см (Стандарт)"},
            "65x20x15": {price: 1500, name: "65x20x15 см (+1500 ₽)"},
            "85x25x15": {price: 3000, name: "85x25x15 см (+3000 ₽)"}
          },
          flower_sizes: {
            "80x40": {price: 0, name: "80x40 см (Стандарт)"},
            "100x50": {price: 1000, name: "100x50 см (+1000 ₽)"},
            "120x60": {price: 2000, name: "120x60 см (+2000 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2000, name: "Гранит серый"},
            "marble": {price: 5000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1000, name: "Текст" },
            portrait: { price: 3500, name: "Портрет" },
            ornament: { price: 1000, name: "Орнамент" }
          }
        }
      },
      { 
        id: 3, 
        title: "Вертикальный памятник 'Ангел'", 
        price: 17500, // Ensure consistent price
        discount_price: 25000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 17500,
        images: [
          {
            id: 1,
            image_url: "/images/0005.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 4, 
        title: "Вертикальный памятник 'Сердце'", 
        price: 19000, // Ensure consistent price
        discount_price: 19000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/0028.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0007.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/0008.png",
            is_main: false
          },
          {
            id: 4,
            image_url: "/images/0009.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 6, 
        title: "Вертикальный памятник 'Вечность'", 
        price: 13000, // Ensure consistent price
        discount_price: 13000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 13000,
        images: [
          {
            id: 1,
            image_url: "/images/0010.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0011.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 7, 
        title: "Вертикальный памятник 'Память'", 
        price: 22000, // Ensure consistent price
        discount_price: 22000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 22000,
        images: [
          {
            id: 1,
            image_url: "/images/0012.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0013.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/0014.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 8, 
        title: "Вертикальный памятник 'Арго'", 
        price: 21000, // Ensure consistent price
        discount_price: 25000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 21000,
        images: [
          {
            id: 1,
            image_url: "/images/0015.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0016.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 9, 
        title: "Вертикальный памятник 'Плита'", 
        price: 17000, // Ensure consistent price
        discount_price: 23000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 17000,
        images: [
          {
            id: 1,
            image_url: "/images/0017.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 10, 
        title: "Вертикальный памятник 'Тень'", 
        price: 16000, // Ensure consistent price
        discount_price: 16000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 16000,
        images: [
          {
            id: 1,
            image_url: "/images/0033.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 11, 
        title: "Вертикальный памятник 'Высота'", 
        price: 18000, // Ensure consistent price
        discount_price: 18000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 18000,
        images: [
          {
            id: 1,
            image_url: "/images/0019.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0038.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/0021.png",
            is_main: false
          },
          {
            id: 4,
            image_url: "/images/0022.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 12, 
        title: "Вертикальный памятник 'Верность'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/0023.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/0024.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/0025.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 13, 
        title: "Вертикальный памятник 'Ветер'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 1,
        description: "Классический вертикальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/0026.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      // Horizontal monuments
      { 
        id: 5, 
        title: "Горизонтальный памятник 'Классика'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/1000.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1001.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 23, 
        title: "Горизонтальный памятник 'Волна'", 
        price: 15000, // Ensure consistent price
        discount_price: 15000,
        category_id: 2,
        description: "Горизонтальный памятник из серого гранита с волнообразным верхом. Символизирует течение жизни и вечность.",
        base_price: 15000,
        images: [
          {
            id: 1,
            image_url: "/images/1002.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1003.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "80x40x5": {price: 0, name: "80x40x5 см (Стандарт)"},
            "100x50x5": {price: 2000, name: "100x50x5 см (+2000 ₽)"},
            "120x60x5": {price: 4000, name: "120x60x5 см (+4000 ₽)"}
          },
          base_sizes: {
            "45x15x15": {price: 0, name: "45x15x15 см (Стандарт)"},
            "65x20x15": {price: 1500, name: "65x20x15 см (+1500 ₽)"},
            "85x25x15": {price: 3000, name: "85x25x15 см (+3000 ₽)"}
          },
          flower_sizes: {
            "80x40": {price: 0, name: "80x40 см (Стандарт)"},
            "100x50": {price: 1000, name: "100x50 см (+1000 ₽)"},
            "120x60": {price: 2000, name: "120x60 см (+2000 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2000, name: "Гранит серый"},
            "marble": {price: 5000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1000, name: "Текст" },
            portrait: { price: 3500, name: "Портрет" },
            ornament: { price: 1000, name: "Орнамент" }
          }
        }
      },
      { 
        id: 14, 
        title: "Горизонтальный памятник 'Ангел'", 
        price: 17500, // Ensure consistent price
        discount_price: 25000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 17500,
        images: [
          {
            id: 1,
            image_url: "/images/1004.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1005.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 15, 
        title: "Горизонтальный памятник 'Сердце'", 
        price: 19000, // Ensure consistent price
        discount_price: 19000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/1006.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1007.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 16, 
        title: "Горизонтальный памятник 'Вечность'", 
        price: 13000, // Ensure consistent price
        discount_price: 13000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 13000,
        images: [
          {
            id: 1,
            image_url: "/images/1008.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1009.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 17, 
        title: "Горизонтальный памятник 'Память'", 
        price: 22000, // Ensure consistent price
        discount_price: 22000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 22000,
        images: [
          {
            id: 1,
            image_url: "/images/1010.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1011.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 18, 
        title: "Горизонтальный памятник 'Арго'", 
        price: 21000, // Ensure consistent price
        discount_price: 25000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 21000,
        images: [
          {
            id: 1,
            image_url: "/images/1012.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1013.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 19, 
        title: "Горизонтальный памятник 'Плита'", 
        price: 17000, // Ensure consistent price
        discount_price: 23000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 17000,
        images: [
          {
            id: 1,
            image_url: "/images/1018.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 20, 
        title: "Горизонтальный памятник 'Тень'", 
        price: 16000, // Ensure consistent price
        discount_price: 16000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 16000,
        images: [
          {
            id: 1,
            image_url: "/images/1015.png",
            is_main: true
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 21, 
        title: "Горизонтальный памятник 'Высота'", 
        price: 18000, // Ensure consistent price
        discount_price: 18000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 18000,
        images: [
          {
            id: 1,
            image_url: "/images/1017.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1028.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 21, 
        title: "Горизонтальный памятник 'Верность'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/1019.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1024.png",
            is_main: false
          },
          {
            id: 3,
            image_url: "/images/1025.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      },
      { 
        id: 22, 
        title: "Горизонтальный памятник 'Ветер'", 
        price: 19000, // Ensure consistent price
        discount_price: 22000,
        category_id: 2,
        description: "Классический горизонтальный памятник из черного гранита с полированной поверхностью. Отличается строгостью и элегантностью форм.",
        base_price: 19000,
        images: [
          {
            id: 1,
            image_url: "/images/1026.png",
            is_main: true
          },
          {
            id: 2,
            image_url: "/images/1027.png",
            is_main: false
          }
        ],
        price_modifiers: {
          sizes: {
            "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
            "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"},
            "130x60x5": {price: 5000, name: "130x60x5 см (+5000 ₽)"}
          },
          base_sizes: {
            "50x15x15": {price: 0, name: "50x15x15 см (Стандарт)"},
            "70x20x15": {price: 1800, name: "70x20x15 см (+1800 ₽)"},
            "90x25x15": {price: 3500, name: "90x25x15 см (+3500 ₽)"}
          },
          flower_sizes: {
            "90x45": {price: 0, name: "90x45 см (Стандарт)"},
            "110x50": {price: 1200, name: "110x50 см (+1200 ₽)"},
            "130x60": {price: 2400, name: "130x60 см (+2400 ₽)"}
          },
          materials: {
            "black_granite": {price: 0, name: "Гранит черный"},
            "gray_granite": {price: 2500, name: "Гранит серый"},
            "marble": {price: 6000, name: "Мрамор"}
          },
          engravings: {
            text: { price: 1700, name: "Текст" },
            portrait: { price: 3200, name: "Портрет" },
            ornament: { price: 1550, name: "Орнамент" }
          }
        }
      }
    ];
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }

  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: number): Product | null {
    const product = this.products.find(p => p.id === id);
    return product ? {...product} : null;
  }

  public getProductImages(productId: number): ProductImage[] {
    // Get the product first
    const product = this.products.find(p => p.id === productId);
    
    // Return the product's images if found, otherwise empty array
    return product ? [...product.images] : [];
  }

  public getProductsByCategory(categoryId: number): Product[] {
    return this.products.filter(p => p.category_id === categoryId);
  }
}

// Export the mock database manager instead of the SQL.js implementation
export const dbManager = MockDatabaseManager.getInstance();
export default dbManager;