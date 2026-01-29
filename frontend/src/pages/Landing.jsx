import { Link } from 'react-router-dom'
import { Sparkles, Store, TrendingUp, Zap, ArrowRight, CheckCircle, Bot } from 'lucide-react'
import { Package } from "lucide-react"

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A]">

{/* Animated Background Glow */}
<div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] 
        bg-gradient-to-br from-sky-500/30 to-cyan-400/30 
        rounded-full blur-[120px] animate-float-slow" />

    <div className="absolute -left-20 bottom-1/4 w-[300px] h-[300px] 
        bg-gradient-to-br from-cyan-400/20 to-sky-500/20 
        rounded-full blur-[100px] animate-float-slower" />
</div>


            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">DropSkill AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-white/80 hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-white/80 text-sm">AI-Powered Ecommerce Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Launch Your Store <br />
                            <span className="gradient-text">In Minutes, Not Months</span>
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            No suppliers to find. No inventory to manage. Just pick products from our catalog,
                            set your prices, and start selling. AI handles the rest.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/education" className="btn-primary inline-flex items-center gap-2 text-lg">
                                Go Through with Basics <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="#features" className="btn-secondary inline-flex items-center gap-2 text-lg">
                                See How It Works
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                        {[
                            { value: '100+', label: 'Active Sellers' },
                            { value: '10+', label: 'Products Ready' },
                            { value: '< 10 min', label: 'Store Launch Time' },
                            { value: '0%', label: 'Upfront Costs' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
                        <p className="text-xl text-gray-600">Focus on selling. We handle everything else.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Store,
                                title: 'Instant Store Templates',
                                desc: 'Choose from beautiful, conversion-optimized store templates. Go live in minutes.',
                                color: 'bg-blue-500'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Built-in Supplier Network',
                                desc: 'Access our curated catalog of tech & accessories. No supplier hunting needed.',
                                color: 'bg-green-500'
                            },
                            {
                                icon: Bot,
                                title: 'AI-Powered Decisions',
                                desc: 'Let AI recommend products, optimize pricing, and suggest marketing strategies.',
                                color: 'bg-purple-500'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Launch in 3 Simple Steps</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Create Account', desc: 'Sign up in 30 seconds. No credit card required.' },
                            { step: '2', title: 'Pick Products', desc: 'Browse our catalog and import products with one click.' },
                            { step: '3', title: 'Share & Sell', desc: 'Get your unique store link and start sharing.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 gradient-bg">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Ecommerce Journey?</h2>
                    <p className="text-xl text-white/80 mb-8">Join hundreds of sellers already using DropSkill AI.</p>
                    <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                        Create Free Account <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-gray-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">DropSkill AI</span>
                    </div>
                    <p className="text-gray-500">© 2026 DropSkill AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
