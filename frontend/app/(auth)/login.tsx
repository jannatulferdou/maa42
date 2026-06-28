import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const { loginUser, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (
    type: "success" | "error",
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 2500,
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("error", "Missing Info", "Please enter email and password.");
      return;
    }

    if (!API_URL) {
      showToast("error", "API Error", "EXPO_PUBLIC_API_URL is missing.");
      return;
    }

    try {
      const credential = await loginUser(email.trim(), password);
      const uid = credential.user.uid;

      const res = await fetch(`${API_URL}/users/${uid}`);
      const data = await res.json();

      console.log("LOGIN USER PROFILE:", data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "User profile not found in backend.");
      }

      showToast("success", "Login Successful", `Welcome back, ${data.data.name}`);

      setTimeout(() => {
        router.replace("/(home)" as any);
      }, 800);
    } catch (error: any) {
      let message = error.message || "Login failed.";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        message = "Email or password is incorrect.";
      }

      if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email.";
      }

      showToast("error", "Login Failed", message);
    }
  };

  const handleForgotPassword = async () => {
  if (!email.trim()) {
    showToast(
      "error",
      "Email Required",
      "Please enter your email first."
    );
    return;
  }

  try {
    await resetPassword(email);

    showToast(
      "success",
      "Reset Email Sent",
      "Please check your inbox."
    );
  } catch (error: any) {
    showToast(
      "error",
      "Reset Failed",
      error.message
    );
  }
};

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>Check In</Text>
      <Text style={styles.subtitle}>Continue your maternal care</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        placeholderTextColor="#B0B8BC"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
    <TextInput
    style={styles.passwordInput}
    placeholder="Enter password"
    placeholderTextColor="#B0B8BC"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    autoCapitalize="none"
    />

  <Pressable
    onPress={() => setShowPassword(!showPassword)}
  >
    <Feather
      name={showPassword ? "eye-off" : "eye"}
      size={22}
      color="#8A8F95"
    />
  </Pressable>
</View>


      <Text style={styles.forgot} onPress={handleForgotPassword}>
        Forgot password?
      </Text>

      <Pressable style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryText}>Continue</Text>
      </Pressable>

      <Text style={styles.or}>Or</Text>

      <Pressable
        style={styles.googleBtn}
        onPress={() =>
          showToast("error", "Google Login", "Google login is not set up yet.")
        }
      >
        <Text style={styles.googleText}>G  Sign in with Google</Text>
      </Pressable>

      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/register" as any)}
        >
          Create account
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    padding: 27,
    paddingTop: 70,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  backText: { fontSize: 38, color: "#263238" },
  title: { fontSize: 22, fontWeight: "700", color: "#263238" },
  subtitle: { color: "#7B8288", marginTop: 4, marginBottom: 45 },
  label: { fontWeight: "600", color: "#263238", marginBottom: 8 },
  input: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 22,
  },
  forgot: {
    color: "#159B8D",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 30,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: "#32A99A",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordContainer: {
  height: 54,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#CFD8DC",
  borderRadius: 12,
  paddingHorizontal: 18,
  marginBottom: 22,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

passwordInput: {
  flex: 1,
  fontSize: 16,
},
  primaryText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  or: { textAlign: "center", color: "#8A8F95", marginVertical: 24 },
  googleBtn: {
    height: 54,
    borderWidth: 1,
    borderColor: "#32A99A",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  googleText: { color: "#159B8D", fontWeight: "700", fontSize: 16 },
  bottomText: { textAlign: "center", color: "#8A8F95", marginTop: 24 },
  link: { color: "#159B8D", fontWeight: "700" },
});