import {
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DoctorFooterProps = {
  activeTab?: "home" | "patients" | "messages" | "profile";
};

export default function DoctorFooter({ activeTab = "home" }: DoctorFooterProps) {
  const getColor = (tab: string) =>
    activeTab === tab ? "#2FA99A" : "#A7AFB3";

  return (
    <View style={styles.container}>
      {/* Home */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(home)/doctor" as any)}
      >
        <Feather
          name="home"
          size={23}
          color={getColor("home")}
        />
        <Text style={[styles.label, { color: getColor("home") }]}>
          Home
        </Text>
      </Pressable>

      {/* Patients */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(patients)" as any)}
      >
        <Feather
          name="users"
          size={23}
          color={getColor("patients")}
        />
        <Text style={[styles.label, { color: getColor("patients") }]}>
          Patients
        </Text>
      </Pressable>

      {/* Messages */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(messages)" as any)}
      >
        <Ionicons
          name="chatbubble-outline"
          size={23}
          color={getColor("messages")}
        />
        <Text style={[styles.label, { color: getColor("messages") }]}>
          Messages
        </Text>
      </Pressable>

      {/* Profile */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(profile)/doctorProfile" as any)}
      >
        <Feather
          name="user"
          size={23}
          color={getColor("profile")}
        />
        <Text style={[styles.label, { color: getColor("profile") }]}>
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E0E7E7",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 7,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
});