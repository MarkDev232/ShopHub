// components/shop/shop-header.tsx

import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { dashboard } from '@/routes';

export default function ShopHeader() {
    const { auth } = usePage().props as any;

    const user = auth?.user; // ✅ define first

    const isAdmin = user?.role === 'admin';
    const isGuest = !user;

    return (
        <header className="sticky top-0 z-50 border-b bg-primary">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* LOGO */}
                <div className="flex items-center space-x-2">
                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>
                </div>

                {/* NAV */}
                <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
                    <Link href="/">Home</Link>
                    <Link href="/shop">Shop</Link>
                </nav>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">
                    {isGuest || isAdmin ? (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg border px-4 py-2 text-sm text-primary-foreground"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-primary"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* CART */}
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
                            </Link>

                            {/* ACCOUNT */}
                            <Link href={dashboard()}>
                                <User className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
