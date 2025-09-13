import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSecureStorage } from "./useSecureStorage";
import { api } from "@/services/api";
import Toast from "react-native-toast-message";
import z from "zod";

interface User {
  id: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const loginSchema = z.object({
  email: z.string().nonempty("O email é obrigatório"),
  password: z.string().nonempty("A senha é obrigatória"),
});

export function useAuth() {
  const accessTokenStorage = useSecureStorage<string>("accessToken");
  const refreshTokenStorage = useSecureStorage<string>("refreshToken");
  const queryClient = useQueryClient();

  const loginMutation = useMutation<
    User,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<LoginResponse>("/auth", {
        email,
        password,
      });
      await accessTokenStorage.save(data.accessToken);
      await refreshTokenStorage.save(data.refreshToken);
      return data.user;
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Erro ao fazer login",
        text2: "Verifique suas credenciais",
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Login realizado!",
        text2: "Bem-vindo de volta 👋",
      });
    },
  });

  const logout = async () => {
    await accessTokenStorage.remove();
    await refreshTokenStorage.remove();
    queryClient.clear();
  };

  return {
    accessToken: accessTokenStorage.value,
    refreshToken: refreshTokenStorage.value,
    login: loginMutation.mutateAsync,
    logout,
    error: loginMutation.error,
    iseAuth: !!accessTokenStorage.value && !!refreshTokenStorage.value,
    loading: loginMutation.isPending,
    loginSchema,
  };
}
