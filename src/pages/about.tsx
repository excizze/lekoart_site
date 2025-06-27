import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export const AboutPage: React.FC = () => {
  // Company values
  const values = [
    {
      icon: "lucide:heart-handshake",
      title: "Уважение и забота",
      description: "Мы относимся с глубоким уважением к памяти ушедших и с заботой к чувствам их близких."
    },
    {
      icon: "lucide:gem",
      title: "Качество материалов",
      description: "Используем только высококачественный гранит и мрамор, проверенный временем и природными условиями."
    },
    {
      icon: "lucide:hammer",
      title: "Мастерство исполнения",
      description: "Наши мастера обладают многолетним опытом и уникальными навыками обработки камня."
    },
    {
      icon: "lucide:palette",
      title: "Индивидуальный подход",
      description: "Каждое изделие создается с учетом индивидуальных пожеланий и особенностей."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-serif text-brown text-center mb-8">
        О нашей мастерской
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* Company history section - removed heading */}
        <div className="mb-12">
          <p className="text-gray-600 mb-4">
            Арт-Мастерская "Леко" была основана в 2005 году группой профессиональных скульпторов и художников по камню. За более чем 15 лет работы мы создали тысячи памятников, которые стали достойным символом памяти об ушедших близких.
          </p>
          <p className="text-gray-600">
            Наша мастерская специализируется на изготовлении памятников и мемориальных комплексов из натурального камня. Мы бережно храним традиции камнеобработки, одновременно внедряя современные технологии для достижения высочайшего качества изделий.
          </p>
        </div>

        {/* Company values section - kept as is */}
        <h2 className="text-xl font-serif text-darkGreen mb-6 text-center">Наши ценности</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {values.map((value, index) => (
            <Card key={index} className="border border-white-300 shadow-sm" radius="sm">
              <CardBody className="flex gap-4 p-5">
                <div className="bg-white-200 p-3 rounded-sm h-fit">
                  <Icon icon={value.icon} className="text-brown" width={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-darkGreen mb-2 font-lora">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Production process - kept as is */}
        <h2 className="text-xl font-serif text-darkGreen mb-6 text-center">Наш процесс работы</h2>
        <div className="bg-white p-6 rounded-sm border border-white-300 shadow-sm mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-brown-light text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium text-darkGreen mb-2 font-lora">Консультация</h3>
              <p className="text-gray-600 text-sm">
                Обсуждаем ваши пожелания, выбираем материал, форму и оформление памятника.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-brown-light text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium text-darkGreen mb-2 font-lora">Изготовление</h3>
              <p className="text-gray-600 text-sm">
                Создаем эскиз, вырезаем форму из камня, выполняем гравировку и полировку.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-brown-light text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium text-darkGreen mb-2 font-lora">Установка</h3>
              <p className="text-gray-600 text-sm">
                Доставляем и профессионально устанавливаем памятник на месте захоронения.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};