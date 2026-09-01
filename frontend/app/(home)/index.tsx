import { Colors } from "@/constants/theme";
import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";

export default function HomeIndex() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return <Redirect href="/(auth)/splash" />;
  }

  // WAIT FOR ROLE TO BE LOADED FROM BACKEND
  if (!user.role) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  // DOCTOR
  if (user.role === "doctor") {
    return <Redirect href="/(home)/doctor" />;
  }

  // PREGNANT MOTHER
  if (user.role === "mother" && user.careStage === "pregnant") {
    return <Redirect href="/(home)/pregnant" />;
  }

  // POSTPARTUM MOTHER
  if (user.role === "mother" && user.careStage === "postpartum") {
    return <Redirect href="/(home)/postpartum" />;
  }

  // MOTHER WITHOUT CARE STAGE (Fallback)
  if (user.role === "mother") {
    return <Redirect href="/(home)/postpartum" />;
  }

  // ULTIMATE FALLBACK
  return <Redirect href="/(auth)/splash" />;
}