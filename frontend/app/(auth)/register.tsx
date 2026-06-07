import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Register() {
  const { registerUser } = useAuth();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [postpartumDay, setPostpartumDay] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [deliveryType, setDeliveryType] = useState("Normal");

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

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast(
        "error",
        "Missing Info",
        "Name, email and password are required."
      );
      return;
    }

    if (password.length < 6) {
      showToast(
        "error",
        "Weak Password",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!API_URL) {
      showToast("error", "API Error", "EXPO_PUBLIC_API_URL is missing.");
      return;
    }

    try {
      const result = await registerUser(email.trim(), password);

      const userData = {
        uid: result.user.uid,
        name: name.trim(),
        email: email.trim(),
        dateOfBirth,
        postpartumDay: postpartumDay ? Number(postpartumDay) : null,
        emergencyContact,
        deliveryType,
      };

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save user profile.");
      }

      showToast("success", "Registration Successful", "Welcome to Maa42.");

      setTimeout(() => {
        router.push("/(home)" as any);
      }, 800);
    }  catch (error: any) {
  console.log("REGISTER ERROR CODE:", error?.code);
  console.log("REGISTER ERROR MESSAGE:", error?.message);

  Toast.show({
    type: "error",
    text1: error?.code || "Registration Failed",
    text2: error?.message || "Something went wrong",
    position: "top",
  });
}
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>A safe start for your 42-day journey</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Date of birth</Text>
      <TextInput
        style={styles.input}
        placeholder="mm/dd/yyyy"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>Days after childbirth</Text>
      <TextInput
        style={styles.input}
        placeholder="Days after childbirth"
        value={postpartumDay}
        onChangeText={setPostpartumDay}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Emergency contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Caregiver phone number"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Delivery type</Text>
      <View style={styles.row}>
        <Pressable
          style={[
            styles.option,
            deliveryType === "Normal" && styles.activeOption,
          ]}
          onPress={() => setDeliveryType("Normal")}
        >
          <Text style={styles.optionText}>Normal</Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            deliveryType === "C-section" && styles.activeOption,
          ]}
          onPress={() => setDeliveryType("C-section")}
        >
          <Text style={styles.optionText}>C-section</Text>
        </Pressable>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🛡 Your health data is protected and used only for care support.
        </Text>
      </View>

      <Pressable style={styles.primaryBtn} onPress={handleRegister}>
        <Text style={styles.primaryText}>Create Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    padding: 27,
    paddingTop: 55,
  },
  scrollContent: { paddingBottom: 80 },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 38, color: "#263238" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#263238",
    marginTop: 8,
  },
  subtitle: { color: "#7B8288", marginTop: 4, marginBottom: 28 },
  label: { fontWeight: "600", color: "#263238", marginBottom: 8 },
  input: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 18,
  },
  row: { flexDirection: "row", gap: 10, marginBottom: 20 },
  option: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#C9D5D5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activeOption: { backgroundColor: "#DDF5F1", borderColor: "#2FA99A" },
  optionText: { fontWeight: "700", color: "#263238" },
  notice: {
    backgroundColor: "#DDF5F1",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  noticeText: { color: "#6B777B", lineHeight: 20 },
  primaryBtn: {
    height: 56,
    backgroundColor: "#32A99A",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  primaryText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});