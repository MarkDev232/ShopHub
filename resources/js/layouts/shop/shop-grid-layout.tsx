import { Link } from '@inertiajs/react';
import { ShoppingCart, User } from 'lucide-react';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

export default function ShopGridLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* LOGO */}
                    <Link
                        href="/"
                        className="text-xl font-bold text-indigo-600"
                    >
                        Ecommarce
                    </Link>

                    {/* NAV LINKS */}
                    <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
                        <Link href="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                        <Link href="/shop" className="hover:text-indigo-600">
                            Shop
                        </Link>
                    </nav>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
                        </Link>

                        <Link href="/account">
                            <User className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ================= BODY ================= */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-4">
                {/* ================= SIDEBAR ================= */}
                <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm">
                    <h2 className="mb-4 font-semibold text-gray-800">
                        Categories
                    </h2>

                    {/* SAMPLE CATEGORY LIST */}
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <button className="hover:text-indigo-600">
                                All Products
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-indigo-600">
                                Electronics
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-indigo-600">
                                Clothing
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-indigo-600">
                                Accessories
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="md:col-span-3">{children}</main>
            </div>
        </div>
    );
}
