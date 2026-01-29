import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
    Sparkles, Plus, Store, Package, TrendingUp, Bot, LogOut,
    ExternalLink, BarChart3, ShoppingBag, Settings
} from 'lucide-react'

export default function Dashboard() {
    const { user, token, logout } = useAuth()
    const [stores, setStores] = useState([])
    const [showNewStore, setShowNewStore] = useState(false)
    const [newStoreName, setNewStoreName] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchStores()
    }, [])

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/stores/my', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setStores(await res.json())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const createStore = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newStoreName })
            })
            if (res.ok) {
                const store = await res.json()
                setStores([store, ...stores])
                setNewStoreName('')
                setShowNewStore(false)
            }
        } catch (err) {
            console.error(err)
        }
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
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
                        <BarChart3 className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/catalog" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                        <Package className="w-5 h-5" /> Product Catalog
                    </Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                            <Settings className="w-5 h-5" /> Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">{user?.email?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name || 'Seller'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center gap-2 justify-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0] || 'Seller'}!</h1>
                            <p className="text-gray-600 mt-1">Manage your stores and products</p>
                        </div>
                        <button onClick={() => setShowNewStore(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-5 h-5" /> New Store
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {[
                            { icon: Store, label: 'Total Stores', value: stores.length, color: 'bg-blue-500' },
                            { icon: Package, label: 'Products Listed', value: '—', color: 'bg-green-500' },
                            { icon: ShoppingBag, label: 'Total Orders', value: '—', color: 'bg-purple-500' },
                            { icon: TrendingUp, label: 'Revenue', value: '$0', color: 'bg-orange-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stores */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Your Stores</h2>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto"></div>
                            </div>
                        ) : stores.length === 0 ? (
                            <div className="p-12 text-center">
                                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores yet</h3>
                                <p className="text-gray-500 mb-6">Create your first store to start selling</p>
                                <button onClick={() => setShowNewStore(true)} className="btn-primary">
                                    Create Store
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {stores.map(store => (
                                    <div key={store.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                                {store.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                                                <p className="text-sm text-gray-500">Template: {store.template}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={`/s/${store.slug}`}
                                                target="_blank"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" /> View Store
                                            </a>
                                            <Link
                                                to={`/store/${store.id}`}
                                                className="btn-primary py-2"
                                            >
                                                Manage
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* New Store Modal */}
            {showNewStore && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewStore(false)}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Store</h2>
                        <form onSubmit={createStore}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                <input
                                    type="text"
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                    className="input"
                                    placeholder="My Awesome Store"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowNewStore(false)} className="flex-1 btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Create Store
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
