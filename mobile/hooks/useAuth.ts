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

interface ForgotPasswordDTO {
  email: string;
}

interface ResetPasswordDTO {
  code: string;
  newPassword: string;
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

  const loginMutation = useMutation<User, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      console.log(4233434343434);
      
      const { data } = await api.post<LoginResponse>("/auth", { email, password });
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

  const forgotPasswordMutation = useMutation<void, Error, ForgotPasswordDTO>({
    mutationFn: async ({ email }) => {
      await api.post("/auth/forgot-password", { email });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Email enviado",
        text2: "Se o email estiver cadastrado, você receberá um código para redefinir a senha.",
      });
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message || "Ocorreu um erro ao enviar o código",
      });
    },
  });

  const resetPasswordMutation = useMutation<void, Error, ResetPasswordDTO>({
    mutationFn: async ({ code, newPassword }) => {
      await api.post("/auth/reset-password", { code, newPassword });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Senha redefinida",
        text2: "Sua senha foi atualizada com sucesso.",
      });
      router.replace("/login");
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message || "Código inválido ou expirado",
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
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    accessTokenStorage.loading ||
    refreshTokenStorage.loading;

  return {
    accessToken: accessTokenStorage.value,
    refreshToken: refreshTokenStorage.value,
    login: loginMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout,
    error: loginMutation.error,
    isAuth,
    loading,
    loginSchema,
  };
}
