import React from 'react';
import type { Product } from '@/services/ProductService';
import ProductCard from './ProductCard';

interface Props {
    products: Product[];
}

export default function ProductGrid({ products }: Props) {
    return (
        <div className="w-full">
            {/* EMPTY STATE */}
            {products.length === 0 ? (
                <div className="flex w-full items-center justify-center py-20 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            initialWishlisted={product.is_wishlisted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
