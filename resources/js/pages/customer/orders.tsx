import { Head } from '@inertiajs/react';

import { orders } from '@/routes/customer';

export default function Orders() {
    return (
        <>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                this is the orders page
            </div>
        </>
    );
}

Orders.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Customer',
            href: orders(),
        },
    ],
};
