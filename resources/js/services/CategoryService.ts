import axios from '@/lib/axios';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    children?: Category[];
}

export interface CategoriesResponse {
    sucess: boolean;
    message: string;
    data: Category[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
export interface GetCategoryResponse {
    data: Category;
}

interface FetchCategoriesParams {
    search?: string;
    is_active?: boolean | 'all';
    page?: number;
}



const CategoryService = {

    async getCategoriesAll(): Promise<CategoriesResponse> {
        const response = await axios.get('/api/categories/all');

        return response.data;
    },

    async getCategories(params?: FetchCategoriesParams): Promise<CategoriesResponse> {
        const response = await axios.get('/api/admin/categories', { params });

        return response.data;
    },

    async getCategoryById(id: number): Promise<GetCategoryResponse> {
        const response = await axios.get(`/api/admin/categories/${id}`);

        return response.data;
    },

    async getAllChildCategory(): Promise<CategoriesResponse> {
        const response = await axios.get('/api/categories/child');

        return response.data;
    },

    async createCategory(data: Partial<Category>) {
        return await axios.post('/api/admin/categories', data);
    },

    async updateCategory(id: number, data: Partial<Category>) {
        return await axios.put(`/api/admin/categories/${id}`, data);
    },

    async deleteCategory(id: number) {
        return await axios.delete(`/api/admin/categories/${id}`);
    },
};
export default CategoryService;
