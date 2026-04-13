// utils/categoryTree.ts
import type { Category } from '@/services/CategoryService';

export function buildCategoryTree(categories: Category[]) {
    const map: Record<number, Category & { children: Category[] }> = {};
    const roots: (Category & { children: Category[] })[] = [];

    categories.forEach((cat) => {
        map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
        if (cat.parent_id) {
            map[cat.parent_id]?.children.push(map[cat.id]);
        } else {
            roots.push(map[cat.id]);
        }
    });

    return roots;
}