import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Canteen, MenuItem, NutritionInfo, Order, OrderItem } from "@/types";

// Type mapping helpers to convert from Supabase types to our application types
const mapCanteen = (canteen: Database['public']['Tables']['canteens']['Row']): Canteen => ({
  id: canteen.id,
  name: canteen.name,
  location: canteen.location,
  image: canteen.image || undefined,
  openingTime: canteen.opening_time,
  closingTime: canteen.closing_time,
  rating: canteen.rating,
  cuisine: canteen.cuisine,
});

const mapMenuItem = (item: Database['public']['Tables']['menu_items']['Row']): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
  price: item.price,
  image: item.image || undefined,
  canteenId: item.canteen_id,
  category: item.category,
  nutrition: {
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    isVeg: item.is_veg,
  },
  available: item.available,
  popular: item.popular || false,
});

const mapOrder = (order: Database['public']['Tables']['orders']['Row'], orderItems: OrderItem[]): Order => ({
  id: order.id,
  userId: order.user_id,
  canteenId: order.canteen_id,
  items: orderItems,
  totalAmount: order.total_amount,
  status: order.status as Order['status'],
  placedAt: order.placed_at,
  pickupTime: order.pickup_time || undefined,
});

// Fetch all canteens
export const getCanteens = async (): Promise<Canteen[]> => {
  const { data, error } = await supabase
    .from('canteens')
    .select('*');

  if (error) {
    console.error('Error fetching canteens:', error);
    throw error;
  }

  return data.map(mapCanteen);
};

// Fetch a specific canteen by ID
export const getCanteenById = async (canteenId: string): Promise<Canteen | undefined> => {
  const { data, error } = await supabase
    .from('canteens')
    .select('*')
    .eq('id', canteenId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return undefined;
    }
    console.error('Error fetching canteen:', error);
    throw error;
  }

  return mapCanteen(data);
};

// Fetch menu items by canteen ID
export const getMenuItemsByCanteen = async (canteenId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('canteen_id', canteenId);

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  return data.map(mapMenuItem);
};

// Fetch all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  if (error) {
    console.error('Error fetching all menu items:', error);
    throw error;
  }

  return data.map(mapMenuItem);
};

// Fetch a specific menu item by ID
export const getMenuItemById = async (menuItemId: string): Promise<MenuItem | undefined> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', menuItemId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return undefined;
    }
    console.error('Error fetching menu item:', error);
    throw error;
  }

  return mapMenuItem(data);
};

// Fetch orders by user ID
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  // First get all orders for this user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId);

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }

  if (!orders.length) return [];

  // Then get all order items for these orders
  const orderIds = orders.map(order => order.id);
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw itemsError;
  }

  // Map the order items to their respective orders
  return orders.map(order => {
    const items = orderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        menuItemId: item.menu_item_id || '',
        quantity: item.quantity,
        price: item.price
      }));

    return mapOrder(order, items);
  });
};

// Create a new order
export const createOrder = async (order: Omit<Order, 'id' | 'placedAt'>): Promise<Order> => {
  // Start a transaction
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: order.userId,
      canteen_id: order.canteenId,
      total_amount: order.totalAmount,
      status: order.status,
      pickup_time: order.pickupTime
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  // Insert order items
  const orderItemsToInsert = order.items.map(item => ({
    order_id: newOrder.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsToInsert);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw itemsError;
  }

  return {
    ...order,
    id: newOrder.id,
    placedAt: newOrder.placed_at
  };
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get nutrition logs for a user
export const getNutritionLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching nutrition logs:', error);
    throw error;
  }

  return data;
};

// Create a nutrition log entry
export const createNutritionLog = async (log: {
  userId: string;
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}) => {
  const { error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: log.userId,
      date: log.date,
      total_calories: log.totalCalories,
      total_protein: log.totalProtein,
      total_carbs: log.totalCarbs,
      total_fat: log.totalFat
    });

  if (error) {
    console.error('Error creating nutrition log:', error);
    throw error;
  }
};

// Get nutrition recommendations for a user
export const getNutritionRecommendations = async (userId: string) => {
  const { data, error } = await supabase
    .from('nutrition_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching nutrition recommendations:', error);
    throw error;
  }

  return data;
};

// Create or update a menu item
export const saveMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const supabaseItem = {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image || null,
    canteen_id: item.canteenId,
    category: item.category,
    calories: item.nutrition.calories,
    protein: item.nutrition.protein,
    carbs: item.nutrition.carbs,
    fat: item.nutrition.fat,
    is_veg: item.nutrition.isVeg,
    available: item.available,
    popular: item.popular || false
  };

  let result;
  
  if (item.id && item.id.length > 0) {
    // Update existing item
    const { data, error } = await supabase
      .from('menu_items')
      .update(supabaseItem)
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    result = data;
  } else {
    // Create new item
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ ...supabaseItem, id: undefined })
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    result = data;
  }

  return mapMenuItem(result);
};

// Delete a menu item
export const deleteMenuItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};