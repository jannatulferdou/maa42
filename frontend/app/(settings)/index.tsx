import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color="#263238" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <SettingRow icon="user" label="Edit profile" />
        <SettingRow icon="lock" label="Change password" last />
      </View>

      <View style={styles.card}>
        <View style={styles.languageHeader}>
          <Feather name="globe" size={23} color="#111827" />
          <Text style={styles.languageTitle}>Language</Text>
        </View>

        <View style={styles.langRow}>
          <Pressable style={[styles.langBtn, styles.langActive]}>
            <Text style={styles.langActiveText}>English</Text>
          </Pressable>

          <Pressable style={styles.langBtn}>
            <Text style={styles.langText}>বাংলা</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <SettingRow icon="bell" label="Notification settings" />
        <SettingRow icon="shield" label="Privacy settings" />
        <SettingRow icon="wifi" label="Offline sync settings" last />
      </View>

      <Pressable style={styles.deleteCard}>
        <Feather name="trash-2" size={23} color="#EF3340" />
        <Text style={styles.deleteText}>Delete account</Text>
        <Feather name="chevron-right" size={25} color="#EF3340" />
      </Pressable>

      <Pressable style={styles.logoutBtn}>
        <Feather name="log-out" size={24} color="#EF3340" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.settingRow, last && styles.noBorder]}>
      <Feather name={icon} size={22} color="#111827" />
      <Text style={styles.settingText}>{label}</Text>
      <Feather name="chevron-right" size={25} color="#111827" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    paddingHorizontal: 27,
    paddingTop: 42,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "800",
    color: "#263238",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 25,
  },
  settingRow: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "800",
    color: "#263238",
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 14,
  },
  languageTitle: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "800",
    color: "#263238",
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  langBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#E8EAED",
    alignItems: "center",
    justifyContent: "center",
  },
  langActive: {
    backgroundColor: "#32A99A",
  },
  langText: {
    color: "#7A7F86",
    fontWeight: "800",
    fontSize: 15,
  },
  langActiveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  deleteCard: {
    height: 64,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  deleteText: {
    flex: 1,
    marginLeft: 12,
    color: "#EF3340",
    fontSize: 15,
    fontWeight: "800",
  },
  logoutBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FCE6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    color: "#EF3340",
    fontSize: 16,
    fontWeight: "800",
  },
});