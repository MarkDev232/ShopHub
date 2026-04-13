import { Head, router } from '@inertiajs/react';
import { RotateCcw, Check, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/DataTable';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import TableActions from '@/components/ui/TableActions';
import { addProduct, products } from '@/routes/seller';
import ProductService from '@/services/ProductService';
import type { Product } from '@/services/ProductService';

export default function Products() {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState<
        | {
              current_page: number;
              last_page: number;
          }
        | undefined
    >(undefined);


    
    // search and filter states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');
    const isFiltered = search !== '' || statusFilter !== 'all';
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (
        page = 1,
        searchValue: string | undefined = search,
        statusValue: 'all' | true | false | undefined = statusFilter === 'all'
            ? 'all'
            : statusFilter === 'active'
              ? true
              : false,
    ) => {
        setLoading(true);

        try {
            const res = await ProductService.getProductswithpagination({
                page,
                search: searchValue || undefined,
                is_active: statusValue,
            });

            setProductsData(res.data);
            setPagination(res.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        fetchProducts(page);
    };

    const handleApply = () => {
        fetchProducts(
            1,
            search,
            statusFilter === 'all'
                ? 'all'
                : statusFilter === 'active'
                  ? true
                  : false,
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('all');
        fetchProducts(1, '', 'all');
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/products/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return null;
        }

        try {
            await ProductService.deleteProduct(id);

            setProductsData((prev) => prev.filter((prod) => prod.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete category');
        }

        // try {
        //     await ProductService.deleteProduct(id);

        //     setCategoriesData((prev) => prev.filter((cat) => cat.id !== id));
        // } catch (error) {
        //     console.error('Delete failed:', error);
        //     alert('Failed to delete category');
        // }
    };

    const columns = [
        {
            label: 'Product',
            render: (product: Product) => {
                // Get primary image first
                const primaryImage =
                    product.images?.find((img) => img.is_primary) ||
                    product.images?.[0];

                const imageUrl = primaryImage?.image_url || null;

                return (
                    <div className="flex items-center gap-2">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-12 w-12 rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">
                                No Image
                            </div>
                        )}
                        <span className="font-medium text-primary">
                            {product.name}
                        </span>
                    </div>
                );
            },
        },

        {
            label: 'Description',
            render: (product: Product) => (
                <span className="text-sm text-gray-600">
                    {product.description}
                </span>
            ),
        },

        {
            label: 'Category',
            render: (product: Product) => (
                <span className="text-sm text-gray-600">
                    {product.category?.name}
                </span>
            ),
        },
        {
            label: 'Status',
            render: (product: Product) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs ${
                        product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {product.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            label: 'Action',
            className: 'text-left',
            render: (product: Product) => (
                <TableActions
                    onView={() => console.log('View this product', product.id)}
                    onEdit={() => handleEdit(product.id)}
                    onDelete={() => handleDelete(product.id)}
                />
            ),
        },
    ];

    return (
        <>
            <Head title="Products" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Products</h1>
                        <p className="text-sm text-gray-500">
                            Manage your platform products
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search by name or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-75 rounded-md border px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none"
                        />

                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(
                                    value as 'all' | 'active' | 'inactive',
                                )
                            }
                        >
                            <SelectTrigger className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Apply */}
                        <button
                            onClick={handleApply}
                            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                        >
                            <Check className="h-5 w-5" />
                            Apply
                        </button>

                        {/* ✅ Only show Reset if search/filter is active */}
                        {isFiltered && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 rounded-lg bg-gray-200 px-4 py-1 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                <RotateCcw className="h-5 w-5" />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row">
                        <button
                            onClick={() => {
                                router.visit(addProduct());
                            }}
                            className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400/90"
                        >
                            <Plus className="h-5 w-5" />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={productsData}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}
Products.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: products(),
        },
    ],
};
