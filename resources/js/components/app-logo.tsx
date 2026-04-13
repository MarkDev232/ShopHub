import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props as any;

    return (
        <>
            <div className="flex size-8 items-center justify-center rounded-md ">
                <img
                    src="/logo.svg" 
                    alt="ShopHub Logo"
                    className="h-10 w-10 "
                />{' '}
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl leading-tight font-bold text-transparent">
                        {name ? name : 'Default App Name'}
                    </span>
                </div>
            </div>
        </>
    );
}
