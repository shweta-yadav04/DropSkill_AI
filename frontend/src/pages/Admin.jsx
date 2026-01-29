import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import {
    Sparkles, Package, Users, Store, ShoppingBag, TrendingUp,
    Plus, AlertTriangle, BarChart3, Settings
} from 'lucide-react'

export default function Admin() {
    const { user, token } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [newProduct, setNewProduct] = useState({
        sku: '', name: '', description: '', category: 'Accessories',
        cost_price: '', base_price: '', suggested_retail: '', stock_quantity: '', image_url: ''
    })

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            const [analyticsRes, productsRes] = await Promise.all([
                fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
            ])
            if (analyticsRes.ok) setAnalytics(await analyticsRes.json())
            if (productsRes.ok) setProducts(await productsRes.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const addProduct = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...newProduct,
                    cost_price: parseFloat(newProduct.cost_price),
                    base_price: parseFloat(newProduct.base_price),
                    suggested_retail: parseFloat(newProduct.suggested_retail),
                    stock_quantity: parseInt(newProduct.stock_quantity),
                    tags: [], specifications: {}
                })
            })
            if (res.ok) {
                const product = await res.json()
                setProducts([product, ...products])
                setShowAddProduct(false)
                setNewProduct({ sku: '', name: '', description: '', category: 'Accessories', cost_price: '', base_price: '', suggested_retail: '', stock_quantity: '', image_url: '' })
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500">Admin privileges required</p>
                    <Link to="/dashboard" className="btn-primary mt-6 inline-block">Go to Dashboard</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">DropSkill AI</span>
                    </Link>
                </div>
                <nav className="px-4 space-y-1">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                        <BarChart3 className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/catalog" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                        <Package className="w-5 h-5" /> Product Catalog
                    </Link>
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
                        <Settings className="w-5 h-5" /> Admin Panel
                    </Link>
                </nav>
            </aside>

            <main className="ml-64 p-8">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-600 mt-1">Manage inventory and platform settings</p>
                        </div>
                        <button onClick={() => setShowAddProduct(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Add Product
                        </button>
                    </div>

                    {/* Stats */}
                    {analytics && (
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            {[
                                { icon: Users, label: 'Total Users', value: analytics.total_users, color: 'bg-blue-500' },
                                { icon: Store, label: 'Total Stores', value: analytics.total_stores, color: 'bg-green-500' },
                                { icon: Package, label: 'Products', value: analytics.total_products, color: 'bg-purple-500' },
                                { icon: ShoppingBag, label: 'Orders', value: analytics.total_orders, color: 'bg-orange-500' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Low Stock Alert */}
                    {analytics?.low_stock_products?.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                <h2 className="font-bold text-yellow-800">Low Stock Alert</h2>
                            </div>
                            <div className="flex gap-4 overflow-x-auto">
                                {analytics.low_stock_products.map(p => (
                                    <div key={p.id} className="bg-white rounded-xl p-4 min-w-48 border border-yellow-200">
                                        <p className="font-medium text-gray-900 truncate">{p.name}</p>
                                        <p className="text-sm text-yellow-600 font-semibold">{p.stock} units left</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-2xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900">Inventory ({products.length} products)</h2>
                        </div>
                        {loading ? (
                            <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto"></div></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">SKU</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cost</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Retail</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stock</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Demand</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.slice(0, 20).map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                            {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-300 m-2.5" />}
                                                        </div>
                                                        <span className="font-medium text-gray-900 truncate max-w-48">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{p.sku}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">${p.cost_price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${p.suggested_retail.toFixed(2)}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock_quantity < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{p.stock_quantity}</span></td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${p.demand_score * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-xs text-gray-500">{(p.demand_score * 100).toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddProduct(false)}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
                        <form onSubmit={addProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU</label><input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="input" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="input"><option>Audio</option><option>Chargers</option><option>Accessories</option><option>Cases</option><option>Cables</option><option>Peripherals</option></select></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label><input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="input" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="input" rows={2} /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label><input type="number" step="0.01" value={newProduct.cost_price} onChange={(e) => setNewProduct({ ...newProduct, cost_price: e.target.value })} className="input" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label><input type="number" step="0.01" value={newProduct.base_price} onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })} className="input" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label><input type="number" step="0.01" value={newProduct.suggested_retail} onChange={(e) => setNewProduct({ ...newProduct, suggested_retail: e.target.value })} className="input" required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label><input type="number" value={newProduct.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} className="input" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="url" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className="input" /></div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
