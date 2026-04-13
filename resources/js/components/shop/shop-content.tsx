// components/shop/shop-content.tsx

export default function ShopContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w mx-auto py-5 grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {children}
        </div>
    );
}