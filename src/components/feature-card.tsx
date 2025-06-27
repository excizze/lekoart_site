import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
        <Icon 
          icon={icon} 
          className="text-brown" 
          width={24} 
          height={24} 
        />
      </div>
      <h3 className="text-base font-medium text-darkGreen mb-2">
        {title}
      </h3>
      <p className="text-xs text-gray-600 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
};