import { Head, router, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { users } from '@/routes/admin';
import SellerStoreReviewService from '@/services/SellerStoreReviewService';
import UserService from '@/services/UserService';
import type { User } from '@/services/UserService';
import { useToast } from '@/store/features/notification/toast';

export default function SellerReview() {
    const { userId } = usePage().props as unknown as { userId: number };
    const [openPreview, setOpenPreview] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { show } = useToast();
    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const res = await UserService.getUserById(userId);

            setUser(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!user) {
            return;
        }

        try {
            await SellerStoreReviewService.approveSeller(user.id);

            show('Seller approved successfully', 'success');

            router.visit(users());
        } catch (error) {
            show('Failed to approve seller', 'error');
            console.error(error);
        }
    };

    const handleReject = async () => {
        if (!user) {
            return;
        }

        const note = prompt('Reason for rejection?');

        if (!note) {
            return;
        }

        try {
            await SellerStoreReviewService.rejectSeller(user.id, note);

            show('Seller rejected successfully', 'success');

            router.visit(users());
        } catch (error) {
            show('Failed to reject seller', 'error');
            console.error(error);
        }
    };

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    if (!user) {
        return <p className="p-6">No user found.</p>;
    }

    const profile = user.seller_profile;

    return (
        <>
            <Head title="Seller Applications" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-semibold">
                    Seller Application Review
                </h1>

                {/* USER INFO */}
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>

                    <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                        {profile?.status ?? 'No Status'}
                    </span>

                    {/* STORE */}
                    <div className="mt-4 text-sm">
                        <p>
                            <strong>Store:</strong> {profile?.store_name}
                        </p>
                        <p className="text-gray-600">
                            {profile?.store_description}
                        </p>
                    </div>

                    {/* DOCUMENT */}
                    <div className="mt-3">
                        {profile?.business_license ? (
                            <>
                                <Button
                                    onClick={() => setOpenPreview(true)}
                                    className="group flex items-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
                                >
                                    <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    <span>Preview Document</span>
                                </Button>

                                {/* MODAL */}
                                {openPreview && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                        <div className="w-[80%] rounded-lg bg-primary p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h2 className="text-sm font-semibold text-secondary">
                                                    Document Preview
                                                </h2>

                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        setOpenPreview(false)
                                                    }
                                                >
                                                    Close
                                                </Button>
                                            </div>

                                            <iframe
                                                src={profile.business_license}
                                                className="h-150 w-full rounded-md border"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-xs text-gray-400">
                                No document uploaded
                            </p>
                        )}
                    </div>

                    {/* BANK */}
                    <div className="mt-3 text-sm">
                        <p>
                            <strong>Bank:</strong> {profile?.bank_name}
                        </p>
                        <p>{profile?.bank_account_name}</p>
                        <p>{profile?.bank_account_number}</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-3">
                        <Button
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Approve
                        </Button>

                        <Button onClick={handleReject} variant="destructive">
                            Reject
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

SellerReview.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
        {
            title: 'Seller Application Review',
            href: '#',
        },
    ],
};
