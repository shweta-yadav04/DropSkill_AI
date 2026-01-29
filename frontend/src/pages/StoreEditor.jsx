import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../App'
import {
    Sparkles, ArrowLeft, Trash2, Star, ExternalLink, Palette,
    Package, Bot, Send, X, MessageSquare
} from 'lucide-react'

export default function StoreEditor() {
    const { storeId } = useParams()
    const { token } = useAuth()
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAI, setShowAI] = useState(false)
    const [aiMessage, setAiMessage] = useState('')
    const [aiResponse, setAiResponse] = useState('')
    const [aiLoading, setAiLoading] = useState(false)

    useEffect(() => {
        fetchStore()
        fetchProducts()
    }, [storeId])

    const fetchStore = async () => {
        try {
            const res = await fetch(`/api/stores/${storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) setStore(await res.json())
        } catch (err) {
            console.error(err)
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await fetch(`/api/stores/${storeId}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) setProducts(await res.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateStore = async (updates) => {
        try {
            const res = await fetch(`/api/stores/${storeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(updates)
            })
            if (res.ok) setStore(await res.json())
        } catch (err) {
            console.error(err)
        }
    }

    const removeProduct = async (productId) => {
        try {
            await fetch(`/api/stores/${storeId}/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(products.filter(p => p.id !== productId))
        } catch (err) {
            console.error(err)
        }
    }

    const toggleFeatured = async (product) => {
        try {
            const res = await fetch(`/api/stores/${storeId}/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ is_featured: !product.is_featured })
            })
            if (res.ok) {
                const updated = await res.json()
                setProducts(products.map(p => p.id === product.id ? updated : p))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const askAI = async () => {
        if (!aiMessage.trim()) return
        setAiLoading(true)
        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ store_id: parseInt(storeId), message: aiMessage })
            })
            if (res.ok) {
                const data = await res.json()
                setAiResponse(data.response)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setAiLoading(false)
        }
    }

    if (!store) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div></div>

    const templates = [
        { id: 'modern', name: 'Modern', desc: 'Clean and professional' },
        { id: 'minimal', name: 'Minimal', desc: 'Simple and elegant' },
        { id: 'bold', name: 'Bold', desc: 'Vibrant and colorful' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                            <p className="text-sm text-gray-500">Store Editor</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowAI(true)} className="btn-secondary flex items-center gap-2">
                            <Bot className="w-5 h-5" /> AI Assistant
                        </button>
                        <a href={`/s/${store.slug}`} target="_blank" className="btn-primary flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" /> View Store
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Settings */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Store Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    <input type="text" value={store.name} onChange={(e) => updateStore({ name: e.target.value })} className="input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea value={store.description || ''} onChange={(e) => updateStore({ description: e.target.value })} className="input" rows={3} placeholder="Tell customers about your store..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm">
                                        <span className="text-gray-500">/s/</span>
                                        <span className="font-mono text-primary-600">{store.slug}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-4">Template</h2>
                            <div className="space-y-3">
                                {templates.map(t => (
                                    <button key={t.id} onClick={() => updateStore({ template: t.id })} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${store.template === t.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <p className="font-medium text-gray-900">{t.name}</p>
                                        <p className="text-sm text-gray-500">{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900">Products ({products.length})</h2>
                                <Link to="/catalog" className="text-primary-600 hover:text-primary-700 font-medium text-sm">+ Add More</Link>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto"></div></div>
                            ) : products.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No products yet</p>
                                    <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {products.map(item => (
                                        <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                {item.product.image_url ? <img src={item.product.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-gray-300 m-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{item.custom_name || item.product.name}</h3>
                                                <p className="text-sm text-gray-500">${(item.custom_price || item.product.suggested_retail).toFixed(2)}</p>
                                            </div>
                                            <button onClick={() => toggleFeatured(item)} className={`p-2 rounded-lg ${item.is_featured ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-100'}`}>
                                                <Star className="w-5 h-5" fill={item.is_featured ? 'currentColor' : 'none'} />
                                            </button>
                                            <button onClick={() => removeProduct(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* AI Chat */}
            {showAI && (
                <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary-600" />
                            <span className="font-semibold">AI Assistant</span>
                        </div>
                        <button onClick={() => setShowAI(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto">
                        {aiResponse ? (
                            <div className="bg-primary-50 rounded-xl p-4 text-sm">{aiResponse}</div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm mt-8">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                Ask me about products, pricing, or marketing!
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex gap-2">
                            <input type="text" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askAI()} className="input flex-1" placeholder="Ask anything..." />
                            <button onClick={askAI} disabled={aiLoading} className="btn-primary px-4">
                                {aiLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
