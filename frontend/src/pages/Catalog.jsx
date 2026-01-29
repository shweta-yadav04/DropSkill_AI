import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import {
    Sparkles, Package, Search, Filter, Plus, Check, ArrowLeft,
    TrendingUp, BarChart3, Settings
} from 'lucide-react'

export default function Catalog() {
    const { user, token } = useAuth()
    const [products, setProducts] = useState([])
    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedStore] = useState(null)
    const [storeProducts, setStoreProducts] = useState(new Set())
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [productsRes, storesRes] = await Promise.all([
                fetch('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/stores/my', { headers: { Authorization: `Bearer ${token}` } })
            ])

            if (productsRes.ok) setProducts(await productsRes.json())
            if (storesRes.ok) {
                const storesData = await storesRes.json()
                setStores(storesData)
                if (storesData.length > 0) {
                    setSelectedStore(storesData[0])
                    fetchStoreProducts(storesData[0].id)
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchStoreProducts = async (storeId) => {
        try {
            const res = await fetch(`/api/stores/${storeId}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setStoreProducts(new Set(data.map(sp => sp.product_id)))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const importProduct = async (productId) => {
        if (!selectedStore) return
        setImporting(productId)
        try {
            const res = await fetch(`/api/stores/${selectedStore.id}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: productId })
            })
            if (res.ok) {
                setStoreProducts(new Set([...storeProducts, productId]))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setImporting(null)
        }
    }

    const categories = [...new Set(products.map(p => p.category))]

    const filteredProducts = products.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
        if (category && p.category !== category) return false
        return true
    })

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
                    <Link to="/catalog" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
                        <Package className="w-5 h-5" /> Product Catalog
                    </Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                            <Settings className="w-5 h-5" /> Admin Panel
                        </Link>
                    )}
                </nav>
            </aside>

            <main className="ml-64 p-8">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
                            <p className="text-gray-600 mt-1">Browse and import products to your store</p>
                        </div>

                        {stores.length > 0 && (
                            <select
                                value={selectedStore?.id || ''}
                                onChange={(e) => {
                                    const store = stores.find(s => s.id === parseInt(e.target.value))
                                    setSelectedStore(store)
                                    if (store) fetchStoreProducts(store.id)
                                }}
                                className="input w-auto"
                            >
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>Import to: {store.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-12"
                                placeholder="Search products..."
                            />
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input w-48"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover">
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}
                                        {product.demand_score >= 0.8 && (
                                            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> Hot
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-xl font-bold text-gray-900">${product.suggested_retail.toFixed(2)}</span>
                                            <span className="text-sm text-green-600">+{((product.suggested_retail - product.base_price) / product.base_price * 100).toFixed(0)}% margin</span>
                                        </div>
                                        {storeProducts.has(product.id) ? (
                                            <button className="w-full py-2 rounded-xl bg-green-50 text-green-600 font-medium flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4" /> Added
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => importProduct(product.id)}
                                                disabled={importing === product.id || !selectedStore}
                                                className="w-full btn-primary py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {importing === product.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                ) : (
                                                    <><Plus className="w-4 h-4" /> Import</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
