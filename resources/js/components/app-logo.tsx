// import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    // const { name } = usePage().props as any;

    return (
        <>
            <div className="flex size-8 items-center justify-center rounded-md">
                <img
                    src="/logo.svg"
                    alt="ShopHub Logo"
                    className="h-10 w-10"
                />{' '}
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate text-xl leading-tight font-bold">
                    <span className="text-xl font-bold">
                        <span className="text-white ">Shop</span>
                        <span className="text-orange-500">Hub</span>
                    </span>
                </span>
            </div>
        </>
    );
}
