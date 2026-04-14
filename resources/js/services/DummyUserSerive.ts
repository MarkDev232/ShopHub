import axios from 'axios';

const DummyUserService = {
    async getProducts() {
        const response = await axios.get('https://dummyjson.com/products');

        return response.data;
    },

    async getProductById(id: number) {
        const response = await axios.get(
            `https://dummyjson.com/products/${id}`,
        );

        return response.data;
    },
};

export default DummyUserService;
