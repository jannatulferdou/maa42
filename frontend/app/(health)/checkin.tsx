import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const symptoms = [
  { title: "Feeling well", icon: "emoticon-happy-outline", type: "mc", active: true, color: "#2FA99A", bg: "#E1F7F3" },
  { title: "Fever", icon: "thermometer", type: "feather" },
  { title: "Heavy bleeding", icon: "drop", type: "feather" },
  { title: "Weakness", icon: "wind", type: "feather" },
  { title: "Dizziness", icon: "zap", type: "feather", active: true, color: "#F5A623", bg: "#FFF1D8" },
  { title: "Sadness", icon: "frown-outline", type: "ion" },
  { title: "Swelling", icon: "wind", type: "feather" },
  { title: "Pain", icon: "zap", type: "feather", active: true, color: "#EF3340", bg: "#FFE7E8" },
  { title: "Headache", icon: "frown-outline", type: "ion" },
  { title: "Infection signs", icon: "wind", type: "feather" },
  { title: "Trouble feeding", icon: "zap", type: "feather" },
];

export default function Checkin() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>
          <Text style={styles.headerTitle}>Health Checkin</Text>
        </View>

        <View style={styles.grid}>
          {symptoms.map((item) => (
            <Pressable
              key={item.title}
              style={[
                styles.symptomCard,
                item.active && { backgroundColor: item.bg, borderColor: item.color },
              ]}
            >
              {item.type === "mc" && <MaterialCommunityIcons name={item.icon as any} size={25} color={item.color || "#7A7F86"} />}
              {item.type === "feather" && <Feather name={item.icon as any} size={25} color={item.color || "#7A7F86"} />}
              {item.type === "ion" && <Ionicons name={item.icon as any} size={25} color={item.color || "#7A7F86"} />}
              <Text style={[styles.symptomText, item.active && { color: item.color }]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Severity</Text>
        <View style={styles.severityRow}>
          <Pressable style={[styles.severityBtn, styles.activeSeverity]}>
            <Text style={styles.activeSeverityText}>Mild</Text>
          </Pressable>
          <Pressable style={styles.severityBtn}>
            <Text style={styles.severityText}>Moderate</Text>
          </Pressable>
          <Pressable style={styles.severityBtn}>
            <Text style={styles.severityText}>Severe</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notes}
          placeholder="Describe anything else..."
          multiline
          placeholderTextColor="#8A8F95"
        />

        <Pressable style={styles.submitBtn} onPress={() => router.push("/(health)/summary" as any)}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Nav icon={<MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#2FA99A" />} label="Health" active />
      <Nav icon={<Feather name="bell" size={23} color="#A7AFB3" />} label="Reminder" />
      <Nav icon={<Feather name="home" size={23} color="#A7AFB3" />} label="Home" />
      <Nav icon={<Ionicons name="chatbubble-outline" size={23} color="#A7AFB3" />} label="Chat" />
      <Nav icon={<Feather name="file-text" size={23} color="#A7AFB3" />} label="Profile" />
    </View>
  );
}

function Nav({ icon, label, active }: any) {
  return (
    <View style={styles.navItem}>
      {icon}
      <Text style={[styles.navLabel, active && { color: "#2FA99A" }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: 40, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: "#263238" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginBottom: 28 },
  symptomCard: { width: "31.5%", height: 64, borderRadius: 10, borderWidth: 1, borderColor: "#CED9DD", backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  symptomText: { marginTop: 5, fontSize: 11, fontWeight: "700", color: "#6F747B", textAlign: "center" },
  label: { fontSize: 15, fontWeight: "800", color: "#263238", marginBottom: 12 },
  severityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  severityBtn: { width: "31.5%", height: 50, borderRadius: 10, borderWidth: 1, borderColor: "#CED9DD", backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  activeSeverity: { backgroundColor: "#32A99A", borderColor: "#32A99A" },
  severityText: { fontSize: 15, fontWeight: "800", color: "#7A7F86" },
  activeSeverityText: { fontSize: 15, fontWeight: "800", color: "#fff" },
  notes: { height: 90, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#CED9DD", padding: 18, fontSize: 15, textAlignVertical: "top", marginBottom: 24 },
  submitBtn: { height: 56, borderRadius: 11, backgroundColor: "#32A99A", alignItems: "center", justifyContent: "center" },
  submitText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0, height: 72, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: "#E0E7E7", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 7 },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 11, fontWeight: "700", color: "#A7AFB3", marginTop: 3 },
});