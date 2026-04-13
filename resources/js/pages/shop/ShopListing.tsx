// pages/ShopListing.tsx
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/shop/product-grid';
import ShopSidebar from '@/components/shop/shop-sidebar';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import ProductService from '@/services/ProductService';
import type { Product } from '@/services/ProductService';
export default function ShopListing() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 0,
        total: 0,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            try {
                const res = await ProductService.getProducts({
                    category: selectedCategories.join(','),
                    page,
                });

                setProducts(res.data);
                setMeta(res.meta);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategories, page]);

    return (
        <div className="max-w mx-auto px-6 py-6">
            {/* TOP SECTION (sidebar + products) */}
            <div className="flex gap-5">
                <ShopSidebar
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                />

                <div className="flex-1">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : (
                        <ProductGrid products={products} />
                    )}
                </div>
            </div>

            {/* PAGINATION */}
            {meta.last_page > 0 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent className="flex items-center gap-2">
                            {/* PREVIOUS */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setPage((prev) => Math.max(prev - 1, 1))
                                    }
                                    className={`rounded-md border px-4 py-2 transition ${
                                        meta.current_page === 1
                                            ? 'text-secondary opacity-40'
                                            : 'cursor-pointer border-secondary text-secondary hover:bg-blue-50'
                                    }`}
                                />
                            </PaginationItem>

                            {/* PAGE NUMBERS */}
                            {Array.from(
                                { length: meta.last_page },
                                (_, i) => i + 1,
                            )
                                .slice(
                                    Math.max(0, meta.current_page - 3),
                                    Math.min(
                                        meta.last_page,
                                        meta.current_page + 2,
                                    ),
                                )
                                .map((pageNum) => (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            onClick={() => setPage(pageNum)}
                                            className={`flex h-10 w-10 items-center justify-center rounded-md border font-medium transition ${
                                                pageNum === meta.current_page
                                                    ? 'border-secondary bg-secondary text-primary shadow-md'
                                                    : 'border-secondary text-secondary hover:bg-black hover:text-secondary'
                                            }`}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                            {/* NEXT */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(prev + 1, meta.last_page),
                                        )
                                    }
                                    className={`rounded-md border px-4 py-2 transition ${
                                        meta.current_page === meta.last_page
                                            ? 'text-secondary opacity-40'
                                            : 'cursor-pointer border-secondary text-secondary hover:bg-blue-50'
                                    }`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
