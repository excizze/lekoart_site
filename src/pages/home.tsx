import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { ProductCard } from "../components/product-card";
import { FeatureCard } from "../components/feature-card";
import { useDatabase } from "../hooks/use-database";
import { fallbackProducts, fallbackCategories } from "../components/fallback-data";

export const HomePage: React.FC = () => {
  const { isLoading, error, getCategories } = useDatabase();
  const [categories, setCategories] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    if (!isLoading) {
      try {
        const allCategories = getCategories();
        setCategories(allCategories.length > 0 ? allCategories.map(cat => ({
          id: cat.id,
          title: cat.name,
          image: cat.image_url,
          link: `/products?category=${cat.id}` // Link to filtered products page
        })) : fallbackCategories.map(cat => ({
          id: cat.id,
          title: cat.name,
          image: cat.image_url,
          link: `/products?category=${cat.id}` // Link to filtered products page
        })));
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories(fallbackCategories.map(cat => ({
          id: cat.id,
          title: cat.name,
          image: cat.image_url,
          link: `/products?category=${cat.id}` // Link to filtered products page
        })));
      }
    }
  }, [isLoading, getCategories]);

  const features = [
    {
      icon: "lucide:award",
      title: "Высокое качество материалов",
      description: "Мы используем только лучшие материалы, проверенные временем, для создания долговечных изделий."
    },
    {
      icon: "lucide:help-circle",
      title: "Индивидуальный подход",
      description: "Каждый заказ уникален и разрабатывается с учетом всех пожеланий и требований клиента."
    },
    {
      icon: "lucide:clock",
      title: "Оперативное выполнение",
      description: "Мы ценим ваше время и стремимся выполнить заказ в кратчайшие сроки без потери качества."
    },
    {
      icon: "lucide:pencil",
      title: "Уникальный дизайн",
      description: "Наши специалисты создадут для вас эксклюзивный дизайн, который будет соответствовать вашим пожеланиям."
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Ошибка загрузки данных: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-serif text-brown text-center mb-8">
          Каталог наших товаров
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card key={category.id} className="border border-white-300 shadow-none h-full flex flex-col" radius="sm">
              <CardBody className="p-0 overflow-hidden">
                <Link to={category.link}>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-60 object-cover"
                  />
                </Link>
              </CardBody>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-darkGreen mb-3 line-clamp-2 h-10">{category.title}</h3>
                <div className="mt-auto">
                  <Button 
                    as={Link} 
                    to={category.link}
                    size="sm" 
                    color="primary" 
                    className="w-full bg-brown-light hover:bg-brown border-none"
                  >
                    <span className="text-white font-medium">Подробнее</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 py-12 bg-white-100">
        <h2 className="text-xl md:text-2xl font-serif text-brown text-center mb-4">
          Почему выбирают нас
        </h2>
        <p className="text-sm text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Мы создаём памятники, которые становятся настоящим произведением искусства и сохраняют память о дорогих людях.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-serif text-brown text-center mb-8">
          Готовы создать что-то особенное?
        </h2>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 text-center mb-6 max-w-2xl">
            Свяжитесь с нами для обсуждения вашего проекта или выберите готовое изделие
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              as={Link}
              to="/contacts"
              size="md" 
              color="primary" 
              className="bg-brown-light hover:bg-brown border-none"
            >
              <span className="text-white">Связаться с нами</span>
            </Button>
            <Button 
              as={Link}
              to="/products"
              size="md" 
              variant="bordered" 
              color="default" 
              className="text-gray-600 border-gray-300"
            >
              Посмотреть каталог
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};