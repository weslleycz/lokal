import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/theme";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Icon, Input } from "@rneui/base";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
      setError(null);
    }, [])
  );

  const router = useRouter();
  const { forgotPassword, resetPassword } = useAuth();

  const handleRequestCode = async () => {
    if (!email) {
      setError("O email é obrigatório");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      Alert.alert(
        "Código enviado",
        "Se o email estiver cadastrado, você receberá um código para redefinir a senha."
      );
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      setError("Preencha todos os campos");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword({ code, newPassword });
      Alert.alert("Sucesso", "Senha redefinida com sucesso");
      router.replace("/login");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/images/logo.svg")}
          style={styles.logo}
          contentFit="contain"
        />

        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 1 ? "Esqueci minha senha" : "Redefinir senha"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Informe seu email para receber o código de redefinição"
              : "Informe o código recebido e a nova senha"}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 ? (
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setError(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.fullWidthInput}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              errorMessage={error || undefined}
              leftIcon={
                <Icon
                  name="mail"
                  type="feather"
                  color={theme.lightColors?.grey4}
                />
              }
            />
          ) : (
            <>
              <Input
                placeholder="Código"
                value={code}
                onChangeText={setCode}
                onFocus={() => setError(null)}
                containerStyle={styles.fullWidthInput}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                errorMessage={error || undefined}
                leftIcon={
                  <Icon
                    name="key"
                    type="feather"
                    color={theme.lightColors?.grey4}
                  />
                }
              />
              <Input
                placeholder="Nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setError(null)}
                secureTextEntry
                containerStyle={styles.fullWidthInput}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                errorMessage={error || undefined}
                leftIcon={
                  <Icon
                    name="lock"
                    type="feather"
                    color={theme.lightColors?.grey4}
                  />
                }
              />
            </>
          )}

          <Button
            title={step === 1 ? "Enviar código" : "Redefinir senha"}
            onPress={step === 1 ? handleRequestCode : handleResetPassword}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
            loading={loading}
          />

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.backToLogin}>Voltar para login</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightColors?.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 180,
    height: 120,
    alignSelf: "center",
    marginBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.lightColors?.grey5,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: theme.lightColors?.grey2,
    paddingHorizontal: 12,
    backgroundColor: theme.lightColors?.grey0,
  },
  inputText: {
    fontSize: 16,
    paddingVertical: 10,
  },
  fullWidthInput: {
    width: "100%",
    paddingHorizontal: 0,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  button: {
    borderRadius: 14,
    height: 52,
    backgroundColor: theme.lightColors?.primary,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  backToLogin: {
    textAlign: "center",
    color: theme.lightColors?.primary,
    fontWeight: "600",
    marginTop: 16,
  },
});
