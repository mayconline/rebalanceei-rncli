import axios from 'axios';
import Config from '../config/envs';

const api = axios.create({
  baseURL: Config?.suggestionsApiUrl,
});

export default api;
