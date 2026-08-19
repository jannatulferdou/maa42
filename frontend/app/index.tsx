import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  console.log("Root Index - Loading:", loading, "User:", user?.uid);

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

  if (user) {
    console.log("User exists, redirecting to home");
    return <Redirect href="/(home)" />;
  }

  console.log("No user, redirecting to splash");
  return <Redirect href="/(auth)/splash" />;
}