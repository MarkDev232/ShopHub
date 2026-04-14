import axios from '@/lib/axios';
import type { Seller_Profile } from '@/types/sellerProfile';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    is_active: boolean;
    role: string;
    created_at: string;

    seller_profile?: Seller_Profile | null;
}

export interface UsersResponse {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface FetchUsersParams {
    search?: string;
    role?: string;
    is_active?: boolean | 'all';
    page?: number;
    seller_status?: string;
}

const UserService = {
    async getUsers(params?: FetchUsersParams): Promise<UsersResponse> {
        const response = await axios.get('/api/admin/users', {
            params,
        });

        return response.data;
    },

    async getUserById(id: number): Promise<User> {
        const response = await axios.get(`/api/admin/user/${id}`);

        return response.data.data; // ✅ FIX HERE
    },

    async deleteUser(id: number) {
        return await axios.delete(`/api/admin/users/${id}`);
    },

    async updateUser(id: number, data: Partial<User>) {
        return await axios.put(`/api/admin/users/${id}`, data);
    },

    async updateStatus(id: number, is_active: boolean) {
        return await axios.patch(`/api/admin/users/${id}/status`, {
            is_active,
        });
    },
};

export default UserService;
