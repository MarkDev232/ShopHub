import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import { shop } from '@/routes';
export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Featured categories
    const categories = [
        { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-cyan-500' },
        { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-rose-500' },
        {
            name: 'Home & Living',
            icon: '🏠',
            color: 'from-emerald-500 to-teal-500',
        },
        { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-red-500' },
        { name: 'Books', icon: '📚', color: 'from-purple-500 to-indigo-500' },
        { name: 'Toys', icon: '🎮', color: 'from-yellow-500 to-amber-500' },
    ];

    // Featured products (placeholder)
    const featuredProducts = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: '$99.99',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: '$199.99',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        },
        {
            id: 3,
            name: 'Premium Backpack',
            price: '$79.99',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        },
        {
            id: 4,
            name: 'Sunglasses',
            price: '$149.99',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
        },
    ];

    return (
        <>
            <Head title="Welcome - E-Commerce">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                {/* Modern Navbar */}
                <nav
                    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                        scrolled
                            ? 'bg-white/80 shadow-lg backdrop-blur-lg dark:bg-gray-900/80'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={dashboard()}
                                    prefetch
                                    className="flex items-center space-x-2"
                                >
                                    <AppLogo />
                                </Link>
                            </div>

                            <div className="flex flex-1 justify-center">
                                <Link
                                    href={shop()}
                                    className="rounded-full px-6 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Shop
                                </Link>
                            </div>

                            {/* Search Bar
                            <div className="hidden flex-1 max-w-md mx-8 lg:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div> */}

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-full px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                                            >
                                                Sign up
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-5"></div>

                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Shop Smarter,
                                </span>
                                <br />
                                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Live Better
                                </span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Discover millions of products at unbeatable
                                prices. Fast shipping, secure payments, and 24/7
                                customer support.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                                >
                                    Start Shopping
                                    <svg
                                        className="ml-2 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </Link>
                                <button className="inline-flex items-center rounded-full border-2 border-gray-300 bg-white/50 px-8 py-3 text-lg font-semibold text-gray-700 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
                                    Watch Demo
                                    <svg
                                        className="ml-2 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Animated Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="h-10 w-6 rounded-full border-2 border-gray-400">
                            <div className="mx-auto mt-2 h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Shop by Category
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Find exactly what you're looking for
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className="group cursor-pointer rounded-2xl bg-white p-6 text-center transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800"
                            >
                                <div
                                    className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r ${category.color} text-3xl transition-all group-hover:scale-110`}
                                >
                                    {category.icon}
                                </div>
                                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                                    {category.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="bg-gray-50 py-16 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Featured Products
                            </h2>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Hand-picked just for you
                            </p>
                        </div>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-900"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 opacity-0 transition-all group-hover:opacity-100">
                                            Quick View
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {product.name}
                                        </h3>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {product.price}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">
                                                    ★
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full rounded-full bg-linear-to-r from-blue-600 to-purple-600 py-2 text-sm font-semibold text-white transition-all hover:scale-105">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center rounded-full border-2 border-blue-600 px-6 py-2 font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                            >
                                View All Products
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <svg
                                    className="h-8 w-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Fast Delivery
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Free shipping on orders over $50
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg
                                    className="h-8 w-8 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Secure Payments
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                100% secure transactions
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                                <svg
                                    className="h-8 w-8 text-pink-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 5.636L9.172 14.828m0 0l-3.536-3.535m3.536 3.535l3.535-3.535m-9.192 9.192a9 9 0 1112.728 0 9 9 0 01-12.728 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                24/7 Support
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                We're here to help anytime
                            </p>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="bg-linear-to-r from-blue-600 to-purple-600 py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white">
                            Stay in the Loop
                        </h2>
                        <p className="mt-4 text-blue-100">
                            Get exclusive deals and early access to sales
                        </p>
                        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-full border-2 border-gray-300 px-6 py-3 text-primary focus:ring-2 focus:ring-white focus:outline-none"
                            />
                            <button className="rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition-all hover:scale-105 hover:shadow-lg">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-12 text-gray-400">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="/logo.svg"
                                        alt="ShopHub Logo"
                                        className="
                                         object-contain"
                                    />{' '}
                                    <span className="text-xl font-bold text-white">
                                        ShopHub
                                    </span>
                                </div>
                                <p className="mt-4 text-sm">
                                    Your one-stop shop for everything you need.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    Shop
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li>
                                        <Link
                                            href="/products"
                                            className="hover:text-white"
                                        >
                                            All Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/categories"
                                            className="hover:text-white"
                                        >
                                            Categories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/deals"
                                            className="hover:text-white"
                                        >
                                            Deals
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    Support
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li>
                                        <Link
                                            href="/help"
                                            className="hover:text-white"
                                        >
                                            Help Center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/returns"
                                            className="hover:text-white"
                                        >
                                            Returns
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/contact"
                                            className="hover:text-white"
                                        >
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    Follow Us
                                </h3>
                                <div className="mt-4 flex space-x-4">
                                    <a href="#" className="hover:text-white">
                                        Facebook
                                    </a>
                                    <a href="#" className="hover:text-white">
                                        Twitter
                                    </a>
                                    <a href="#" className="hover:text-white">
                                        Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
                            <p>&copy; 2024 ShopHub. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
