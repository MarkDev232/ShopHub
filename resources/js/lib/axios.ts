import axios from 'axios';

// Set base URL (your Laravel backend)
axios.defaults.baseURL = 'http://localhost:8000';

// VERY IMPORTANT for Sanctum (cookies)
axios.defaults.withCredentials = true;

// Optional but recommended
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;