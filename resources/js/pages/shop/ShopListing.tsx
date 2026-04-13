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
    PaginationEllipsis,
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
{meta.last_page > 1 && (
    <div className="mt-8 flex justify-center">
        <Pagination>
            <PaginationContent>

                {/* PREVIOUS */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                            meta.current_page === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {/* PAGE NUMBERS */}
                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .slice(
                        Math.max(0, meta.current_page - 3),
                        Math.min(meta.last_page, meta.current_page + 2)
                    )
                    .map((pageNum) => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                isActive={pageNum === meta.current_page}
                                onClick={() => setPage(pageNum)}
                                className="cursor-pointer"
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                {/* ELLIPSIS (simple version) */}
                {meta.last_page > meta.current_page + 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* NEXT */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            setPage((prev) =>
                                Math.min(prev + 1, meta.last_page)
                            )
                        }
                        className={
                            meta.current_page === meta.last_page
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    </div>
)}
        </div>
    );
}
