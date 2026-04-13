import { useEffect, useState } from 'react';
import type { Category } from '@/services/CategoryService';
import CategoryService from '@/services/CategoryService';

interface Props {
    selectedCategories: number[];
    setSelectedCategories: (ids: number[]) => void;
}

export default function ShopSidebar({
    selectedCategories,
    setSelectedCategories,
}: Props) {
    const [tree, setTree] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            const res = await CategoryService.getCategoriesAll();

            if (!isMounted) {
                return;
            }

            setTree(res.data);
            setLoading(false);
        };

        void loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const toggleCategory = (id: number) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const toggleParent = (parent: Category) => {
        const childIds = parent.children?.map((c) => c.id) ?? [];

        const allSelected = childIds.every((id) =>
            selectedCategories.includes(id)
        );

        if (allSelected) {
            setSelectedCategories(
                selectedCategories.filter((id) => !childIds.includes(id))
            );
        } else {
            setSelectedCategories([
                ...new Set([...selectedCategories, ...childIds]),
            ]);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <aside className="rounded-2xl bg-primary p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-secondary">Categories</h2>

            {tree.map((parent) => {
                const children = parent.children ?? [];

                const someSelected = children.some((c) =>
                    selectedCategories.includes(c.id)
                );

                const allSelected = children.every((c) =>
                    selectedCategories.includes(c.id)
                );

                return (
                    <div key={parent.id} className="mb-3">
                        {/* ✅ PARENT */}
                        <label className="flex items-center gap-2 font-medium text-secondary">
                            <input
                                type="checkbox"
                                onChange={() => toggleParent(parent)}
                                checked={children.length > 0 && allSelected}
                                ref={(el) => {
                                    if (!el) {
                                        return;
                                    }

                                    el.indeterminate =
                                        children.length > 0 &&
                                        someSelected &&
                                        !allSelected;
                                }}
                            />
                            {parent.name}
                        </label>

                        {/* ✅ CHILDREN */}
                        {children.length > 0 && (
                            <div className="mt-2 ml-4 space-y-1">
                                {children.map((child) => (
                                    <label
                                        key={child.id}
                                        className="flex items-center gap-2 text-sm text-secondary"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(child.id)}
                                            onChange={() => toggleCategory(child.id)}
                                        />
                                        {child.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}