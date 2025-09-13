import { useSignup } from "@/hooks/useSignup";
import { theme } from "@/theme";
import { Button, Icon, Input } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInputMask } from "react-native-masked-text";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  }>({});

  const { signup, loading, signupSchema } = useSignup();

  const router = useRouter();

  const handleSignup = async () => {
    const result = signupSchema.safeParse({ name, email, password, phone });

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
    await signup({ name, email, password, phone });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            onFocus={() => setErrors((prev) => ({ ...prev, name: undefined }))}
            errorMessage={errors.name}
            leftIcon={
              <Icon
                name="user"
                type="feather"
                color={theme.lightColors?.grey4}
              />
            }
          />

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            onFocus={() => setErrors((prev) => ({ ...prev, email: undefined }))}
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
            secureTextEntry={!showPassword}
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            onFocus={() =>
              setErrors((prev) => ({ ...prev, password: undefined }))
            }
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

          <Input
            placeholder="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerStyle={styles.fullWidthInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            onFocus={() => setErrors((prev) => ({ ...prev, phone: undefined }))}
            errorMessage={errors.phone}
            leftIcon={
              <Icon
                name="phone"
                type="feather"
                color={theme.lightColors?.grey4}
              />
            }
            InputComponent={TextInputMask as any}
            type={"cel-phone" as any}
            options={{
              maskType: "BRL",
              withDDD: true,
              dddMask: "(99) ",
            }}
          />

          <Button
            title="Cadastrar"
            onPress={handleSignup}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.loginText}>Faça login</Text>
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
  loginText: {
    fontSize: 14,
    color: theme.lightColors?.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});
