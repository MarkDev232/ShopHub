// components/shop/shop-shell.tsx

export default function ShopShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}