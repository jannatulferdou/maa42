import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PregnantFooterProps = {
  activeTab?: "home" | "health" | "appointments" | "chat" | "profile";
};

export default function PregnantFooter({ activeTab = "home" }: PregnantFooterProps) {
  const getColor = (tab: string) =>
    activeTab === tab ? "#2FA99A" : "#A7AFB3";

  return (
    <View style={styles.container}>
      {/* Health */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(health)/checkin" as any)}
      >
        <MaterialCommunityIcons
          name="heart-pulse"
          size={23}
          color={getColor("health")}
        />
        <Text style={[styles.label, { color: getColor("health") }]}>
          Health
        </Text>
      </Pressable>

      {/* Appointments */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(reminder)/reminder" as any)}
      >
        <Feather
          name="calendar"
          size={23}
          color={getColor("appointments")}
        />
        <Text style={[styles.label, { color: getColor("appointments") }]}>
          Appointments
        </Text>
      </Pressable>

      {/* Home */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(home)/pregnant" as any)}
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

      {/* Chat */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(chat)" as any)}
      >
        <Ionicons
          name="chatbubble-outline"
          size={23}
          color={getColor("chat")}
        />
        <Text style={[styles.label, { color: getColor("chat") }]}>
          Chat
        </Text>
      </Pressable>

      {/* Profile */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push("/(profile)/medicalProfile" as any)}
      >
        <Feather
          name="file-text"
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