import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
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

  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [consent, setConsent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

    if (!consent) {
      showToast(
        "error",
        "Consent Required",
        "Please accept the consent policy."
      );
      return;
    }

    if (!API_URL) {
      showToast(
        "error",
        "API Error",
        "EXPO_PUBLIC_API_URL is missing."
      );
      return;
    }

    try {
      const result = await registerUser(email.trim(), password);

      const userData = {
        uid: result.user.uid,
        name: name.trim(),
        email: email.trim(),
        dateOfBirth,
        postpartumDay: postpartumDay
          ? Number(postpartumDay)
          : null,
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
        throw new Error(
          data?.message || "Failed to save user profile."
        );
      }

      showToast(
        "success",
        "Registration Successful",
        "Welcome to Maa42"
      );

      setTimeout(() => {
        router.push("/(home)" as any);
      }, 800);
    } catch (error: any) {
      console.log(error);

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
      <Pressable
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        A safe start for your 42-day journey
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#B0B8BC"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Date of Birth</Text>

<Pressable
  style={styles.dateInput}
  onPress={() => setShowDatePicker(true)}
>
  <Text
    style={[
      styles.dateText,
      !dateOfBirth && { color: "#B0B8BC" },
    ]}
  >
    {dateOfBirth || "Select your date of birth"}
  </Text>

  <Feather
    name="calendar"
    size={22}
    color="#2FA99A"
  />
</Pressable>

{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    maximumDate={new Date()}
    display={Platform.OS === "ios" ? "spinner" : "default"}
    onChange={(event, date) => {
      if (event.type === "dismissed") {
        setShowDatePicker(false);
        return;
      }

      if (date) {
        setSelectedDate(date);

        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;

        setDateOfBirth(formattedDate);
      }

      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    }}
  />
)}

      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#B0B8BC"
        value={email}
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
        />

        <Pressable
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#8A8F95"
          />
        </Pressable>
      </View>

      <Text style={styles.label}>
        Days after childbirth
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter days"
        placeholderTextColor="#B0B8BC"
        value={postpartumDay}
        onChangeText={setPostpartumDay}
        keyboardType="numeric"
      />

      <Text style={styles.label}>
        Emergency Contact
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Caregiver phone number"
        placeholderTextColor="#B0B8BC"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Delivery Type</Text>

      <View style={styles.row}>
        <Pressable
          style={[
            styles.option,
            deliveryType === "Normal" &&
              styles.activeOption,
          ]}
          onPress={() =>
            setDeliveryType("Normal")
          }
        >
          <Text style={styles.optionText}>
            Normal
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            deliveryType === "C-section" &&
              styles.activeOption,
          ]}
          onPress={() =>
            setDeliveryType("C-section")
          }
        >
          <Text style={styles.optionText}>
            C-section
          </Text>
        </Pressable>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🛡 Your health data is protected and
          used only for care support.
        </Text>
      </View>

      <View style={styles.consentContainer}>
        <Checkbox
          value={consent}
          onValueChange={setConsent}
          color={consent ? "#2FA99A" : undefined}
        />

        <Text style={styles.consentText}>
          I agree to securely share my health
          information for maternal healthcare
          support and research purposes.
        </Text>
      </View>

      <View style={styles.testingBox}>
        <Text style={styles.testingText}>
          ⚠️ This application is currently
          under testing and should not replace
          professional medical advice.
        </Text>
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={handleRegister}
      >
        <Text style={styles.primaryText}>
          Create Account
        </Text>
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

  scrollContent: {
    paddingBottom: 80,
  },
  dateInput: {
  height: 54,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#CFD8DC",
  borderRadius: 12,
  paddingHorizontal: 18,
  marginBottom: 18,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

dateText: {
  fontSize: 16,
  color: "#263238",
},

  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 38,
    color: "#263238",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#263238",
    marginTop: 8,
  },

  subtitle: {
    color: "#7B8288",
    marginTop: 4,
    marginBottom: 28,
  },

  label: {
    fontWeight: "600",
    color: "#263238",
    marginBottom: 8,
  },

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

  passwordContainer: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

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

  activeOption: {
    backgroundColor: "#DDF5F1",
    borderColor: "#2FA99A",
  },

  optionText: {
    fontWeight: "700",
    color: "#263238",
  },

  notice: {
    backgroundColor: "#DDF5F1",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  noticeText: {
    color: "#6B777B",
    lineHeight: 20,
  },

  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  consentText: {
    flex: 1,
    marginLeft: 10,
    color: "#6B777B",
    lineHeight: 20,
    fontSize: 13,
  },

  testingBox: {
    backgroundColor: "#FFF7E6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },

  testingText: {
    color: "#A86B00",
    lineHeight: 20,
    fontSize: 13,
  },

  primaryBtn: {
    height: 56,
    backgroundColor: "#32A99A",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});