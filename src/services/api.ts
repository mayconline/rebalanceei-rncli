import axios from 'axios';

const api = axios.create({
  baseURL: 'https://query2.finance.yahoo.com/v1/finance',
});

export default api;
