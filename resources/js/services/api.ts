// services/api.ts
import { router } from '@inertiajs/react';

class ApiService {
    async getUsers(params: Record<string, any> = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            router.get('/api/admin/users', params, {
                preserveState: false,
                preserveScroll: true,
                onSuccess: (page) => {
                    resolve(page.props);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    }

    async updateUser(id: number, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            router.put(`/api/admin/users/${id}`, data, {
                onSuccess: (page) => {
                    resolve(page.props);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    }

    async deleteUser(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            router.delete(`/api/admin/users/${id}`, {
                onSuccess: (page) => {
                    resolve(page.props);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    }

    async updateUserStatus(id: number, is_active: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            router.patch(`/api/admin/users/${id}/status`, { is_active }, {
                onSuccess: (page) => {
                    resolve(page.props);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    }
}

export const api = new ApiService();