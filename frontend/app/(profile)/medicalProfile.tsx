import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const profileData = [
  ["Full Name", "Kaniz Fatema"],
  ["Age", "32"],
  ["Blood group", "O+"],
  ["Childbirth date", "Apr 21, 2026"],
  ["Delivery Type", "Normal"],
  ["Previous complications", "None"],
  ["Existing health conditions", "Mild anemia"],
  ["Current medicines", "Iron + Folic acid"],
  ["Doctor", "Dr. Rima"],
  ["Clinic", "Ibn sina"],
];

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require("../../assets/images/icon.png")} style={styles.avatar} />

          <View style={styles.userBox}>
            <Text style={styles.name}>Kaniz Fatema</Text>
            <Text style={styles.meta}>32y • Female</Text>
          </View>

          <Pressable style={styles.circleBtn}>
            <Feather name="bell" size={22} color="#111827" />
          </Pressable>

          <Pressable style={styles.circleBtn}>
            <Feather name="settings" size={22} color="#111827" />
          </Pressable>
        </View>

        <View style={styles.card}>
          {profileData.map(([label, value], index) => (
            <View
              key={label}
              style={[
                styles.row,
                index === profileData.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.settingsBtn}>
          <Feather name="settings" size={25} color="#2FA99A" />
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="emoticon-happy-outline" label="Health" />
        <NavItem icon="bell-ring-outline" label="Reminder" />
        <NavItem icon="home-outline" label="Home" />
        <NavItem icon="chat-outline" label="Chat" />
        <NavItem icon="file-document-outline" label="Profile" active />
      </View>
    </View>
  );
}

function NavItem({ icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <View style={styles.navItem}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={active ? "#2FA99A" : "#A7AFB3"}
      />
      <Text style={[styles.navLabel, active && { color: "#2FA99A" }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: 35, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 34 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#2FA99A" },
  userBox: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: "800", color: "#263238" },
  meta: { fontSize: 13, color: "#7A7F86", marginTop: 4 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D8E2E2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 28,
  },
  row: {
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: "#7A7F86",
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: "#263238",
    fontWeight: "800",
    textAlign: "right",
  },
  settingsBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2FA99A",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  settingsText: {
    color: "#2FA99A",
    fontSize: 17,
    fontWeight: "800",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: "#E0E7E7",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 7,
  },
  navItem: { alignItems: "center" },
  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A7AFB3",
    marginTop: 3,
  },
});