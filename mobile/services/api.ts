import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
});


api.interceptors.request.use(
  (config) => {
    console.log(`[API] Enviando ${config.method?.toUpperCase()} para ${config.url}`, config.data || "");
    return config;
  },
  (error) => {
    console.error("[API] Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Resposta recebida de ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API] Erro na resposta de ${error.response.config.url}`, {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("[API] Nenhuma resposta recebida", error.request);
    } else {
      // Algum outro erro
      console.error("[API] Erro ao configurar a requisição:", error.message);
    }
    return Promise.reject(error);
  }
);
