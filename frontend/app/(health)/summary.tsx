import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Summary() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>
          <Text style={styles.headerTitle}>Health Summary</Text>
        </View>

        <View style={styles.riskCard}>
          <View style={styles.riskIcon}>
            <Feather name="shield" size={34} color="#fff" />
          </View>
          <Text style={styles.riskSmall}>Your current status</Text>
          <Text style={styles.riskTitle}>Moderate Risk</Text>
        </View>

        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Why this result?</Text>
          <Text style={styles.reasonText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Next steps</Text>

        <Step active icon="home" title="Monitor at home" badge="Now" />
        <Step icon="phone" title="Contact my doctor" />
        <Step icon="building" title="Visit clinic" />

        <Pressable style={styles.aiBtn}>
          <Ionicons name="chatbubble-outline" size={25} color="#fff" />
          <Text style={styles.aiText}>Talk to AI</Text>
        </Pressable>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function Step({ icon, title, active, badge }: any) {
  return (
    <View style={[styles.stepCard, active && styles.activeStep]}>
      <View style={[styles.stepIconBox, active && styles.activeStepIcon]}>
        <Feather name={icon} size={23} color={active ? "#fff" : "#2FA99A"} />
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      {badge && <Text style={styles.badge}>{badge}</Text>}
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
  header: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: "#263238" },
  riskCard: { height: 157, backgroundColor: "#FFF1DF", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  riskIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFA31A", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  riskSmall: { color: "#8A8F95", fontSize: 13 },
  riskTitle: { color: "#FF9F1A", fontSize: 22, fontWeight: "800", marginTop: 3 },
  reasonCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#CED9DD", borderRadius: 12, padding: 18, marginBottom: 28 },
  reasonTitle: { fontSize: 15, fontWeight: "800", color: "#263238", marginBottom: 9 },
  reasonText: { color: "#7B8288", fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: "#263238", fontWeight: "800", marginBottom: 12 },
  stepCard: { height: 58, backgroundColor: "#fff", borderRadius: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 12 },
  activeStep: { backgroundColor: "#DDF5F1", borderWidth: 1, borderColor: "#2FA99A" },
  stepIconBox: { width: 38, height: 38, borderRadius: 8, backgroundColor: "#E7FAF7", alignItems: "center", justifyContent: "center", marginRight: 12 },
  activeStepIcon: { backgroundColor: "#32A99A" },
  stepTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: "#263238" },
  badge: { color: "#159B8D", fontSize: 12, fontWeight: "800" },
  aiBtn: { height: 58, borderRadius: 10, backgroundColor: "#32A99A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 24 },
  aiText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0, height: 72, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: "#E0E7E7", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 7 },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 11, fontWeight: "700", color: "#A7AFB3", marginTop: 3 },
});