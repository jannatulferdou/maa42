import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const symptoms = [
  { title: "Feeling well", icon: "emoticon-happy-outline", type: "mc", color: "#2FA99A", bg: "#E1F7F3" },
  { title: "Fever", icon: "thermometer", type: "feather", color: "#EF3340", bg: "#FFE7E8" },
  { title: "Heavy bleeding", icon: "drop", type: "feather", color: "#EF3340", bg: "#FFE7E8" },
  { title: "Weakness", icon: "wind", type: "feather", color: "#F5A623", bg: "#FFF1D8" },
  { title: "Dizziness", icon: "zap", type: "feather", color: "#F5A623", bg: "#FFF1D8" },
  { title: "Sadness", icon: "frown-outline", type: "ion", color: "#7A7F86", bg: "#F1F4F5" },
  { title: "Swelling", icon: "wind", type: "feather", color: "#F5A623", bg: "#FFF1D8" },
  { title: "Pain", icon: "zap", type: "feather", color: "#EF3340", bg: "#FFE7E8" },
  { title: "Headache", icon: "frown-outline", type: "ion", color: "#F5A623", bg: "#FFF1D8" },
  { title: "Infection signs", icon: "wind", type: "feather", color: "#EF3340", bg: "#FFE7E8" },
  { title: "Trouble feeding", icon: "zap", type: "feather", color: "#F5A623", bg: "#FFF1D8" },
];

export default function Checkin() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = 1; // pore login user er database id boshaben

  const toggleSymptom = (title: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleSubmit = async () => {
    if (!API_URL) {
      Alert.alert("Error", "EXPO_PUBLIC_API_URL missing in .env.local");
      return;
    }

    if (selectedSymptoms.length === 0) {
      Alert.alert("Required", "Please select at least one symptom.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          symptoms: selectedSymptoms,
          severity,
          notes,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Checkin failed");
      }

      const data = result.data;

      router.push({
        pathname: "/(health)/summary",
        params: {
          risk: data.risk,
          reason: data.reason,
          nextSteps: JSON.stringify(data.nextSteps),
        },
      } as any);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          {symptoms.map((item) => {
            const active = selectedSymptoms.includes(item.title);

            return (
              <Pressable
                key={item.title}
                onPress={() => toggleSymptom(item.title)}
                style={[
                  styles.symptomCard,
                  active && { backgroundColor: item.bg, borderColor: item.color },
                ]}
              >
                {item.type === "mc" && (
                  <MaterialCommunityIcons name={item.icon as any} size={25} color={active ? item.color : "#7A7F86"} />
                )}
                {item.type === "feather" && (
                  <Feather name={item.icon as any} size={25} color={active ? item.color : "#7A7F86"} />
                )}
                {item.type === "ion" && (
                  <Ionicons name={item.icon as any} size={25} color={active ? item.color : "#7A7F86"} />
                )}

                <Text style={[styles.symptomText, active && { color: item.color }]}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Severity</Text>
        <View style={styles.severityRow}>
          {["Mild", "Moderate", "Severe"].map((item) => (
            <Pressable
              key={item}
              onPress={() => setSeverity(item)}
              style={[
                styles.severityBtn,
                severity === item && styles.activeSeverity,
              ]}
            >
              <Text
                style={
                  severity === item
                    ? styles.activeSeverityText
                    : styles.severityText
                }
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notes}
          placeholder="Describe anything else..."
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholderTextColor="#8A8F95"
        />

        <Pressable
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </Pressable>
      </ScrollView>

      <BottomNav />
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