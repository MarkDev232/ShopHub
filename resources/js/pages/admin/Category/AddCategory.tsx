import { Head, router } from '@inertiajs/react';
import {ArrowLeft } from 'lucide-react';
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
import { addCategory, categories } from '@/routes/admin';
import type { Category } from '@/services/CategoryService';
import CategoryService from '@/services/CategoryService';

export default function AddCategory() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState<number | null>(null);

    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    // Auto-generate slug from name
    useEffect(() => {
        setSlug(
            name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-') // replace spaces with dash
                .replace(/[^a-z0-9-]/g, ''), // remove invalid chars
        );
    }, [name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await CategoryService.createCategory({
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
            <Head title="Add Category" />
            <div className="w-full mt-6 max-w-3xl rounded-lg  p-6 shadow-md">
                
                <h1 className=" flex gap-2 mb-2 text-2xl font-semibold">
                 <button onClick={() => router.visit('/admin/categories')}>
                    <ArrowLeft />
                </button>
                Add New Category
                </h1>
                <p className="mb-6 text-gray-500">
                    Fill in the details below to create a new category.
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
                            {submitting ? 'Creating...' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AddCategory.layout = {
    breadcrumbs: [
        {
            title: 'Category',
            href: categories(),
        },
        {
            title: 'Add Product',
            href: addCategory(),
        },
    ],
};