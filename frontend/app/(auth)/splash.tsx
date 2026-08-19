import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/onboarding" as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/maa42-logo.png")}
        style={styles.logo}
      />

      <Text style={styles.brand}>
        <Text style={styles.green}>MED</Text>
        <Text style={styles.orange}>SOPHIA</Text>
      </Text>

      <Text style={styles.healthcare}>HEALTHCARE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 22,
  },
  brand: {
    fontSize: 43,
    fontWeight: "800",
    letterSpacing: 1,
  },
  green: {
    color: "#2FA99A",
  },
  orange: {
    color: "#F5A623",
  },
  healthcare: {
    fontSize: 40,
    fontWeight: "800",
    color: "#2FA99A",
    letterSpacing: 1,
  },
});