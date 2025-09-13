import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import z from "zod";
import { useSecureStorage } from "./useSecureStorage";

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
  const router = useRouter();

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
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao fazer login",
        text2: "Verifique suas credenciais",
      });
    },
  });

  const logout = async () => {
    await accessTokenStorage.remove();
    await refreshTokenStorage.remove();
    queryClient.clear();
    router.replace("/login");
  };

  const isAuth =
    !accessTokenStorage.loading &&
    !refreshTokenStorage.loading &&
    !!accessTokenStorage.value &&
    !!refreshTokenStorage.value;

  const loading =
    loginMutation.isPending ||
    accessTokenStorage.loading ||
    refreshTokenStorage.loading;

  return {
    accessToken: accessTokenStorage.value,
    refreshToken: refreshTokenStorage.value,
    login: loginMutation.mutateAsync,
    logout,
    error: loginMutation.error,
    isAuth,
    loading,
    loginSchema,
  };
}
