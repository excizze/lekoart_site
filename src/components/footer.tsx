import React from "react";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkGreen text-white-100 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Левая колонка */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif text-brown font-bold text-2xl">LK</span>
              <span className="text-xs text-white-100">Арт-Мастерская Леко</span>
            </div>
            <p className="text-xs text-white-300 max-w-xs">
              Создаем уникальные изделия из камня с любовью и заботой о деталях
            </p>
            <p className="text-xs text-white-300 mt-4">г. Гатчина</p>
          </div>

          {/* Правая колонка — Контакты */}
          <div className="flex flex-col items-end text-sm space-y-3">
            <h3 className="font-medium mb-2">Контакты</h3>

            <div className="grid grid-cols-[1.5rem_auto] items-center gap-2">
              <Icon
                icon="lucide:map-pin"
                className="text-white-300 justify-self-center"
                width={16}
              />
              <span>г. Гатчина, ул. Чехова, д. 16Б</span>
            </div>

            <div className="grid grid-cols-[1.5rem_auto] items-center gap-2">
              <Icon
                icon="lucide:phone"
                className="text-white-300 justify-self-center"
                width={16}
              />
              <span>+7 (911) 126-36-36</span>
            </div>

            <div className="grid grid-cols-[1.5rem_auto] items-center gap-2">
              <Icon
                icon="lucide:mail"
                className="text-white-300 justify-self-center"
                width={16}
              />
              <span>leko-art@gmail.com</span>
            </div>

            <div className="grid grid-cols-[1.5rem_auto] items-center gap-2">
              <Icon
                icon="lucide:clock"
                className="text-white-300 justify-self-center"
                width={16}
              />
              <span>Ежедневно: 10:00–18:00</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-white-300 text-center">
          © {currentYear} Арт-Мастерская Леко. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
