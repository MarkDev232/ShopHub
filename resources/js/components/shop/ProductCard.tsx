import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/services/ProductService';
import WishlistService from '@/services/WishlistService';
interface Props {
    product: Product;
    initialWishlisted?: boolean;
    onToggleWishlist?: (product: Product, isWishlisted: boolean) => void;
}

export default function ProductCard({
    product,
    initialWishlisted = false,
    onToggleWishlist,
}: Props) {
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);


    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !isWishlisted;

        // optimistic UI update (instant feedback)
        setIsWishlisted(newState);

        try {
            const res = await WishlistService.toggleWishlist(product.id);

            // sync with backend response (source of truth)
            setIsWishlisted(res.wishlisted);

            onToggleWishlist?.(product, res.wishlisted);
        } catch (error) {
            console.error(error);

            // rollback UI if failed
            setIsWishlisted(isWishlisted);
        }
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-primary shadow-sm transition hover:shadow-xl">
            {' '}
            {/* ❤️ HEART BUTTON */}
            <button
                onClick={toggleWishlist}
                className="bg-none/80 absolute top-3 right-3 z-10 rounded-full p-2 shadow-sm transition hover:scale-110"
            >
                <Heart
                    size={18}
                    className={`transition ${
                        isWishlisted
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                    }`}
                />
            </button>
            {/* IMAGE */}
            <div className="h-40 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            {/* CONTENT */}
            <div className="flex flex-col gap-2 p-4">
                <h2 className="line-clamp-1 font-semibold text-gray-800">
                    {product.name}
                </h2>
                {product.sku && product.sku !== null ? (
                    <Badge
                        variant="outline"
                        className="border-gray-400 text-gray-400"
                    >
                        {product.sku}
                    </Badge>
                ) : (
                    ''
                )}
                {/* PRICE + STOCK */}
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                        ₱{product.price}
                    </span>

                    <span className="text-xs text-gray-400">
                        Stock: {product.stock_quantity}
                    </span>
                </div>
                {/* BUTTON */}
                <Link
                    href={`/products/${product.slug}`}
                    className="mt-3 rounded-xl bg-indigo-600 py-2 text-center text-sm text-white transition hover:bg-indigo-700"
                >
                    View Product
                </Link>
            </div>
        </div>
    );
}
