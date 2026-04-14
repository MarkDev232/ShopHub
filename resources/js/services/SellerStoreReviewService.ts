import axios from '@/lib/axios';


const SellerStoreReviewService = {

    async approveSeller(userId: number) {
        return await axios.post(`/api/admin/sellers/${userId}/approve`);
    },

    async rejectSeller(userId: number, note?: string) {
        return await axios.post(`/api/admin/sellers/${userId}/reject`, {
            admin_notes: note,
        });
    },
};

export default SellerStoreReviewService; 