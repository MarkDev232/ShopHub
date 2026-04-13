import axios from '@/lib/axios';

const WishlistService = {
    async toggleWishlist(productId: number) {
        const response = await axios.post('/api/customer/wishlist/toggle', {
            product_id: productId,
        });

        return response.data as {
            wishlisted: boolean;
            message: string;
        };
    },

    async getWishlist() {
        const response = await axios.get('/api/customer/wishlist');

        return response.data;
    },

    async isWishlisted(productId: number) {
        const response = await axios.get(`/api/customer/wishlist/check/${productId}`);

        return response.data as {
            wishlisted: boolean;
        };
    },
};

export default WishlistService;