import React from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../context/cart-context";

export interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  discount: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, discount }) => {
  const { addItem } = useCart();
  const history = useHistory();
  
  const handleAddToCart = () => {
    // Create a unique ID for the default configuration
    const uniqueId = `${id}-default`;
    
    // Define specific sizes instead of just "Стандарт"
    addItem({
      id,
      title,
      price,
      image,
      quantity: 1,
      articleNumber: `00${id}`,
      description: "Стандартная комплектация",
      characteristics: {
        size: "100x50x5",
        baseSize: "60x15x15",
        flowerSize: "100x50",
        polishType: "Зеркальная",
        material: "Гранит черный",
        engravings: []
      },
      uniqueId: uniqueId
    });
  };

  // Improved product navigation to preserve pagination state
  const handleProductClick = (e: React.MouseEvent) => {
    // Save current page and scroll position before navigating
    const scrollPosition = window.scrollY.toString();
    
    // Use the current page from state rather than sessionStorage
    const currentPage = sessionStorage.getItem('productListPage') || '1';
    
    sessionStorage.setItem('productListScrollPosition', scrollPosition);
    sessionStorage.setItem('productListPage', currentPage);
    
    // No need to prevent default - let the Link component handle navigation
  };

  return (
    <Card className="border border-white-300 shadow-none" radius="sm">
      <CardBody className="p-0 overflow-hidden">
        <Link to={`/products/${id}`} onClick={handleProductClick}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-64 object-contain transition-all duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to a placeholder if the image fails to load
              (e.target as HTMLImageElement).src = `https://img.heroui.chat/image/places?w=500&h=800&u=${10 + id}`;
            }}
          />
        </Link>
      </CardBody>
      <CardFooter className="flex flex-col items-start p-4 gap-2">
        <Link to={`/products/${id}`} onClick={handleProductClick} className="text-darkGreen hover:text-brown">
          <h3 className="text-sm font-medium line-clamp-2 h-10">{title}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{price.toLocaleString()} ₽</span>
          {discount > price && (
            <span className="text-xs line-through text-gray-500">{discount.toLocaleString()} ₽</span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full mt-2">
          <Button 
            size="sm" 
            color="primary" 
            className="w-full bg-[#D68C37] hover:bg-brown text-[#FFFFFF] border-none"
            as={Link}
            to={`/products/${id}`}
            onClick={handleProductClick}
          >
            <span className="text-[#FFFFFF]">Подробнее</span>
          </Button>
          <Button 
            size="sm" 
            variant="bordered" 
            color="default" 
            className="w-full text-gray-600 border-gray-300"
            onClick={handleAddToCart}
          >
            В корзину
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};