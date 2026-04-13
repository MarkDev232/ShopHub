export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string|null;
    is_active: boolean;
    role: string;
    created_at: string;
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