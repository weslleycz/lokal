import axios from "axios";

import * as SecureStore from "expo-secure-store";

export const tokenStorage = {
  async getAccessToken() {
    return await SecureStore.getItemAsync("accessToken");
  },
  async getRefreshToken() {
    return await SecureStore.getItemAsync("refreshToken");
  },
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync("accessToken", token);
  },
  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync("refreshToken", token);
  },
  async removeTokens() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  },
};

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`${error.response.config.url}`, {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error(error.message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config:any) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        await tokenStorage.setAccessToken(data.accessToken);
        await tokenStorage.setRefreshToken(data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        await tokenStorage.removeTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
