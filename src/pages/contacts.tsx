import React from "react";
import { Icon } from "@iconify/react";
import { BreadcrumbsNav } from "../components/breadcrumbs-nav";

export const ContactsPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Контакты", href: "/contacts" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbsNav items={breadcrumbItems} />
      
      <h1 className="text-2xl md:text-3xl font-serif text-brown text-center mt-6 mb-4">
        Контакты
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Свяжитесь с нами любым удобным способом
      </p>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Card */}
          <div className="border border-gray-200 rounded-md p-6 flex items-start gap-4">
            <div className="text-brown">
              <Icon icon="lucide:map-pin" width={24} />
            </div>
            <div>
              <h3 className="font-medium text-darkGreen mb-2">Адрес</h3>
              <p className="text-gray-600">г. Гатчина, ул. Чехова, д. 16Б</p>
            </div>
          </div>
          
          {/* Phone Card */}
          <div className="border border-gray-200 rounded-md p-6 flex items-start gap-4">
            <div className="text-brown">
              <Icon icon="lucide:phone" width={24} />
            </div>
            <div>
              <h3 className="font-medium text-darkGreen mb-2">Телефон</h3>
              <p className="text-gray-600">+7 (911) 126-36-36</p>
            </div>
          </div>
          
          {/* Email Card */}
          <div className="border border-gray-200 rounded-md p-6 flex items-start gap-4">
            <div className="text-brown">
              <Icon icon="lucide:mail" width={24} />
            </div>
            <div>
              <h3 className="font-medium text-darkGreen mb-2">Email</h3>
              <p className="text-gray-600">leko-art@gmail.com</p>
            </div>
          </div>
          
          {/* Working Hours Card */}
          <div className="border border-gray-200 rounded-md p-6 flex items-start gap-4">
            <div className="text-brown">
              <Icon icon="lucide:clock" width={24} />
            </div>
            <div>
              <h3 className="font-medium text-darkGreen mb-2">Режим работы</h3>
              <p className="text-gray-600">Ежедневно: 10:00–18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};