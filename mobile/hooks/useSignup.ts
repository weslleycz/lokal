import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import z from "zod";

export const signupSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  phone: z.string().nonempty("O telefone é obrigatório"),
});

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export function useSignup() {
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await api.post("/user", data);
      return response.data;
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Erro no cadastro",
        text2:
          error.response?.data?.message ||
          "Não foi possível criar a conta. Tente novamente.",
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Cadastro realizado!",
        text2: "Você já pode fazer login 😊",
      });
      router.replace("/login");
    },
  });

  return {
    signup: signupMutation.mutateAsync,
    loading: signupMutation.isPending,
    error: signupMutation.error,
    signupSchema
  };
}
