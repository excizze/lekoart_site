import React from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Button, Tabs, Tab, Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { BreadcrumbsNav } from "../components/breadcrumbs";
import { useDatabase } from "../hooks/use-database";
import { fallbackProductImages } from "../components/fallback-data";
import { useCart } from "../context/cart-context";
import { Link } from "react-router-dom";

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

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [selected, setSelected] = React.useState("details");
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  const { isLoading, error, getProductById, getProductImages } = useDatabase();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [productImages, setProductImages] = React.useState<any[]>([]);
  
  const { addItem } = useCart();
  
  React.useEffect(() => {
    if (!isLoading && id) {
      try {
        const productId = parseInt(id);
        const productData = getProductById(productId);
        
        if (productData) {
          setProduct(productData);
          
          // Use the product's embedded images directly
          if (productData.images && productData.images.length > 0) {
            setProductImages(productData.images);
          } else {
            // Fallback if no images found
            setProductImages(fallbackProductImages(productId));
          }
        } else {
          // Create a fallback product if not found
          const fallbackProduct: Product = {
            id: productId,
            title: "Памятник из гранита",
            price: 19000,
            discount_price: 22000,
            category_id: 1,
            description: "Классический памятник из черного гранита с полированной поверхностью.",
            base_price: 19000,
            images: [
              {
                id: 1,
                image_url: `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + parseInt(id)}`,
                is_main: true
              }
            ],
            price_modifiers: {
              sizes: {
                "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
                "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"}
              },
              engravings: {
                "text": {price: 1200, name: "Текст"},
                "portrait": {price: 3500, name: "Портрет"},
                "ornament": {price: 1800, name: "Орнамент"}
              }
            }
          };
          setProduct(fallbackProduct);
          setProductImages(fallbackProduct.images);
        }
      } catch (err) {
        console.error("Error in product detail:", err);
        // Create a fallback product with embedded images
        const productId = parseInt(id) || 1;
        const fallbackProduct: Product = {
          id: productId,
          title: "Памятник из гранита",
          price: 19000,
          discount_price: 22000,
          category_id: 1,
          description: "Классический памятник из черного гранита с полированной поверхностью.",
          base_price: 19000,
          images: [
            {
              id: 1,
              image_url: `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + parseInt(id)}`,
              is_main: true
            }
          ],
          price_modifiers: {
            sizes: {
              "90x45x5": {price: 0, name: "90x45x5 см (Стандарт)"},
              "110x50x5": {price: 2500, name: "110x50x5 см (+2500 ₽)"}
            },
            engravings: {
              "text": {price: 1200, name: "Текст"},
              "portrait": {price: 3500, name: "Портрет"},
              "ornament": {price: 1800, name: "Орнамент"}
            }
          }
        };
        setProduct(fallbackProduct);
        setProductImages(fallbackProduct.images);
      }
    }
  }, [isLoading, id, getProductById, getProductImages]);
  
  const breadcrumbItems = React.useMemo(() => {
    if (!product) return [
      { label: "Памятники", href: "/products" },
    ];
    
    // Get category name based on product's category_id
    const categoryName = product.category_id === 1 
      ? "Вертикальные памятники" 
      : product.category_id === 2 
        ? "Горизонтальные памятники" 
        : "Памятники";
    
    return [
      { label: categoryName, href: `/products?category=${product.category_id}` },
      { label: product.title, href: `/products/${product.id}` },
    ];
  }, [product]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  // Handle back navigation
  const handleBackClick = () => {
    // Use browser back button to preserve history and return to the correct page
    window.history.back();
  };

  // Update state variables to use the first available option from the product
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedBaseSize, setSelectedBaseSize] = React.useState<string>("");
  const [selectedFlowerSize, setSelectedFlowerSize] = React.useState<string>("");
  const [selectedPolishType, setSelectedPolishType] = React.useState<string>("mirror");
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>("black_granite");
  const [selectedEngravings, setSelectedEngravings] = React.useState<string[]>([]);
  
  // Set initial values when product loads
  React.useEffect(() => {
    if (product && product.price_modifiers) {
      // Set default selections based on the first available option for each category
      if (product.price_modifiers.sizes) {
        const sizeKeys = Object.keys(product.price_modifiers.sizes);
        if (sizeKeys.length > 0) {
          setSelectedSize(sizeKeys[0]);
        }
      }
      
      if (product.price_modifiers.base_sizes) {
        const baseSizeKeys = Object.keys(product.price_modifiers.base_sizes);
        if (baseSizeKeys.length > 0) {
          setSelectedBaseSize(baseSizeKeys[0]);
        }
      }
      
      if (product.price_modifiers.flower_sizes) {
        const flowerSizeKeys = Object.keys(product.price_modifiers.flower_sizes);
        if (flowerSizeKeys.length > 0) {
          setSelectedFlowerSize(flowerSizeKeys[0]);
        }
      }
      
      if (product.price_modifiers.polish_types) {
        setSelectedPolishType(Object.keys(product.price_modifiers.polish_types)[0] || "mirror");
      }
      
      if (product.price_modifiers.materials) {
        setSelectedMaterial(Object.keys(product.price_modifiers.materials)[0] || "black_granite");
      }
    }
  }, [product]);
  
  // Calculate final price based on selections
  const calculatePrice = React.useCallback(() => {
    if (!product) return 0;
    
    // Use base_price as starting point, or fall back to price if base_price is not available
    let basePrice = product.base_price || product.price || 0;
    const modifiers = product.price_modifiers || {};
    
    // Add size modifier
    if (modifiers.sizes && selectedSize && modifiers.sizes[selectedSize]) {
      const sizeModifier = typeof modifiers.sizes[selectedSize] === 'object' 
        ? modifiers.sizes[selectedSize].price 
        : modifiers.sizes[selectedSize];
      basePrice += Number(sizeModifier);
    }
    
    // Add base size modifier
    if (modifiers.base_sizes && selectedBaseSize && modifiers.base_sizes[selectedBaseSize]) {
      const baseSizeModifier = typeof modifiers.base_sizes[selectedBaseSize] === 'object'
        ? modifiers.base_sizes[selectedBaseSize].price
        : modifiers.base_sizes[selectedBaseSize];
      basePrice += Number(baseSizeModifier);
    }
    
    // Add flower size modifier
    if (modifiers.flower_sizes && selectedFlowerSize && modifiers.flower_sizes[selectedFlowerSize]) {
      const flowerSizeModifier = typeof modifiers.flower_sizes[selectedFlowerSize] === 'object'
        ? modifiers.flower_sizes[selectedFlowerSize].price
        : modifiers.flower_sizes[selectedFlowerSize];
      basePrice += Number(flowerSizeModifier);
    }
    
    // Add material modifier - properly use the material price from the database
    if (modifiers.materials && selectedMaterial && modifiers.materials[selectedMaterial]) {
      const materialModifier = typeof modifiers.materials[selectedMaterial] === 'object'
        ? modifiers.materials[selectedMaterial].price
        : modifiers.materials[selectedMaterial];
      basePrice += Number(materialModifier);
    }
    
    // Add engraving modifiers
    if (modifiers.engravings) {
      selectedEngravings.forEach(eng => {
        if (modifiers.engravings?.[eng]) {
          const engravingModifier = typeof modifiers.engravings[eng] === 'object'
            ? modifiers.engravings[eng].price
            : modifiers.engravings[eng];
          basePrice += Number(engravingModifier);
        }
      });
    }
    
    // Apply 15% increase for combined polish type
    if (selectedPolishType === "combined") {
      basePrice = Math.round(basePrice * 1.15);
    }
    
    return basePrice;
  }, [product, selectedSize, selectedBaseSize, selectedFlowerSize, selectedPolishType, selectedMaterial, selectedEngravings]);
  
  // Calculate final price and discount price
  const finalPrice = React.useMemo(() => calculatePrice(), [calculatePrice]);
  const discountPrice = React.useMemo(() => {
    if (!product) return 0;
    // Use the product's discount_price directly instead of calculating
    return product.discount_price > finalPrice ? product.discount_price : 0;
  }, [product, finalPrice]);
  
  // Handle engraving toggle
  const handleEngravingToggle = (type: string) => {
    setSelectedEngravings(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Update handleAddToCart to include all product characteristics
  const handleAddToCart = () => {
    if (product && product.price_modifiers) {
      // Get display names from the database price modifiers
      const sizeObj = product.price_modifiers.sizes?.[selectedSize];
      const sizeName = typeof sizeObj === 'object' ? sizeObj.name : selectedSize;
      
      const baseSizeObj = product.price_modifiers.base_sizes?.[selectedBaseSize];
      const baseSizeName = typeof baseSizeObj === 'object' ? baseSizeObj.name : selectedBaseSize;
      
      const flowerSizeObj = product.price_modifiers.flower_sizes?.[selectedFlowerSize];
      const flowerSizeName = typeof flowerSizeObj === 'object' ? flowerSizeObj.name : selectedFlowerSize;
      
      const materialObj = product.price_modifiers.materials?.[selectedMaterial];
      const materialName = typeof materialObj === 'object' ? materialObj.name : 
                          selectedMaterial === "black_granite" ? "Гранит черный" :
                          selectedMaterial === "gray_granite" ? "Гранит серый" : "Мрамор";
      
      const polishTypeObj = product.price_modifiers.polish_types?.[selectedPolishType];
      const polishName = typeof polishTypeObj === 'object' ? polishTypeObj.name :
                        selectedPolishType === "mirror" ? "Зеркальная" : "Комбинированная";
      
      // Create a list of selected engravings
      const engravingsList = selectedEngravings.map(eng => {
        const engravingObj = product.price_modifiers.engravings?.[eng];
        return typeof engravingObj === 'object' ? engravingObj.name : 
               eng === "text" ? "Текст" :
               eng === "portrait" ? "Портрет" : "Орнамент";
      });
      
      // Create a detailed description with all characteristics
      const detailedDescription = [
        `Размер стелы: ${sizeName || 'Стандарт'}`,
        `Размер подставки: ${baseSizeName || 'Стандарт'}`,
        `Размер цветника: ${flowerSizeName || 'Стандарт'}`,
        `Полировка: ${polishName}`,
        `Материал: ${materialName}`
      ].join(', ');
      
      // Create a unique ID based on product ID and all selected characteristics
      const uniqueId = `${product.id}-${selectedSize}-${selectedBaseSize}-${selectedFlowerSize}-${selectedPolishType}-${selectedMaterial}-${selectedEngravings.join('-')}`;
      
      addItem({
        id: product.id,
        title: product.title,
        price: finalPrice,
        image: productImages.length > 0 ? productImages[0].image_url : '',
        quantity: 1,
        articleNumber: `00${product.id}`,
        description: detailedDescription,
        characteristics: {
          size: sizeName,
          baseSize: baseSizeName,
          flowerSize: flowerSizeName,
          polishType: polishName,
          material: materialName,
          engravings: engravingsList
        },
        uniqueId: uniqueId
      });
    }
  };
  
  // Helper functions to get display names
  const getSizeName = (size: string) => {
    const sizeMap: {[key: string]: string} = {
      "100x50x5": "100x50x5 (Стандарт)",
      "120x60x5": "120x60x5 (Средний)",
      "140x70x5": "140x70x5 (Большой)"
    };
    return sizeMap[size] || size;
  };
  
  const getBaseSizeName = (size: string) => {
    const sizeMap: {[key: string]: string} = {
      "60x15x15": "60x15x15 (Стандарт)",
      "80x20x15": "80x20x15 (Средний)",
      "100x25x15": "100x25x15 (Большой)"
    };
    return sizeMap[size] || size;
  };
  
  const getFlowerSizeName = (size: string) => {
    const sizeMap: {[key: string]: string} = {
      "100x50": "100x50 (Стандарт)",
      "120x60": "120x60 (Средний)",
      "140x70": "140x70 (Большой)"
    };
    return sizeMap[size] || size;
  };
  
  const getPolishName = (type: string) => {
    const typeMap: {[key: string]: string} = {
      "mirror": "Зеркальная (Стандарт)",
      "combined": "Комбинированная (+15% к цене)"
    };
    return typeMap[type] || type;
  };
  
  const getMaterialName = (material: string) => {
    const materialMap: {[key: string]: string} = {
      "black_granite": "Гранит черный",
      "gray_granite": "Гранит серый",
      "marble": "Мрамор"
    };
    return materialMap[material] || material;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Ошибка загрузки данных: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <p>Товар не найден</p>
        </div>
      </div>
    );
  }

  // Update getMainImage function to use selectedImage index
  const getMainImage = () => {
    if (product && product.images && product.images.length > 0) {
      // Use the selectedImage index to get the current image
      return productImages[selectedImage]?.image_url || productImages[0].image_url;
    }
    return `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + parseInt(id)}`;
  };
  
  const getGalleryImages = () => {
    if (product && product.images) {
      return product.images.map(img => img.image_url);
    }
    return [`https://img.heroui.chat/image/places?w=500&h=800&u=${10 + parseInt(id)}`];
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brown">Главная</Link>
        <span className="mx-2">/</span>
        <Button 
          variant="light" 
          className="p-0 h-auto text-gray-500 hover:text-brown bg-transparent"
          onClick={handleBackClick}
        >
          Назад к каталогу
        </Button>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Памятник</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <div className="mb-4 relative">
            {productImages.length > 0 ? (
              <img 
                src={getMainImage()} 
                alt={product.title} 
                className="w-full h-auto max-h-[850px] object-contain mx-auto transition-opacity duration-300"
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  (e.target as HTMLImageElement).src = `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + parseInt(id)}`;
                }}
              />
            ) : (
              <div className="w-full h-[850px] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Изображение недоступно</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery - only show if there are multiple images */}
          {productImages.length > 1 ? (
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-16 h-16 border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? "border-brown opacity-100" 
                      : "border-white-300 hover:border-brown-light opacity-80 hover:opacity-100"
                  }`}
                >
                  <img 
                    src={image.image_url} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-contain cursor-pointer"
                    onError={(e) => {
                      // Fallback to a placeholder if the thumbnail fails to load
                      (e.target as HTMLImageElement).src = `https://img.heroui.chat/image/places?w=100&h=100&u=${10 + parseInt(id) + index}`;
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500 flex items-center">
              <Icon icon="lucide:info" className="mr-2 text-gray-400" width={18} />
              Для данного товара доступно только одно изображение
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-serif text-darkGreen mb-2">
            {product.title}
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-medium">{finalPrice.toLocaleString()} ₽</span>
            {discountPrice > finalPrice && (
              <>
                <span className="text-sm line-through text-gray-500">{discountPrice.toLocaleString()} ₽</span>
                <span className="bg-[#D68C37] text-[#FFFFFF] text-xs px-3 py-1 rounded-sm">Скидка</span>
              </>
            )}
          </div>
          
          <div className="mb-6 space-y-6">
            <h3 className="text-sm font-medium mb-2 font-lora">Характеристики</h3>
            
            {/* Size Selection - Dynamic based on product */}
            {product.price_modifiers?.sizes && Object.keys(product.price_modifiers.sizes).length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <Icon icon="lucide:ruler" className="mr-2" width={16} />
                  Размер стелы
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(product.price_modifiers.sizes).map(([key, value]) => {
                    const priceValue = typeof value === 'object' ? value.price : value;
                    const displayName = typeof value === 'object' ? value.name : key;
                    
                    return (
                      <Button 
                        key={key}
                        size="md" 
                        variant={selectedSize === key ? "solid" : "bordered"}
                        color={selectedSize === key ? "primary" : "default"}
                        className={`h-auto py-3 px-4 ${selectedSize === key 
                          ? "bg-[#D68C37] text-white" 
                          : "border-gray-300"
                        }`}
                        onClick={() => setSelectedSize(key)}
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="text-sm font-medium">{key}</span>
                          {Number(priceValue) === 0 ? (
                            <span className="text-xs">Стандарт</span>
                          ) : (
                            <span className="text-xs">+{Number(priceValue).toLocaleString()} ₽</span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Base Size Selection - Dynamic based on product */}
            {product.price_modifiers?.base_sizes && Object.keys(product.price_modifiers.base_sizes).length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <Icon icon="lucide:box" className="mr-2" width={16} />
                  Размер подставки
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(product.price_modifiers.base_sizes).map(([key, value]) => {
                    const priceValue = typeof value === 'object' ? value.price : value;
                    const displayName = typeof value === 'object' ? value.name : key;
                    
                    return (
                      <Button 
                        key={key}
                        size="md" 
                        variant={selectedBaseSize === key ? "solid" : "bordered"}
                        color={selectedBaseSize === key ? "primary" : "default"}
                        className={`h-auto py-3 px-4 ${selectedBaseSize === key 
                          ? "bg-[#D68C37] text-white" 
                          : "border-gray-300"
                        }`}
                        onClick={() => setSelectedBaseSize(key)}
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="text-sm font-medium">{key}</span>
                          {Number(priceValue) === 0 ? (
                            <span className="text-xs">Стандарт</span>
                          ) : (
                            <span className="text-xs">+{Number(priceValue).toLocaleString()} ₽</span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Flower Container Size - Dynamic based on product */}
            {product.price_modifiers?.flower_sizes && Object.keys(product.price_modifiers.flower_sizes).length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <Icon icon="lucide:flower" className="mr-2" width={16} />
                  Размер цветника
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(product.price_modifiers.flower_sizes).map(([key, value]) => {
                    const priceValue = typeof value === 'object' ? value.price : value;
                    const displayName = typeof value === 'object' ? value.name : key;
                    
                    return (
                      <Button 
                        key={key}
                        size="md" 
                        variant={selectedFlowerSize === key ? "solid" : "bordered"}
                        color={selectedFlowerSize === key ? "primary" : "default"}
                        className={`h-auto py-3 px-4 ${selectedFlowerSize === key 
                          ? "bg-[#D68C37] text-white" 
                          : "border-gray-300"
                        }`}
                        onClick={() => setSelectedFlowerSize(key)}
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="text-sm font-medium">{key}</span>
                          {Number(priceValue) === 0 ? (
                            <span className="text-xs">Стандарт</span>
                          ) : (
                            <span className="text-xs">+{Number(priceValue).toLocaleString()} ₽</span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Polish Type - Dynamic based on product */}
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <Icon icon="lucide:sparkles" className="mr-2" width={16} />
                Тип полировки
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="md" 
                  variant={selectedPolishType === "mirror" ? "solid" : "bordered"}
                  color={selectedPolishType === "mirror" ? "primary" : "default"}
                  className={`h-auto py-3 px-4 ${selectedPolishType === "mirror" 
                    ? "bg-[#D68C37] text-white" 
                    : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPolishType("mirror")}
                >
                  <div className="flex flex-col items-center w-full">
                    <span className="text-sm font-medium">Зеркальная</span>
                    <span className="text-xs">Стандарт</span>
                  </div>
                </Button>
                <Button 
                  size="md" 
                  variant={selectedPolishType === "combined" ? "solid" : "bordered"}
                  color={selectedPolishType === "combined" ? "primary" : "default"}
                  className={`h-auto py-3 px-4 ${selectedPolishType === "combined" 
                    ? "bg-[#D68C37] text-white" 
                    : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPolishType("combined")}
                >
                  <div className="flex flex-col items-center w-full">
                    <span className="text-sm font-medium">Комбинированная</span>
                    <span className="text-xs">+15% к цене</span>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Material Selection - Updated to match the style of other metrics */}
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <Icon icon="lucide:layers" className="mr-2" width={16} />
                Материал
              </p>
              <div className="grid grid-cols-3 gap-2">
                {product.price_modifiers?.materials && Object.entries(product.price_modifiers.materials).map(([key, value]) => {
                  const priceValue = typeof value === 'object' ? value.price : value;
                  const displayName = typeof value === 'object' ? value.name : 
                                    key === "black_granite" ? "Гранит черный" :
                                    key === "gray_granite" ? "Гранит серый" : "Мрамор";
                  
                  return (
                    <Button 
                      key={key}
                      size="md" 
                      variant={selectedMaterial === key ? "solid" : "bordered"}
                      color={selectedMaterial === key ? "primary" : "default"}
                      className={`h-auto py-3 px-4 ${selectedMaterial === key 
                        ? "bg-[#D68C37] text-white" 
                        : "border-gray-300"
                      }`}
                      onClick={() => setSelectedMaterial(key)}
                    >
                      <div className="flex flex-col items-center w-full">
                        <span className="text-sm font-medium">{displayName}</span>
                        {Number(priceValue) === 0 ? (
                          <span className="text-xs">Стандарт</span>
                        ) : (
                          <span className="text-xs">+{Number(priceValue).toLocaleString()} ₽</span>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Engraving Options - Updated to use product-specific prices */}
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <Icon icon="lucide:pen-tool" className="mr-2" width={16} />
                Гравировка
              </p>
              <div className="flex flex-wrap gap-4">
                {product.price_modifiers?.engravings && Object.keys(product.price_modifiers.engravings).length > 0 ? (
                  // Use product-specific engraving prices from the database
                  Object.entries(product.price_modifiers.engravings).map(([key, value]) => {
                    const priceValue = typeof value === 'object' ? value.price : value;
                    const displayName = typeof value === 'object' ? value.name : 
                                      key === "text" ? "Текст" :
                                      key === "portrait" ? "Портрет" : "Орнамент";
                    
                    return (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedEngravings.includes(key)}
                          onChange={() => handleEngravingToggle(key)}
                          className="w-4 h-4 rounded text-[#D68C37] focus:ring-[#D68C37] border-gray-300"
                        />
                        <span className="text-sm">{displayName} (+{Number(priceValue).toLocaleString()} ₽)</span>
                      </label>
                    );
                  })
                ) : (
                  // Fallback options if no product-specific engravings are defined
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedEngravings.includes("text")}
                        onChange={() => handleEngravingToggle("text")}
                        className="w-4 h-4 rounded text-[#D68C37] focus:ring-[#D68C37] border-gray-300"
                      />
                      <span className="text-sm">Текст (+1000 ₽)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedEngravings.includes("portrait")}
                        onChange={() => handleEngravingToggle("portrait")}
                        className="w-4 h-4 rounded text-[#D68C37] focus:ring-[#D68C37] border-gray-300"
                      />
                      <span className="text-sm">Портрет (+3000 ₽)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedEngravings.includes("ornament")}
                        onChange={() => handleEngravingToggle("ornament")}
                        className="w-4 h-4 rounded text-[#D68C37] focus:ring-[#D68C37] border-gray-300"
                      />
                      <span className="text-sm">Орнамент (+1500 ₽)</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button 
              size="md" 
              color="primary" 
              className="bg-[#D68C37] hover:bg-brown border-none w-full"
              onClick={handleAddToCart}
            >
              <span className="text-[#FFFFFF]">Добавить в корзину</span>
            </Button>
          </div>
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Icon icon="lucide:truck" width={16} />
              <span>Доставка от 3 до 7 дней</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Icon icon="lucide:credit-card" width={16} />
              <span>Гарантия качества</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white-100 p-6 rounded-md">
        <h2 className="text-xl font-serif text-brown mb-4">
          Описание товара
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          {product.description}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Памятники делают в мастерской прямо на заказ, поэтому каждый памятник полностью уникален и изготовлен с вниманием к деталям. Клиент получает изделие, которое соответствует всем требованиям и пожеланиям.
        </p>
        <p className="text-sm text-gray-700">
          Каждый памятник проходит тщательный контроль качества, проверку на прочность и устойчивость к различным погодным условиям. Это гарантирует долговечность изделия на долгие годы и сохранность его первоначального вида.
        </p>
      </div>
    </div>
  );
};