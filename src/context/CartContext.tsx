
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "../types";
import { toast } from "@/components/ui/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItem: MenuItem, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.menuItemId === menuItem.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast({
        title: "Added to cart",
        description: `${menuItem.name} added to your cart.`,
      });
      
      return [...prevItems, { menuItemId: menuItem.id, quantity, menuItem }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.menuItemId !== menuItemId)
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.menuItem.price,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
