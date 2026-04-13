import ShopContent from '@/components/shop/shop-content';
import ShopFooter from '@/components/shop/shop-footer';
import ShopHeader from '@/components/shop/shop-header';
import ShopShell from '@/components/shop/shop-shell';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ShopShell>
            <ShopHeader />

            <ShopContent>
                {/* MAIN */}
                <div className="md:col-span-3">{children}</div>
            </ShopContent>

            <ShopFooter />
        </ShopShell>
    );
}
