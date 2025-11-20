-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '🍞',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sale_items table (junction table for sales and products)
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (for MVP - adjust for production)
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public read sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow public insert sales" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update sales" ON sales FOR UPDATE USING (true);
CREATE POLICY "Allow public delete sales" ON sales FOR DELETE USING (true);

CREATE POLICY "Allow public read sale_items" ON sale_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert sale_items" ON sale_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update sale_items" ON sale_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete sale_items" ON sale_items FOR DELETE USING (true);

-- Insert initial products
INSERT INTO products (name, price, category, stock, image) VALUES
  ('Pão Francês (Kg)', 18.90, 'Pães', 50, '🥖'),
  ('Sonho de Creme', 8.50, 'Doces', 20, '🥯'),
  ('Café Expresso', 5.00, 'Bebidas', 100, '☕'),
  ('Pão de Queijo', 4.50, 'Salgados', 35, '🧀'),
  ('Bolo de Cenoura (Fat)', 12.00, 'Bolos', 8, '🍰'),
  ('Coxinha de Frango', 7.50, 'Salgados', 15, '🍗'),
  ('Suco de Laranja', 9.00, 'Bebidas', 40, '🍊'),
  ('Baguete Rústica', 12.50, 'Pães', 10, '🥖');
