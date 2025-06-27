import React from "react";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 502,
  title = "Ошибка сервера",
  message = "Извините, сервер временно недоступен. Пожалуйста, попробуйте позже."
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="mb-6 text-brown">
          <Icon icon="lucide:server-off" width={64} height={64} />
        </div>
        
        <h1 className="text-4xl font-serif text-darkGreen mb-2">
          Ошибка {code}
        </h1>
        
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            as={Link}
            to="/"
            color="primary"
            className="bg-brown hover:bg-brown-light border-none"
          >
            <span className="text-white">Вернуться на главную</span>
          </Button>
          
          <Button
            variant="bordered"
            color="default"
            onClick={() => window.location.reload()}
            className="text-gray-600 border-gray-300"
          >
            Обновить страницу
          </Button>
        </div>
      </div>
    </div>
  );
};