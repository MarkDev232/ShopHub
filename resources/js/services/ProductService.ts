import axios from '@/lib/axios';
import type { Image } from '@/types/Image';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    slug: string;
    weight: number;
    sku: string;
    stock_quantity: number;
    is_active: boolean;
    category_id: number;
    created_at: string;
    updated_at: string;
    
    images?: Image[];

    category?: {
        id: number;
        name: string;
    };

    is_wishlisted?: boolean;
}

export interface ProductsResponse {
    data: Product[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
export interface GetProductResponse {
    data: Product;
}

interface FetchProductsParams {
    search?: string;
    is_active?: boolean | 'all';
    page?: number;
    category?: string;
}

interface CreateProductParams {
    id: number;
    name: string;
    description?: string;
    price: number;
    slug: string;
    weight?: number;
    sku: string;
    stock_quantity: number;
    is_active: boolean;
    category_id: number;
    created_at: string;
    updated_at: string;

    images?: Image[];

    category?: {
        id: number;
        name: string;
    };
}

const ProductService = {
    async getProductsNoPagination(): Promise<GetProductResponse> {
        const response = await axios.get('/api/seller/products');

        return response.data;
    },

    async getProducts(params?: FetchProductsParams): Promise<ProductsResponse> {
        const response = await axios.get('/api/products', { params });

        return response.data;
    },

     async getProductswithpagination(params?: FetchProductsParams): Promise<ProductsResponse> {
        const response = await axios.get('/api/seller/products', { params });

        return response.data;
    },

    async getProductById(id: number): Promise<GetProductResponse> {
        const response = await axios.get(`/api/seller/products/${id}`);

        return response.data;
    },

    async createProduct(
        data: FormData | Partial<CreateProductParams>,
    ): Promise<GetProductResponse> {
        const response = await axios.post('/api/seller/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    async deleteProduct(id: number): Promise<void> {
        await axios.delete(`/api/seller/products/${id}`);
    },
};
export default ProductService;
