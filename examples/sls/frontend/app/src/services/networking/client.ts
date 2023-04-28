import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_URL;

const client = axios.create({ baseURL: baseApiUrl });

export default client;
