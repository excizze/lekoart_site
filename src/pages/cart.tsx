import React from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { BreadcrumbsNav } from "../components/breadcrumbs-nav";

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "card"
  });
  const [formErrors, setFormErrors] = React.useState({
    name: false,
    phone: false,
    email: false
  });
  const history = useHistory();

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Корзина", href: "/cart" },
  ];

  // Add debug logging to help track cart operations
  React.useEffect(() => {
    console.log("Cart items updated:", items);
  }, [items]);

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    console.log("Updating quantity for item:", id, "New quantity:", newQuantity);
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string | number) => {
    console.log("Removing item:", id);
    removeItem(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      phone: !formData.phone.trim() || !/^\+7\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(formData.phone),
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, proceed to checkout
      history.push("/error");
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    
    // Remove all non-digits
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Format as +7(XXX) XXX-XX-XX
    if (phoneNumber.length <= 1) {
      return `+7`;
    } else if (phoneNumber.length <= 4) {
      return `+7(${phoneNumber.slice(1)}`;
    } else if (phoneNumber.length <= 7) {
      return `+7(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
    } else if (phoneNumber.length <= 9) {
      return `+7(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
    } else {
      return `+7(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formattedPhoneNumber }));
    
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbsNav items={breadcrumbItems} />
      
      <h1 className="text-2xl md:text-3xl font-serif text-darkGreen mt-4 mb-8">
        Корзина
      </h1>
      
      {items.length === 0 ? (
        <div className="bg-white-100 p-8 text-center rounded-md">
          <div className="text-gray-500 mb-4">
            <Icon icon="lucide:shopping-cart" width={48} height={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-medium text-darkGreen mb-4">Ваша корзина пуста</h2>
          <p className="text-gray-600 mb-6">Добавьте товары из каталога, чтобы продолжить покупки</p>
          <Button 
            as={Link}
            to="/products"
            color="primary" 
            className="bg-[#D68C37] hover:bg-brown border-none"
          >
            <span className="text-white">Перейти в каталог</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-serif text-darkGreen mb-4">
              Ваши товары
            </h2>
            
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.uniqueId} className="border-b border-white-300 pb-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback image if the original fails to load
                          (e.target as HTMLImageElement).src = `https://img.heroui.chat/image/places?w=300&h=300&u=${item.id}`;
                        }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-darkGreen font-medium">{item.title}</h3>
                        <div className="text-right">
                          <span className="text-brown font-medium">{(item.price * item.quantity).toLocaleString()} ₽</span>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              {item.price.toLocaleString()} ₽ за шт.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">Артикул: {item.articleNumber}</p>
                      
                      {/* Display detailed characteristics with null checks */}
                      <div className="mt-2 text-sm text-gray-600">
                        {item.characteristics && (
                          <>
                            {item.characteristics.size && (
                              <p className="mb-1"><span className="font-medium">Размер стелы:</span> {item.characteristics.size}</p>
                            )}
                            {item.characteristics.baseSize && (
                              <p className="mb-1"><span className="font-medium">Размер подставки:</span> {item.characteristics.baseSize}</p>
                            )}
                            {item.characteristics.flowerSize && (
                              <p className="mb-1"><span className="font-medium">Размер цветника:</span> {item.characteristics.flowerSize}</p>
                            )}
                            {item.characteristics.polishType && (
                              <p className="mb-1"><span className="font-medium">Полировка:</span> {item.characteristics.polishType}</p>
                            )}
                            {item.characteristics.material && (
                              <p className="mb-1"><span className="font-medium">Материал:</span> {item.characteristics.material}</p>
                            )}
                            
                            {item.characteristics.engravings && item.characteristics.engravings.length > 0 && (
                              <p className="mb-1">
                                <span className="font-medium">Гравировка:</span> {item.characteristics.engravings.join(', ')}
                              </p>
                            )}
                          </>
                        )}
                        
                        {/* Fallback if no characteristics are available */}
                        {(!item.characteristics || Object.keys(item.characteristics).length === 0) && (
                          <p className="mb-1">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Уменьшить количество"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.uniqueId)}
                          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                          <Icon icon="lucide:trash-2" width={16} />
                          <span>Удалить</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order form - Right side */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-serif text-darkGreen mb-4">
              Оформление заказа
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Ваше имя *"
                  placeholder="Иван Иванов"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="bordered"
                  isInvalid={formErrors.name}
                  errorMessage={formErrors.name ? "Пожалуйста, введите ваше имя" : ""}
                  className="max-w-full"
                />
              </div>
              
              <div>
                <Input
                  label="Телефон *"
                  placeholder="+7(___) ___-__-__"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  variant="bordered"
                  isInvalid={formErrors.phone}
                  errorMessage={formErrors.phone ? "Пожалуйста, введите корректный номер телефона" : ""}
                  className="max-w-full"
                />
              </div>
              
              <div>
                <Input
                  label="Email *"
                  placeholder="example@mail.ru"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="bordered"
                  isInvalid={formErrors.email}
                  errorMessage={formErrors.email ? "Пожалуйста, введите корректный email" : ""}
                  className="max-w-full"
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-darkGreen font-medium mb-2">Способ оплаты</h3>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <Radio value="card" className="mb-2">
                    Банковской картой
                  </Radio>
                  <Radio value="cash" className="mb-2">
                    Наличными
                  </Radio>
                  <Radio value="transfer">
                    Безналичный расчет
                  </Radio>
                </RadioGroup>
              </div>
              
              <div className="pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Товары ({totalItems})</span>
                  <span className="text-darkGreen font-medium">{totalPrice.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between text-lg pt-2 border-t border-white-300">
                  <span className="font-medium text-darkGreen">Итого</span>
                  <span className="font-medium text-brown">{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                color="primary"
                className="w-full bg-brown hover:bg-brown-light border-none mt-4"
                size="lg"
              >
                <span className="text-white">Оформить заказ</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};