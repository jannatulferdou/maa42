import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Summary() {
  const params = useLocalSearchParams();

  const risk = String(params.risk || "Low Risk");
  const reason = String(params.reason || "You seem stable right now.");

  let nextSteps: string[] = ["Monitor at home", "Contact my doctor", "Visit clinic"];

  try {
    if (params.nextSteps) {
      nextSteps = JSON.parse(String(params.nextSteps));
    }
  } catch {}

  const riskColor =
    risk === "High Risk" ? "#EF3340" : risk === "Moderate Risk" ? "#FFA31A" : "#2FA99A";

  const riskBg =
    risk === "High Risk" ? "#FFE7E8" : risk === "Moderate Risk" ? "#FFF1DF" : "#DDF5F1";

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>
          <Text style={styles.headerTitle}>Health Summary</Text>
        </View>

        <View style={[styles.riskCard, { backgroundColor: riskBg }]}>
          <View style={[styles.riskIcon, { backgroundColor: riskColor }]}>
            <Feather name="shield" size={34} color="#fff" />
          </View>
          <Text style={styles.riskSmall}>Your current status</Text>
          <Text style={[styles.riskTitle, { color: riskColor }]}>{risk}</Text>
        </View>

        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Why this result?</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        <Text style={styles.sectionTitle}>Next steps</Text>

        {nextSteps.map((step, index) => (
          <Step
            key={`${step}-${index}`}
            active={index === 0}
            icon={index === 0 ? "home" : index === 1 ? "phone" : "map-pin"}
            title={step}
            badge={index === 0 ? "Now" : undefined}
          />
        ))}

        <Pressable style={styles.aiBtn} onPress={() => router.push("/(chat)" as any)}>
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
      <NavItem
        label="Health"
        icon="emoticon-happy-outline"
        active
        onPress={() => router.push("/checkin" as any)}
      />

      <NavItem
        label="Reminder"
        featherIcon="bell"
        onPress={() => router.push("/reminder" as any)}
      />

      <NavItem
        label="Home"
        featherIcon="home"
        onPress={() => router.push("/" as any)}
      />

      <NavItem
        label="Chat"
        ionIcon="chatbubble-outline"
        onPress={() => router.push("/(chat)" as any)}
      />

      <NavItem
        label="Profile"
        featherIcon="file-text"
        onPress={() => router.push("/(profile)" as any)}
      />
    </View>
  );
}

function NavItem({
  label,
  icon,
  featherIcon,
  ionIcon,
  active,
  onPress,
}: {
  label: string;
  icon?: any;
  featherIcon?: any;
  ionIcon?: any;
  active?: boolean;
  onPress?: () => void;
}) {
  const color = active ? "#2FA99A" : "#A7AFB3";

  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      {icon && <MaterialCommunityIcons name={icon} size={23} color={color} />}
      {featherIcon && <Feather name={featherIcon} size={23} color={color} />}
      {ionIcon && <Ionicons name={ionIcon} size={23} color={color} />}

      <Text style={[styles.navLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: 40, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: "#263238" },
  riskCard: { height: 157, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  riskIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  riskSmall: { color: "#8A8F95", fontSize: 13 },
  riskTitle: { fontSize: 22, fontWeight: "800", marginTop: 3 },
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