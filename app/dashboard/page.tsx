'use client'

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, X, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { productSchema } from '@/lib/validations';

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

export default function AdminScreen() {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
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

    const formatMoney = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'primary' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
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
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${formErrors.name ? 'border-red-500' : ''
                        }`}
                    value={newProduct.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewProduct({ ...newProduct, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
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
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${formErrors.price ? 'border-red-500' : ''
                        }`}
                        value={newProduct.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewProduct({ ...newProduct, price: e.target.value });
                        if (formErrors.price) setFormErrors({ ...formErrors, price: '' });
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
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${formErrors.stock ? 'border-red-500' : ''
                        }`}
                        value={newProduct.stock}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewProduct({ ...newProduct, stock: e.target.value });
                        if (formErrors.stock) setFormErrors({ ...formErrors, stock: '' });
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
                    className={`w-full p-2 border rounded-lg bg-white ${formErrors.category ? 'border-red-500' : ''
                        }`}
                    value={newProduct.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setNewProduct({ ...newProduct, category: e.target.value as 'Pães' | 'Doces' | 'Salgados' | 'Bolos' | 'Bebidas' });
                        if (formErrors.category) setFormErrors({ ...formErrors, category: '' });
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
                <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    placeholder="Buscar produto por nome..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    />
                </div>
                </div>
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
                    {paginatedProducts.length === 0 ? (
                        <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">
                            Nenhum produto encontrado.
                        </td>
                        </tr>
                    ) : (
                        paginatedProducts.map((product: Product) => (
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
                        ))
                    )}
                    </tbody>
                </table>
                </div>

                {/* Controles de Paginação */}
                <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
                <div>
                    Mostrando{' '}
                    <strong>
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}
                    </strong>{' '}
                    a{' '}
                    <strong>
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </strong>{' '}
                    de <strong>{filteredProducts.length}</strong> produtos
                </div>
                <div className="flex gap-2 items-center">
                    <Button
                    variant="secondary"
                    className="py-1 px-3 text-sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    >
                    Anterior
                    </Button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <Button
                    variant="secondary"
                    className="py-1 px-3 text-sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    >
                    Próximo
                    </Button>
                </div>
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
