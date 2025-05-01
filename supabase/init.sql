-- Initialize Supabase database with tables and sample data

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'canteen_manager', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_img TEXT,
  auth_user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS canteens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  rating NUMERIC(3,1) DEFAULT 4.0,
  cuisine TEXT[] DEFAULT '{}',
  manager_id UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  canteen_id UUID NOT NULL REFERENCES canteens(id),
  category TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein NUMERIC(10,2) NOT NULL,
  carbs NUMERIC(10,2) NOT NULL,
  fat NUMERIC(10,2) NOT NULL,
  is_veg BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  popular BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  canteen_id UUID NOT NULL REFERENCES canteens(id),
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE DEFAULT CURRENT_DATE,
  total_calories INTEGER NOT NULL DEFAULT 0,
  total_protein NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_carbs NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_fat NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nutrition_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  recommendation TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data

-- Insert sample profiles
INSERT INTO profiles (id, name, email, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'John Student', 'john@example.com', 'student'),
  ('00000000-0000-0000-0000-000000000002', 'Jane Manager', 'jane@example.com', 'canteen_manager'),
  ('00000000-0000-0000-0000-000000000003', 'Admin User', 'admin@example.com', 'admin');

-- Insert sample canteens
INSERT INTO canteens (id, name, location, image, opening_time, closing_time, rating, cuisine, manager_id)
VALUES 
  ('00000000-0000-0000-0000-000000000101', 'Campus Bytes', 'Main Building, Ground Floor', 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=1935&auto=format&fit=crop', '07:30', '20:00', 4.5, ARRAY['Italian', 'Continental'], '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000102', 'Healthy Hub', 'Science Block, First Floor', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1974&auto=format&fit=crop', '08:00', '18:00', 4.8, ARRAY['Healthy', 'Vegan'], '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000103', 'Global Flavors', 'Student Center', 'https://images.unsplash.com/photo-1555992457-b8fefdd37005?q=80&w=2064&auto=format&fit=crop', '10:00', '21:00', 4.2, ARRAY['Asian', 'Mexican'], '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000104', 'Tech Bites', 'Engineering Building', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', '08:30', '19:00', 4.0, ARRAY['Snacks', 'Beverages'], '00000000-0000-0000-0000-000000000002');

-- Insert sample menu items
INSERT INTO menu_items (id, name, description, price, image, canteen_id, category, calories, protein, carbs, fat, is_veg, available, popular)
VALUES
  ('00000000-0000-0000-0000-000000000201', 'Veggie Quinoa Bowl', 'Fresh vegetables with quinoa, avocado, and tahini dressing', 8.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop', '00000000-0000-0000-0000-000000000102', 'Main Course', 320, 12, 45, 10, TRUE, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000202', 'Grilled Chicken Sandwich', 'Grilled chicken breast with lettuce, tomato, and mayo on whole grain bread', 7.49, 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=2070&auto=format&fit=crop', '00000000-0000-0000-0000-000000000101', 'Sandwich', 450, 28, 35, 18, FALSE, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000203', 'Green Smoothie', 'Blend of spinach, banana, mango, and coconut water', 4.99, 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1974&auto=format&fit=crop', '00000000-0000-0000-0000-000000000102', 'Beverages', 180, 3, 40, 1, TRUE, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000204', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 10.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', '00000000-0000-0000-0000-000000000101', 'Pizza', 650, 24, 80, 22, TRUE, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000205', 'Beef Burritos', 'Flour tortilla filled with beef, rice, beans, and cheese', 9.49, 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?q=80&w=1974&auto=format&fit=crop', '00000000-0000-0000-0000-000000000103', 'Mexican', 580, 25, 65, 24, FALSE, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000206', 'Vegan Pad Thai', 'Rice noodles with tofu, vegetables, and peanut sauce', 8.99, 'https://images.unsplash.com/photo-1635023414397-728734701a34?q=80&w=1974&auto=format&fit=crop', '00000000-0000-0000-0000-000000000103', 'Asian', 420, 15, 70, 8, TRUE, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000207', 'Energy Bar', 'Homemade protein bar with nuts, dates, and dark chocolate', 2.99, 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2eacd?q=80&w=1974&auto=format&fit=crop', '00000000-0000-0000-0000-000000000104', 'Snacks', 250, 10, 25, 12, TRUE, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000208', 'Cold Brew Coffee', 'Smooth cold brew coffee with optional milk', 3.49, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1969&auto=format&fit=crop', '00000000-0000-0000-0000-000000000104', 'Beverages', 15, 0, 2, 0, TRUE, TRUE, FALSE);

-- Insert sample orders
INSERT INTO orders (id, user_id, canteen_id, total_amount, status, placed_at, pickup_time)
VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 13.98, 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 7.49, 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '15 minutes'),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 18.48, 'pending', NOW(), NULL);

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, quantity, price)
VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201', 1, 8.99),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000203', 1, 4.99),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000202', 1, 7.49),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000205', 1, 9.49),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000206', 1, 8.99);

-- Insert sample nutrition logs
INSERT INTO nutrition_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat)
VALUES
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 500, 25, 85, 11),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 450, 28, 35, 18),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 1000, 40, 135, 32);

-- Insert sample nutrition recommendations
INSERT INTO nutrition_recommendations (user_id, recommendation, type)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Based on your recent meals, we suggest increasing your protein intake by adding lean proteins like chicken, fish, or plant-based options like tofu and legumes.', 'protein'),
  ('00000000-0000-0000-0000-000000000001', 'Remember to stay hydrated! Water is essential for digestion and overall health. Consider adding a water or a hydrating beverage to your next order.', 'hydration'),
  ('00000000-0000-0000-0000-000000000001', 'Your carb intake looks good, but try to focus on complex carbs like whole grains and vegetables for sustained energy throughout your study sessions.', 'carbs');

-- Create or replace function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteens ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Create policies for canteens
CREATE POLICY "Canteens are viewable by everyone" ON canteens
  FOR SELECT USING (true);

CREATE POLICY "Canteen managers can update their canteens" ON canteens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = canteens.manager_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

-- Create policies for menu_items
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Canteen managers can update their menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM canteens
      JOIN profiles ON canteens.manager_id = profiles.id
      WHERE canteens.id = menu_items.canteen_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = orders.user_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Canteen managers can view orders for their canteens" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM canteens
      JOIN profiles ON canteens.manager_id = profiles.id
      WHERE canteens.id = orders.canteen_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = orders.user_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Canteen managers can update orders for their canteens" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM canteens
      JOIN profiles ON canteens.manager_id = profiles.id
      WHERE canteens.id = orders.canteen_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN profiles ON orders.user_id = profiles.id
      WHERE orders.id = order_items.order_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Canteen managers can view order items for their canteens" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN canteens ON orders.canteen_id = canteens.id
      JOIN profiles ON canteens.manager_id = profiles.id
      WHERE orders.id = order_items.order_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN profiles ON orders.user_id = profiles.id
      WHERE orders.id = order_items.order_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

-- Create policies for nutrition_logs
CREATE POLICY "Users can view their own nutrition logs" ON nutrition_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = nutrition_logs.user_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own nutrition logs" ON nutrition_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = nutrition_logs.user_id
      AND profiles.auth_user_id = auth.uid()
    )
  );

-- Create policies for nutrition_recommendations
CREATE POLICY "Users can view their own nutrition recommendations" ON nutrition_recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = nutrition_recommendations.user_id
      AND profiles.auth_user_id = auth.uid()
    )
  );