import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { products, addProduct } from '@/routes/seller';

import CategoryService from '@/services/CategoryService';
import ProductService from '@/services/ProductService';
import type { ImageItem } from '@/types/Image';

export default function AddProduct() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState(0);
    const [stock_quantity, setStockQuantity] = useState(0);
    const [sku, setSku] = useState('');
    const [weight, setWeight] = useState(0);
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        setSlug(generatedSlug);
    }, [name]);
    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [images]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await CategoryService.getAllChildCategory();
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    // Auto-generate SKU whenever name or category changes
    useEffect(() => {
        if (!name) {
            setSku('');

            return;
        }

        const categoryPart = selectedCategory?.name
            ? selectedCategory.name
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 3)
            : 'GEN';

        const namePart = name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 3);

        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random number

        setSku(`${categoryPart}-${namePart}-${randomPart}`);
    }, [name, selectedCategory]);

    // ✅ Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (categoryId === '') {
            setErrors({ category_id: 'Category is required' });

            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const formData = new FormData();

            // ✅ normal fields
            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('price', String(price));
            formData.append('stock_quantity', String(stock_quantity));
            formData.append('sku', sku);
            formData.append('weight', String(weight));
            formData.append('category_id', String(categoryId));
            formData.append('is_active', '1');

            // ✅ append images properly
            images.forEach((img, index) => {
                formData.append('images[]', img.file); // only the actual File
                formData.append('is_primary[]', img.isPrimary ? '1' : '0'); // send primary info
                formData.append('sort_order[]', String(index)); // send sort order
            });

            await ProductService.createProduct(formData);

            router.visit(products());
        } catch (error: any) {
            console.log(error.response);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Add Product" />

            <div className="mt-6 w-full max-w-3xl rounded-lg p-6 shadow-md">
                {/* Header */}
                <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
                    <button onClick={() => router.visit(products())}>
                        <ArrowLeft />
                    </button>
                    Add New Product
                </h1>

                <p className="mb-6 text-gray-500">
                    Fill in the details below to create a new product.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-sm font-medium">Slug</label>
                        <Input value={slug} disabled />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={submitting}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select
                            value={categoryId.toString()}
                            onValueChange={(val) => setCategoryId(Number(val))}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loading
                                            ? 'Loading...'
                                            : 'Select category'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {categories.map((cat) => (
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
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="text-sm font-medium">Stock</label>
                        <Input
                            type="number"
                            value={stock_quantity}
                            onChange={(e) =>
                                setStockQuantity(Number(e.target.value))
                            }
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="text-sm font-medium">Weight</label>
                        <Input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">SKU</label>
                        <Input value={sku} disabled />
                        {sku && (
                            <p className="mt-1 text-sm text-gray-600">
                                Generated SKU: {sku}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Product Images
                        </label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef} // attach the ref
                            className="hidden"
                            onChange={(e) => {
                                if (!e.target.files) {
                                    return;
                                }

                                const newFiles = Array.from(e.target.files);

                                if (images.length + newFiles.length > 10) {
                                    setErrors({
                                        images: 'Max 10 images allowed',
                                    });

                                    return;
                                }

                                const mapped = newFiles.map((file, index) => ({
                                    file,
                                    preview: URL.createObjectURL(file),
                                    isPrimary:
                                        images.length === 0 && index === 0,
                                }));

                                setImages([...images, ...mapped]);
                            }}
                        />
                        {images.length < 10 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()} // triggers file picker
                                className=" my-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.preview}
                                    className="h-20 w-20 rounded object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImages(
                                            images.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }
                                    className="absolute top-0 right-0 rounded bg-red-500 px-1 text-xs text-white"
                                >
                                    ✕
                                </button>

                                {/* ⭐ PRIMARY */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setImages(
                                            images.map((img, i) => ({
                                                ...img,
                                                isPrimary: i === index,
                                            })),
                                        )
                                    }
                                    className={`mt-1 w-full rounded text-xs ${
                                        img.isPrimary
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    {img.isPrimary ? 'Primary' : 'Set Primary'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.images && (
                        <p className="text-sm text-red-500">{errors.images}</p>
                    )}

                    {/* Submit */}
                    <div className="pt-4">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AddProduct.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: products(),
        },
        {
            title: 'Add Product',
            href: addProduct(),
        },
    ],
};
