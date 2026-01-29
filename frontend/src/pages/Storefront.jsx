import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Star, Package, ChevronRight, X } from 'lucide-react'

export default function Storefront() {
    const { slug } = useParams()
    const [store, setStore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cart, setCart] = useState([])

    useEffect(() => {
        fetchStore()
    }, [slug])

    const fetchStore = async () => {
        try {
            const res = await fetch(`/api/stores/public/${slug}`)
            if (res.ok) setStore(await res.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product) => {
        setCart([...cart, product])
        setSelectedProduct(null)
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div></div>
    }

    if (!store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
                    <p className="text-gray-500">This store doesn't exist or has been deactivated.</p>
                </div>
            </div>
        )
    }

    const featured = store.products.filter(p => p.is_featured)
    const regular = store.products.filter(p => !p.is_featured)

    // Template styles
    const templates = {
        modern: {
            bg: 'bg-white',
            header: 'bg-gradient-to-r from-primary-600 to-purple-600',
            card: 'rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg',
            button: 'bg-primary-600 hover:bg-primary-700'
        },
        minimal: {
            bg: 'bg-gray-50',
            header: 'bg-gray-900',
            card: 'rounded-xl border border-gray-200 hover:border-gray-300',
            button: 'bg-gray-900 hover:bg-gray-800'
        },
        bold: {
            bg: 'bg-gradient-to-br from-orange-50 to-pink-50',
            header: 'bg-gradient-to-r from-orange-500 to-pink-500',
            card: 'rounded-3xl shadow-lg border-2 border-transparent hover:border-orange-200',
            button: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'
        }
    }

    const style = templates[store.template] || templates.modern

    return (
        <div className={`min-h-screen ${style.bg}`}>
            {/* Header */}
            <header className={`${style.header} text-white py-16`}>
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{store.name}</h1>
                    {store.description && <p className="text-xl text-white/80 max-w-2xl mx-auto">{store.description}</p>}
                </div>
            </header>

            {/* Cart Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 z-40">
                    <button className={`${style.button} text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3`}>
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-semibold">{cart.length} items</span>
                    </button>
                </div>
            )}

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Featured Products */}
                {featured.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                            <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {featured.map(product => (
                                <div key={product.id} className={`${style.card} bg-white overflow-hidden cursor-pointer transition-all`} onClick={() => setSelectedProduct(product)}>
                                    <div className="flex">
                                        <div className="w-48 h-48 bg-gray-100 flex-shrink-0">
                                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-12 h-12 text-gray-300 m-auto" />}
                                        </div>
                                        <div className="p-6 flex flex-col justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Products */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
                    {store.products.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No products available yet</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {(featured.length > 0 ? regular : store.products).map(product => (
                                <div key={product.id} className={`${style.card} bg-white overflow-hidden cursor-pointer transition-all`} onClick={() => setSelectedProduct(product)}>
                                    <div className="aspect-square bg-gray-100">
                                        {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-12 h-12 text-gray-300 m-auto" />}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                            {!product.in_stock && <span className="text-xs text-red-500">Out of stock</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>Powered by <span className="font-semibold text-primary-600">DropSkill AI</span></p>
                </div>
            </footer>

            {/* Product Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex">
                            <div className="w-1/2 bg-gray-100">
                                {selectedProduct.image_url ? <img src={selectedProduct.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-20 h-20 text-gray-300 m-auto" />}
                            </div>
                            <div className="w-1/2 p-6 flex flex-col">
                                <button onClick={() => setSelectedProduct(null)} className="self-end p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">{selectedProduct.category}</p>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                                    <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                                    <p className="text-3xl font-bold text-gray-900 mb-6">${selectedProduct.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => addToCart(selectedProduct)} disabled={!selectedProduct.in_stock} className={`w-full ${style.button} text-white py-3 rounded-xl font-semibold disabled:opacity-50`}>
                                    {selectedProduct.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
