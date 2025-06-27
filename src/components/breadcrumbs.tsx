import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

interface BreadcrumbsNavProps {
  items: {
    label: string;
    href: string;
  }[];
}

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items }) => {
  // Filter out any duplicate items and ensure "Главная" only appears once at the beginning
  const processedItems = React.useMemo(() => {
    // Remove any "Главная" entries from the items array
    const filteredItems = items.filter(item => item.label !== "Главная");
    
    return filteredItems;
  }, [items]);

  return (
    <Breadcrumbs size="sm" className="py-2">
      <BreadcrumbItem>
        <Link to="/" className="text-xs text-gray-500">
          Главная
        </Link>
      </BreadcrumbItem>
      {processedItems.map((item, index) => (
        <BreadcrumbItem key={index}>
          {index === processedItems.length - 1 ? (
            <span className="text-xs text-gray-500">{item.label}</span>
          ) : (
            <Link to={item.href} className="text-xs text-gray-500">
              {item.label}
            </Link>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};