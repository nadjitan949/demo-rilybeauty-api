import axios from 'axios';

// On crée l'instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // Remplace par l'URL de ton backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    // On récupère le token stocké (par exemple dans le localStorage)
    const token = localStorage.getItem('token');
    
    if (token) {
      // On l'ajoute dans les headers Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globalement (ex: token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si on reçoit une 401 (Unauthorized), on peut déconnecter l'utilisateur
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;