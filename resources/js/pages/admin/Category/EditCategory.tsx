import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/services/CategoryService';
import CategoryService from '@/services/CategoryService';

export default function EditCategory() {
    const { categoryId } = usePage().props as unknown as { categoryId: number }; // get category ID from page props

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState<number | null>(null);

    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Fetch existing category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const res = await CategoryService.getCategoryById(categoryId);
                const category = res.data; // <-- pick the actual category object
                setName(category.name);
                setSlug(category.slug);
                setDescription(category.description || '');
                setParentId(category.parent_id || null);
            } catch (err) {
                console.error('Error fetching category', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId]);

    useEffect(() => {
        if (!name) {
            return;
        }

        setSlug(
            name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
        );
    }, [name]);
    
    // Fetch categories without parent_id
    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                setLoading(true);
                const categories = await CategoryService.getCategoriesAll();
                const parents = categories.data.filter((cat) => !cat.parent_id);
                setParentCategories(parents);
            } catch (err) {
                console.error('Error fetching categories', err);
            } finally {
                setLoading(false);
            }
        };
        fetchParentCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await CategoryService.updateCategory(categoryId, {
                name,
                slug,
                description,
                parent_id: parentId,
            });
            router.visit('/admin/categories'); // redirect after success
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Update Category" />
            <div className="mt-6 w-full max-w-3xl rounded-lg p-6 shadow-md">
                <h1 className="mb-2 flex gap-2 text-2xl font-semibold">
                    <button onClick={() => router.visit('/admin/categories')}>
                        <ArrowLeft />
                    </button>
                    Update Category
                </h1>
                <p className="mb-6 text-gray-500">
                    Update the details of the category below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Name
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category Name"
                            disabled={submitting}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Slug
                        </label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="category-slug"
                            disabled={submitting}
                        />
                        {errors.slug && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            disabled={submitting}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Parent Category */}
                    <Select
                        value={parentId !== null ? parentId.toString() : 'null'}
                        onValueChange={(val) =>
                            setParentId(val === 'null' ? null : parseInt(val))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    loading
                                        ? 'Loading...'
                                        : 'Select parent category (optional)'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Parent Categories</SelectLabel>
                                <SelectItem value="null">None</SelectItem>
                                {parentCategories.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={cat.id.toString()}
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
