'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Plus, Minus, Trash2, User, LogOut, Search, Settings, ChefHat, AlertCircle, CheckCircle, Edit2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { productSchema, type ProductFormData } from '@/lib/validations';

type Product = { 
  id: string; 
  name: string; 
  price: number; 
  category: string; 
  stock: number; 
  image: string 
};

type CartItem = Product & { qty: number };

type Sale = { 
  id: string; 
  total: number; 
  items: CartItem[]; 
  created_at: string; 
  payment_method: string 
};

type User = { role: 'gerente' | 'atendente'; name: string };

const CATEGORIES = ['Todos', 'Pães', 'Doces', 'Salgados', 'Bolos', 'Bebidas'];

// --- COMPONENTES UTILITÁRIOS ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-orange-100 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, type = 'button' }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; 
  className?: string; 
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const styles = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- TELAS PRINCIPAIS ---

export default function SonhoDoceApp() {
  const supabase = createClient();
  
  // Estado Global
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [view, setView] = useState<'login' | 'pos' | 'admin'>('login');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'primary' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          id,
          total,
          payment_method,
          created_at,
          sale_items (
            id,
            product_name,
            product_price,
            quantity
          )
        `)
        .order('created_at', { ascending: false });
      
      if (salesError) throw salesError;
      
      interface SaleItemData {
        id: string;
        product_name: string;
        product_price: number;
        quantity: number;
      }

      interface SaleData {
        id: string;
        total: number;
        payment_method: string;
        created_at: string;
        sale_items: SaleItemData[];
      }

      const formattedSales: Sale[] = (salesData || []).map((sale: SaleData) => ({
        id: sale.id,
        total: sale.total,
        payment_method: sale.payment_method,
        created_at: new Date(sale.created_at).toLocaleString(),
        items: sale.sale_items.map((item: SaleItemData) => ({
          id: item.id,
          name: item.product_name,
          price: item.product_price,
          qty: item.quantity,
          category: '',
          stock: 0,
          image: ''
        }))
      }));
      
      setSalesHistory(formattedSales);
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  // Formatação de Moeda
  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Sistema de Notificação
  const showNotification = (message: string, type: 'success' | 'error' | 'primary' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- LÓGICA DE LOGIN ---
  const LoginScreen = () => {
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'atendente' | 'gerente'>('atendente');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === '1234') {
        const newUser: User = {
          role: selectedRole,
          name: selectedRole === 'gerente' ? 'Maria (Gerente)' : 'João (Atendente)'
        };
        setUser(newUser);
        setView(selectedRole === 'gerente' ? 'admin' : 'pos');
      } else {
        setError('Senha incorreta. Tente 1234.');
      }
    };

    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-orange-600 p-8 text-center">
            <div className="mx-auto w-32 h-24 flex items-center justify-center mb-4">
              <img src="/logo.jpg" alt="Logo Sonho Doce" className="h- w-auto object-contain rounded-lg border-2" />
            </div>
            <h1 className="text-2xl font-bold text-white"></h1>
            <p className="text-orange-100">Sistema de Gestão</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Selecione o Perfil</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('atendente')}
                  className={`p-4 border rounded-xl text-center transition-all ${selectedRole === 'atendente' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  Atendente
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('gerente')}
                  className={`p-4 border rounded-xl text-center transition-all ${selectedRole === 'gerente' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <Settings className="w-6 h-6 mx-auto mb-2" />
                  Gerente
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Digite 1234"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <Button variant="primary" className="w-full py-3 text-lg" type="submit">
              Entrar no Sistema
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // --- LÓGICA DO PDV (Atendente) ---
  const POSScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cartão');

    const filteredProducts = products.filter((p: Product) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const addToCart = (product: Product) => {
      if (product.stock <= 0) {
        showNotification(`Produto ${product.name} sem estoque!`, 'error');
        return;
      }

      setCart((prev: CartItem[]) => {
        const existing = prev.find((item: CartItem) => item.id === product.id);
        if (existing) {
          return prev.map((item: CartItem) => 
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
    };

    const updateQty = (id: string, delta: number) => {
      setCart((prev: CartItem[]) => prev.map((item: CartItem) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          const product = products.find((p: Product) => p.id === id);
          if (product && newQty > product.stock) {
            showNotification("Quantidade máxima em estoque atingida", 'error');
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }).filter((item: CartItem) => item.qty > 0));
    };

    const subtotal = cart.reduce((acc: number, item: CartItem) => acc + (item.price * item.qty), 0);
    const total = subtotal - discountApplied;

    const handleCheckout = async () => {
      try {
        // Create sale record
        const { data: saleData, error: saleError } = await supabase
          .from('sales')
          .insert({
            total,
            payment_method: selectedPaymentMethod
          })
          .select()
          .single();

        if (saleError) throw saleError;

        // Create sale items
        const saleItems = cart.map((item: CartItem) => ({
          sale_id: saleData.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.qty
        }));

        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);

        if (itemsError) throw itemsError;

        // Update stock for each product (fetch current stock first to avoid race conditions)
        for (const item of cart as CartItem[]) {
          // Get current product stock from database
          const { data: currentProduct, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();

          if (fetchError) throw fetchError;
          if (!currentProduct) throw new Error(`Produto ${item.name} não encontrado`);

          // Validate stock availability
          if (currentProduct.stock < item.qty) {
            throw new Error(`Estoque insuficiente para ${item.name}. Disponível: ${currentProduct.stock}, Solicitado: ${item.qty}`);
          }

          // Update stock atomically
          const { error: stockError } = await supabase
            .from('products')
            .update({ stock: currentProduct.stock - item.qty })
            .eq('id', item.id);

          if (stockError) throw stockError;
        }

        // Reload data
        await loadProducts();
        await loadSales();
        
        setCart([]);
        setDiscountApplied(0);
        setPaymentModalOpen(false);
        showNotification('Venda finalizada com sucesso!');
      } catch (error) {
        console.error('Error processing sale:', error);
        showNotification('Erro ao finalizar venda', 'error');
      }
    };

    const applyDiscount = () => {
      if (discountCode === '1234') {
        setDiscountApplied(subtotal * 0.10);
        showNotification('Desconto de gerente aplicado!');
        setDiscountCode('');
      } else {
        showNotification('Senha de gerente inválida', 'error');
      }
    };

    return (
      <div className="flex h-[calc(100vh-80px)] gap-4 p-4 bg-gray-50">
        {/* Área de Produtos */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Filtros */}
          <Card className="p-4 flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar produto..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Grid de Produtos */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-2">
            {loading ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                Carregando produtos...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                Nenhum produto encontrado
              </div>
            ) : (
              filteredProducts.map((product: Product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left flex flex-col h-full ${product.stock === 0 ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="text-4xl mb-3">{product.image}</div>
                  <h3 className="font-bold text-gray-800 leading-tight">{product.name}</h3>
                  <div className="mt-auto pt-2 flex justify-between items-end">
                    <span className="text-orange-600 font-bold text-lg">{formatMoney(product.price)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {product.stock} est
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Carrinho */}
        <Card className="w-96 flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 bg-orange-50 rounded-t-xl">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBasket className="text-orange-600" />
              Pedido Atual
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <ShoppingBasket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              cart.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                    <p className="text-orange-600 font-bold text-sm">{formatMoney(item.price * item.qty)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-red-500">
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-green-600">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3 rounded-b-xl">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            {discountApplied > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto</span>
                <span>- {formatMoney(discountApplied)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>

            {/* Input de Desconto */}
            <div className="flex gap-2">
              <input 
                type="password" 
                placeholder="Senha Gerente (1234)" 
                className="flex-1 px-3 py-2 text-sm border rounded-lg"
                value={discountCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount} className="text-xs px-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium text-gray-700">
                Aplicar %
              </button>
            </div>

            <Button 
              variant="success" 
              className="w-full py-3 text-lg flex items-center justify-center gap-2"
              disabled={cart.length === 0}
              onClick={() => setPaymentModalOpen(true)}
            >
              <CheckCircle size={20} />
              Finalizar Venda
            </Button>
          </div>
        </Card>

        {/* Modal Pagamento */}
        {paymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Confirmar Pagamento</h3>
              <p className="text-gray-600 mb-6 text-center text-lg">
                Total a pagar: <strong className="text-3xl text-orange-600 block mt-2">{formatMoney(total)}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={() => setSelectedPaymentMethod('Cartão')}
                  className={`p-4 border rounded-xl transition-colors flex flex-col items-center gap-2 ${
                    selectedPaymentMethod === 'Cartão' ? 'border-orange-500 bg-orange-50' : 'hover:bg-orange-50 hover:border-orange-500'
                  }`}
                >
                  <span className="text-2xl">💳</span> Cartão
                </button>
                <button 
                  onClick={() => setSelectedPaymentMethod('Dinheiro')}
                  className={`p-4 border rounded-xl transition-colors flex flex-col items-center gap-2 ${
                    selectedPaymentMethod === 'Dinheiro' ? 'border-orange-500 bg-orange-50' : 'hover:bg-orange-50 hover:border-orange-500'
                  }`}
                >
                  <span className="text-2xl">💵</span> Dinheiro
                </button>
                <button 
                  onClick={() => setSelectedPaymentMethod('Pix')}
                  className={`p-4 border rounded-xl transition-colors flex flex-col items-center gap-2 col-span-2 ${
                    selectedPaymentMethod === 'Pix' ? 'border-orange-500 bg-orange-50' : 'hover:bg-orange-50 hover:border-orange-500'
                  }`}
                >
                  <span className="text-2xl">📱</span> Pix
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setPaymentModalOpen(false)}>Cancelar</Button>
                <Button variant="success" className="flex-1" onClick={handleCheckout}>Confirmar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- LÓGICA DO ADMIN (Gerente) ---
  const AdminScreen = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
    const [newProduct, setNewProduct] = useState<{ name: string; price: string; stock: string; category: 'Pães' | 'Doces' | 'Salgados' | 'Bolos' | 'Bebidas' }>({ name: '', price: '', stock: '', category: 'Pães' });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
      setNewProduct({ name: '', price: '', stock: '', category: 'Pães' });
      setEditingProduct(null);
      setFormErrors({});
    };

    const handleAddProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormErrors({});
      
      try {
        const formData = {
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          image: '🍞'
        };

        const validatedData = productSchema.parse(formData);

        const { error } = await supabase
          .from('products')
          .insert({
            name: validatedData.name,
            price: validatedData.price,
            stock: validatedData.stock,
            category: validatedData.category,
            image: validatedData.image
          });

        if (error) throw error;

        await loadProducts();
        resetForm();
        showNotification('Produto cadastrado com sucesso!');
      } catch (error: unknown) {
        console.error('Error adding product:', error);
        if (error && typeof error === 'object' && 'errors' in error) {
          const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> };
          const errors: Record<string, string> = {};
          zodError.errors.forEach((err) => {
            if (err.path && err.path.length > 0) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setFormErrors(errors);
          showNotification('Verifique os campos do formulário', 'error');
        } else {
          showNotification('Erro ao cadastrar produto', 'error');
        }
      }
    };

    const handleEditProduct = (product: Product) => {
      setEditingProduct(product);
      setNewProduct({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category as 'Pães' | 'Doces' | 'Salgados' | 'Bolos' | 'Bebidas'
      });
      setFormErrors({});
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProduct) return;
      
      setFormErrors({});
      
      try {
        const formData = {
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          image: editingProduct.image || '🍞'
        };

        const validatedData = productSchema.parse(formData);

        const { error } = await supabase
          .from('products')
          .update({
            name: validatedData.name,
            price: validatedData.price,
            stock: validatedData.stock,
            category: validatedData.category,
            image: validatedData.image
          })
          .eq('id', editingProduct.id);

        if (error) throw error;

        await loadProducts();
        resetForm();
        showNotification('Produto atualizado com sucesso!');
      } catch (error: unknown) {
        console.error('Error updating product:', error);
        if (error && typeof error === 'object' && 'errors' in error) {
          const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> };
          const errors: Record<string, string> = {};
          zodError.errors.forEach((err) => {
            if (err.path && err.path.length > 0) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setFormErrors(errors);
          showNotification('Verifique os campos do formulário', 'error');
        } else {
          showNotification('Erro ao atualizar produto', 'error');
        }
      }
    };

    const handleDelete = async (id: string) => {
      if(!confirm('Tem certeza que deseja excluir este produto?')) return;
      
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await loadProducts();
        showNotification('Produto removido.', 'primary');
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Erro ao remover produto', 'error');
      }
    };

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
            <h3 className="text-orange-100 font-medium mb-1">Vendas Hoje</h3>
            <p className="text-3xl font-bold">{salesHistory.length} pedidos</p>
          </Card>
          <Card className="p-6 bg-white">
            <h3 className="text-gray-500 font-medium mb-1">Faturamento</h3>
            <p className="text-3xl font-bold text-gray-800">
              {formatMoney(salesHistory.reduce((acc: number, curr: Sale) => acc + curr.total, 0))}
            </p>
          </Card>
          <Card className="p-6 bg-white">
            <h3 className="text-gray-500 font-medium mb-1">Produtos Ativos</h3>
            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'products' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Gerenciar Produtos
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'sales' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Relatório de Vendas
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Cadastro/Edição */}
            <Card className="p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {editingProduct ? (
                    <>
                      <Edit2 size={20} className="text-orange-600" />
                      Editar Produto
                    </>
                  ) : (
                    <>
                      <Plus size={20} className="text-orange-600" />
                      Novo Produto
                    </>
                  )}
                </h3>
                {editingProduct && (
                  <button
                    onClick={resetForm}
                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                    title="Cancelar edição"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input 
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${
                      formErrors.name ? 'border-red-500' : ''
                    }`}
                    value={newProduct.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNewProduct({...newProduct, name: e.target.value});
                      if (formErrors.name) setFormErrors({...formErrors, name: ''});
                    }}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input 
                      type="number" step="0.01" required
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${
                        formErrors.price ? 'border-red-500' : ''
                      }`}
                      value={newProduct.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewProduct({...newProduct, price: e.target.value});
                        if (formErrors.price) setFormErrors({...formErrors, price: ''});
                      }}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                    <input 
                      type="number" required
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${
                        formErrors.stock ? 'border-red-500' : ''
                      }`}
                      value={newProduct.stock}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewProduct({...newProduct, stock: e.target.value});
                        if (formErrors.stock) setFormErrors({...formErrors, stock: ''});
                      }}
                    />
                    {formErrors.stock && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select 
                    className={`w-full p-2 border rounded-lg bg-white ${
                      formErrors.category ? 'border-red-500' : ''
                    }`}
                    value={newProduct.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setNewProduct({...newProduct, category: e.target.value as 'Pães' | 'Doces' | 'Salgados' | 'Bolos' | 'Bebidas'});
                      if (formErrors.category) setFormErrors({...formErrors, category: ''});
                    }}
                  >
                    {CATEGORIES.slice(1).map((c: string) => <option key={c}>{c}</option>)}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                  )}
                </div>
                <Button className="w-full" type="submit">
                  {editingProduct ? 'Atualizar Produto' : 'Cadastrar Produto'}
                </Button>
              </form>
            </Card>

            {/* Lista Produtos */}
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Preço</th>
                      <th className="p-4">Estoque</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product: Product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{product.image} {product.name}</td>
                        <td className="p-4 text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span></td>
                        <td className="p-4 text-gray-800 font-medium">{formatMoney(product.price)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {product.stock} un
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditProduct(product)} 
                              className="text-blue-400 hover:text-blue-600 p-2"
                              title="Editar produto"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)} 
                              className="text-red-400 hover:text-red-600 p-2"
                              title="Excluir produto"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <Card>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-4">ID Venda</th>
                  <th className="p-4">Data/Hora</th>
                  <th className="p-4">Itens</th>
                  <th className="p-4">Método</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {salesHistory.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma venda registrada hoje.</td></tr>
                ) : (
                  salesHistory.map((sale: Sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-500 text-xs">#{sale.id.slice(0, 8)}</td>
                      <td className="p-4 text-gray-800">{sale.created_at}</td>
                      <td className="p-4 text-gray-600">{sale.items.map((i: CartItem) => `${i.qty}x ${i.name}`).join(', ')}</td>
                      <td className="p-4 text-gray-600">{sale.payment_method}</td>
                      <td className="p-4 text-right font-bold text-green-600">{formatMoney(sale.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    );
  };

  // --- RENDERIZAÇÃO GERAL ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Notificação Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg transform transition-all animate-bounce ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 
          notification.type === 'primary' ? 'bg-blue-500 text-white' : 
          'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            {notification.message}
          </div>
        </div>
      )}

      {view === 'login' ? (
        <LoginScreen />
      ) : (
        <>
          {/* Header da Aplicação */}
          <header className="bg-white border-b border-orange-100 h-20 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-0 rounded-lg">
                <img src="/logo.jpg" alt="Logo Sonho Doce" className="h-15 w-auto object-contain rounded-lg" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800 leading-none">Sonho Doce</h1>
                <span className="text-xs text-gray-500 font-medium tracking-wider">SISTEMA DE GESTÃO</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-orange-600 uppercase font-bold">{user?.role}</p>
              </div>
              
              {user?.role === 'gerente' && (
                <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                  <button 
                    onClick={() => setView('pos')} 
                    className={`px-3 py-1.5 rounded-md transition-all ${view === 'pos' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
                  >PDV</button>
                  <button 
                    onClick={() => setView('admin')} 
                    className={`px-3 py-1.5 rounded-md transition-all ${view === 'admin' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
                  >Admin</button>
                </div>
              )}

              <button 
                onClick={() => { setUser(null); setView('login'); setCart([]); }}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>

          {/* Conteúdo Principal */}
          <main>
            {view === 'pos' ? <POSScreen /> : <AdminScreen />}
          </main>
        </>
      )}
    </div>
  );
}
