// components/shop/shop-footer.tsx

export default function ShopFooter() {
    return (
        <footer className="bg-white border-t mt-10">
            <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Ecommarce
            </div>
        </footer>
    );
}