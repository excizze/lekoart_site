import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Icon } from "@iconify/react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items }) => {
  // Filter out duplicate items based on label
  const uniqueItems = items.reduce((acc: BreadcrumbItem[], current) => {
    const isDuplicate = acc.some(item => item.label === current.label);
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <Breadcrumbs className="py-2">
      {uniqueItems.map((item, index) => (
        <BreadcrumbItem key={index}>
          <Link to={item.href} className="text-gray-600 hover:text-brown">
            {item.label}
          </Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};