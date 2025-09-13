import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/theme";
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
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();

  const { login, iseAuth, loading, loginSchema } = useAuth();

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await login({ email, password });
    if (iseAuth) {
      router.replace("/");
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
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setErrors((prev) => ({ ...prev, email: undefined }))}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            errorMessage={errors.email}
            leftIcon={
              <Icon
                name="mail"
                type="feather"
                color={theme.lightColors?.grey4}
              />
            }
          />

          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            onFocus={() =>
              setErrors((prev) => ({ ...prev, password: undefined }))
            }
            secureTextEntry={!showPassword}
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            errorMessage={errors.password}
            leftIcon={
              <Icon
                name="lock"
                type="feather"
                color={theme.lightColors?.grey4}
              />
            }
            rightIcon={
              <Icon
                name={showPassword ? "eye" : "eye-off"}
                type="feather"
                color={theme.lightColors?.grey4}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Pressable>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </Pressable>

          <Button
            title="Entrar"
            onPress={handleLogin}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <Pressable onPress={() => router.replace("/signup")}>
            <Text style={styles.signupText}>Cadastre-se</Text>
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
  forgotPassword: {
    textAlign: "right",
    color: theme.lightColors?.primary,
    fontWeight: "600",
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: theme.lightColors?.grey5,
  },
  signupText: {
    fontSize: 14,
    color: theme.lightColors?.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});
