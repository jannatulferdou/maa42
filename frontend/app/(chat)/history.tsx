import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const chats = [
  { date: "Today", title: "Mild headache & rest advice", risk: "Low" },
  { date: "Yesterday", title: "Breastfeeding help", risk: "Low" },
  { date: "Yesterday", title: "Fever check", risk: "Moderate" },
  { date: "May 11", title: "Bleeding follow-up", risk: "Moderate" },
];

export default function ChatHistory() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color="#263238" />
        </Pressable>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={24} color="#7A7F86" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#7A7F86"
          style={styles.searchInput}
        />
      </View>

      {["Today", "Yesterday", "May 11"].map((date) => (
        <View key={date}>
          <Text style={styles.date}>{date}</Text>
          {chats
            .filter((c) => c.date === date)
            .map((chat) => (
              <View key={chat.title} style={styles.chatCard}>
                <View style={styles.chatIcon}>
                  <Feather name="message-circle" size={24} color="#2FA99A" />
                </View>

                <Text style={styles.chatTitle}>{chat.title}</Text>

                <View
                  style={[
                    styles.badge,
                    chat.risk === "Moderate" && { backgroundColor: "#FFF1DF" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      chat.risk === "Moderate" && { color: "#F5A623" },
                    ]}
                  >
                    {chat.risk}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9", paddingHorizontal: 27, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: "#263238" },
  searchBox: { height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#CFD8DC", backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 28 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  date: { fontSize: 14, fontWeight: "800", color: "#263238", marginBottom: 13, marginTop: 4 },
  chatCard: { height: 59, backgroundColor: "#fff", borderRadius: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 13 },
  chatIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#E1F7F3", alignItems: "center", justifyContent: "center", marginRight: 12 },
  chatTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: "#263238" },
  badge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 14, backgroundColor: "#DDF5F1" },
  badgeText: { color: "#2FA99A", fontWeight: "800", fontSize: 13 },
});