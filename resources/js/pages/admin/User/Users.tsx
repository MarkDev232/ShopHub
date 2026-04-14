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
import { users } from '@/routes/admin';

import type { User } from '@/services/UserService';
import UserService from '@/services/UserService';

const statusLabel = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
};

export default function Users() {
    const [usersData, setUsersData] = useState<User[]>([]);
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
    const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'customer'>(
        'all',
    );
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const needsReview = (user: User) => user.role === 'seller';
    const fetchUsers = async (page = 1) => {
        setLoading(true);

        try {
            const res = await UserService.getUsers({
                page,
                search: search || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                is_active:
                    statusFilter === 'all'
                        ? 'all'
                        : statusFilter === 'active'
                          ? true
                          : false,
            });

            setUsersData(res.data);
            setPagination(res.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        fetchUsers(page);
    };

    const handleSearch = () => {
        fetchUsers(1); // reset to first page when searching
    };

    const handleFilterChange = () => {
        fetchUsers(1); // reset to first page when filtering
    };

    const columns = [
        {
            label: 'Name',
            render: (user: User) => (
                <span className="font-medium text-primary">{user.name}</span>
            ),
        },
        {
            label: 'Role',
            render: (user: User) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs ${
                        user.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : user.role === 'seller'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                    } capitalize`}
                >
                    {user.role}
                </span>
            ),
        },
        {
            label: 'Status',
            render: (user: User) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs ${
                        user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            label: 'Business Status',
            render: (user: User) => {
                if (user.role !== 'seller') {
                    return (
                        <div className="flex">
                            <span className="text-xs text-gray-400">N/A</span>
                        </div>
                    );
                }

                const status = user.seller_profile?.status;

                if (!status) {
                    return (
                        <div className="flex">
                            <span className="text-xs text-gray-400">—</span>
                        </div>
                    );
                }

                return (
                    <div className="justify flex">
                        <span
                            className={`rounded-full px-2 py-1 text-xs ${
                                status === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : status === 'rejected'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {statusLabel[status as keyof typeof statusLabel] ??
                                status}
                        </span>
                    </div>
                );
            },
        },
        {
            label: 'Action',
            className: 'text-left',
            render: (user: User) =>
                needsReview(user) ? (
                    <TableActions
                        onReview={() =>
                            router.visit(`/admin/seller/${user.id}/review`)
                        }
                        onEdit={() => console.log('Edit', user.id)}
                        onDelete={() => console.log('Delete', user.id)}
                    />
                ) : (
                    <TableActions
                        onEdit={() => console.log('Edit', user.id)}
                        onDelete={() => console.log('Delete', user.id)}
                    />
                ),
        },
    ];

    return (
        <>
            <Head title="Users" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <p className="text-sm text-gray-500">
                            Manage your platform users
                        </p>
                    </div>
                    {/* Search & Filters */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-75 rounded-md border px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none"
                        />

                        <Select
                            value={roleFilter}
                            onValueChange={(value) =>
                                setRoleFilter(value as any)
                            }
                        >
                            <SelectTrigger className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="seller">
                                        Seller
                                    </SelectItem>
                                    <SelectItem value="customer">
                                        Customer
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as any)
                            }
                        >
                            <SelectTrigger className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
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

                        <button
                            onClick={() => {
                                handleSearch();
                                handleFilterChange();
                            }}
                            className="rounded-lg bg-primary px-4 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                        >
                            Apply
                        </button>
                    </div>

                    <button
                        onClick={() => router.visit('/admin/sellers/review')}
                        className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                        Review Applications →
                    </button>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={usersData}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
    ],
};
