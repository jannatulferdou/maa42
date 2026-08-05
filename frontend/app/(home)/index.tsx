import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";

export default function HomeIndex() {
  const { user, loading } = useAuth();

  console.log("Home Index - Loading:", loading);
  console.log("Home Index - User:", user?.uid, "Role:", user?.role, "CareStage:", user?.careStage);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5FAF9",
        }}
      >
        <ActivityIndicator size="large" color="#2FA99A" />
      </View>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    console.log("No user, redirecting to splash");
    return <Redirect href="/(auth)/splash" />;
  }

  // WAIT FOR ROLE TO BE LOADED FROM BACKEND
  if (!user.role) {
    console.log("Role not loaded yet, showing loader");
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5FAF9",
        }}
      >
        <ActivityIndicator size="large" color="#2FA99A" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  // DOCTOR
  if (user.role === "doctor") {
    console.log("Redirecting to doctor home");
    return <Redirect href="/(home)/doctor" />;
  }

  // PREGNANT MOTHER
  if (user.role === "mother" && user.careStage === "pregnant") {
    console.log("Redirecting to pregnant home");
    return <Redirect href="/(home)/pregnant" />;
  }

  // POSTPARTUM MOTHER
  if (user.role === "mother" && user.careStage === "postpartum") {
    console.log("Redirecting to postpartum home");
    return <Redirect href="/(home)/postpartum" />;
  }

  // MOTHER WITHOUT CARE STAGE (Fallback)
  if (user.role === "mother") {
    console.log("Mother without careStage, redirecting to postpartum as default");
    return <Redirect href="/(home)/postpartum" />;
  }

  // ULTIMATE FALLBACK
  console.log("Unknown role, redirecting to splash");
  return <Redirect href="/(auth)/splash" />;
}