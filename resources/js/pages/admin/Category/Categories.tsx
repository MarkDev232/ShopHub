import { Head, router } from '@inertiajs/react';
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
import { categories, addCategory } from '@/routes/admin';

import type { Category } from '@/services/CategoryService';
import CategoryService from '@/services/CategoryService';

export default function Categories() {
    const [categoriesData, setCategoriesData] = useState<Category[]>([]);
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
        fetchCategories();
    }, []);

    const fetchCategories = async (
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
            const res = await CategoryService.getCategories({
                page,
                search: searchValue || undefined,
                is_active: statusValue,
            });

            setCategoriesData(res.data);
            setPagination(res.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        fetchCategories(page);
    };

    const handleApply = () => {
        fetchCategories(
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
        fetchCategories(1, '', 'all');
    };

    const handleEdit = (id: number) => {
    router.visit(`/admin/categories/${id}/edit`);
};

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return null;
        }

        try {
            await CategoryService.deleteCategory(id);

            setCategoriesData((prev) => prev.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete category');
        }
    };

    const columns = [
        {
            label: 'Name',
            render: (category: Category) => (
                <span className="font-medium text-primary">
                    {category.name}
                </span>
            ),
        },

        {
            label: 'Description',
            render: (category: Category) => (
                <span className="text-sm text-gray-600">
                    {category.description}
                </span>
            ),
        },
        {
            label: 'Status',
            render: (category: Category) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs ${
                        category.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {category.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            label: 'Action',
            className: 'text-left',
            render: (category: Category) => (
                <TableActions
                    onEdit={() => handleEdit(category.id)}
                    onDelete={() => handleDelete(category.id)}
                />
            ),
        },
    ];

    return (
        <>
            <Head title="Categories" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Categories</h1>
                        <p className="text-sm text-gray-500">
                            Manage your platform categiories
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
                            className="rounded-lg bg-primary px-4 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                        >
                            Apply
                        </button>

                        {/* ✅ Only show Reset if search/filter is active */}
                        {isFiltered && (
                            <button
                                onClick={handleReset}
                                className="rounded-lg bg-gray-200 px-4 py-1 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row">
                        <button
                            onClick={() => {
                                router.visit(addCategory());
                            }}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400/90"
                        >
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={categoriesData}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}

Categories.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: categories(),
        },
    ],
};
