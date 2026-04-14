import React, { useEffect, useState } from 'react';
import DummyUserService from '@/services/DummyUserSerive';

export default function SingleProduct() {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const data = await DummyUserService.getProductById(1);
            setProduct(data);
            setSelectedImage(data.thumbnail); // default image
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!product) {
        return <div className="p-6">No product found</div>;
    }

    return (
        <div className="mx-auto w-full max-w-6xl p-6">
            <div className="grid grid-cols-2 gap-10">
                {/* LEFT: IMAGE GALLERY */}
                <div>
                    {/* Main Image */}
                    <img
                        src={selectedImage}
                        alt={product.title}
                        className="h-100 w-full rounded-xl border object-cover"
                    />

                    {/* Thumbnails */}
                    <div className="mt-4 flex gap-2">
                        {product.images.map((img: string, index: number) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setSelectedImage(img)}
                                className={`h-20 w-20 cursor-pointer rounded border object-cover ${
                                    selectedImage === img
                                        ? 'border-blue-500'
                                        : 'border-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: PRODUCT DETAILS */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary">
                        {product.title}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Brand: {product.brand}
                    </p>

                    {/* Rating */}
                    <p className="mt-2 text-yellow-500">
                        ⭐ {product.rating} / 5
                    </p>

                    {/* Price */}
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-2xl font-bold text-secondary">
                            ₱ {product.price}
                        </span>
                        <span className="text-sm text-red-500">
                            -{product.discountPercentage}%
                        </span>
                    </div>

                    {/* Stock */}
                    <p
                        className={`mt-2 text-sm ${
                            product.stock > 0
                                ? 'text-green-600'
                                : 'text-red-500'
                        }`}
                    >
                        {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : 'Out of Stock'}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-gray-600">{product.description}</p>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button className="rounded-lg bg-blue-600 px-6 py-2 text-white">
                            Add to Cart
                        </button>
                        <button className="rounded-lg border px-6 py-2 text-secondary hover:bg-amber-500 hover:text-primary hover:border-amber-500">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="mt-12">
                <h2 className="mb-4 text-xl font-bold text-secondary ">Customer Reviews</h2>

                <div className="space-y-4">
                    {product.reviews.map((review: any, index: number) => (
                        <div key={index} className="rounded-lg border p-4">
                            <p className="font-semibold text-secondary">
                                {review.reviewerName}
                            </p>
                            <p className="text-yellow-500">
                                ⭐ {review.rating}
                            </p>
                            <p className="mt-1 text-gray-600">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
