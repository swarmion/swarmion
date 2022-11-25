import axios from 'axios';

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

const client = axios.create({ baseURL: baseApiUrl });

export default client;
