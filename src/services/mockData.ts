
import { Canteen, MenuItem, NutritionInfo, Order } from "@/types";

// Mock Canteens
export const mockCanteens: Canteen[] = [
  {
    id: "c1",
    name: "Campus Bytes",
    location: "Main Building, Ground Floor",
    image: "https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=1935&auto=format&fit=crop",
    openingTime: "07:30",
    closingTime: "20:00",
    rating: 4.5,
    cuisine: ["Italian", "Continental"],
  },
  {
    id: "c2",
    name: "Healthy Hub",
    location: "Science Block, First Floor",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1974&auto=format&fit=crop",
    openingTime: "08:00",
    closingTime: "18:00",
    rating: 4.8,
    cuisine: ["Healthy", "Vegan"],
  },
  {
    id: "c3",
    name: "Global Flavors",
    location: "Student Center",
    image: "https://images.unsplash.com/photo-1555992457-b8fefdd37005?q=80&w=2064&auto=format&fit=crop",
    openingTime: "10:00",
    closingTime: "21:00",
    rating: 4.2,
    cuisine: ["Asian", "Mexican"],
  },
  {
    id: "c4",
    name: "Tech Bites",
    location: "Engineering Building",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    openingTime: "08:30",
    closingTime: "19:00",
    rating: 4.0,
    cuisine: ["Snacks", "Beverages"],
  },
];

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Veggie Quinoa Bowl",
    description: "Fresh vegetables with quinoa, avocado, and tahini dressing",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    canteenId: "c2",
    category: "Main Course",
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      isVeg: true,
    },
    available: true,
    popular: true,
  },
  {
    id: "m2",
    name: "Grilled Chicken Sandwich",
    description: "Grilled chicken breast with lettuce, tomato, and mayo on whole grain bread",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=2070&auto=format&fit=crop",
    canteenId: "c1",
    category: "Sandwich",
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 35,
      fat: 18,
      isVeg: false,
    },
    available: true,
  },
  {
    id: "m3",
    name: "Green Smoothie",
    description: "Blend of spinach, banana, mango, and coconut water",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1974&auto=format&fit=crop",
    canteenId: "c2",
    category: "Beverages",
    nutrition: {
      calories: 180,
      protein: 3,
      carbs: 40,
      fat: 1,
      isVeg: true,
    },
    available: true,
  },
  {
    id: "m4",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    canteenId: "c1",
    category: "Pizza",
    nutrition: {
      calories: 650,
      protein: 24,
      carbs: 80,
      fat: 22,
      isVeg: true,
    },
    available: true,
    popular: true,
  },
  {
    id: "m5",
    name: "Beef Burritos",
    description: "Flour tortilla filled with beef, rice, beans, and cheese",
    price: 9.49,
    image: "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?q=80&w=1974&auto=format&fit=crop",
    canteenId: "c3",
    category: "Mexican",
    nutrition: {
      calories: 580,
      protein: 25,
      carbs: 65,
      fat: 24,
      isVeg: false,
    },
    available: true,
  },
  {
    id: "m6",
    name: "Vegan Pad Thai",
    description: "Rice noodles with tofu, vegetables, and peanut sauce",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1635023414397-728734701a34?q=80&w=1974&auto=format&fit=crop",
    canteenId: "c3",
    category: "Asian",
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 70,
      fat: 8,
      isVeg: true,
    },
    available: true,
  },
  {
    id: "m7",
    name: "Energy Bar",
    description: "Homemade protein bar with nuts, dates, and dark chocolate",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2eacd?q=80&w=1974&auto=format&fit=crop",
    canteenId: "c4",
    category: "Snacks",
    nutrition: {
      calories: 250,
      protein: 10,
      carbs: 25,
      fat: 12,
      isVeg: true,
    },
    available: true,
  },
  {
    id: "m8",
    name: "Cold Brew Coffee",
    description: "Smooth cold brew coffee with optional milk",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1969&auto=format&fit=crop",
    canteenId: "c4",
    category: "Beverages",
    nutrition: {
      calories: 15,
      protein: 0,
      carbs: 2,
      fat: 0,
      isVeg: true,
    },
    available: true,
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "o1",
    userId: "1",
    canteenId: "c2",
    items: [
      { menuItemId: "m1", quantity: 1, price: 8.99 },
      { menuItemId: "m3", quantity: 1, price: 4.99 },
    ],
    totalAmount: 13.98,
    status: "completed",
    placedAt: "2023-04-15T12:30:00",
    pickupTime: "2023-04-15T13:00:00",
  },
  {
    id: "o2",
    userId: "1",
    canteenId: "c1",
    items: [
      { menuItemId: "m2", quantity: 1, price: 7.49 },
    ],
    totalAmount: 7.49,
    status: "completed",
    placedAt: "2023-04-16T18:15:00",
    pickupTime: "2023-04-16T18:30:00",
  },
  {
    id: "o3",
    userId: "1",
    canteenId: "c3",
    items: [
      { menuItemId: "m5", quantity: 1, price: 9.49 },
      { menuItemId: "m6", quantity: 1, price: 8.99 },
    ],
    totalAmount: 18.48,
    status: "pending",
    placedAt: new Date().toISOString(),
  },
];

// Nutrition recommendations based on user's past orders
export const mockNutritionRecommendations = [
  {
    id: "n1",
    title: "More Protein in Your Diet",
    description: "Based on your recent meals, we suggest increasing your protein intake by adding lean proteins like chicken, fish, or plant-based options like tofu and legumes.",
    items: ["m2", "m5"],
  },
  {
    id: "n2",
    title: "Hydration Reminder",
    description: "Remember to stay hydrated! Water is essential for digestion and overall health. Consider adding a water or a hydrating beverage to your next order.",
    items: ["m3"],
  },
  {
    id: "n3",
    title: "Balanced Carbohydrates",
    description: "Your carb intake looks good, but try to focus on complex carbs like whole grains and vegetables for sustained energy throughout your study sessions.",
    items: ["m1", "m6"],
  },
];

// Mock function to get canteens
export const getCanteens = (): Promise<Canteen[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCanteens);
    }, 500);
  });
};

// Mock function to get menu items by canteen ID
export const getMenuItemsByCanteen = (canteenId: string): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = mockMenuItems.filter((item) => item.canteenId === canteenId);
      resolve(items);
    }, 500);
  });
};

// Mock function to get all menu items
export const getAllMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMenuItems);
    }, 500);
  });
};

// Mock function to get orders by user ID
export const getOrdersByUser = (userId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = mockOrders.filter((order) => order.userId === userId);
      resolve(orders);
    }, 500);
  });
};

// Mock function to get nutrition recommendations for a user
export const getNutritionRecommendations = (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNutritionRecommendations);
    }, 500);
  });
};

// Mock function to get a canteen by ID
export const getCanteenById = (canteenId: string): Promise<Canteen | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const canteen = mockCanteens.find((c) => c.id === canteenId);
      resolve(canteen);
    }, 300);
  });
};

// Mock function to get a menu item by ID
export const getMenuItemById = (menuItemId: string): Promise<MenuItem | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const menuItem = mockMenuItems.find((item) => item.id === menuItemId);
      resolve(menuItem);
    }, 300);
  });
};
