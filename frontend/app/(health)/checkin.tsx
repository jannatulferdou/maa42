import { Colors } from "@/constants/theme";
import useAuth from "@/hooks/useAuth";
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
import PostpartumFooter from "../(footer)/PostpartumFooter";
import PregnantFooter from "../(footer)/PregnantFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const symptoms = [
  { title: "Feeling well", icon: "emoticon-happy-outline", type: "mc", color: Colors.light.primary, bg: "#E1F7F3" },
  { title: "Fever", icon: "thermometer", type: "feather", color: Colors.light.danger, bg: "#FFE7E8" },
  { title: "Heavy bleeding", icon: "drop", type: "feather", color: Colors.light.danger, bg: "#FFE7E8" },
  { title: "Weakness", icon: "wind", type: "feather", color: Colors.light.accent, bg: "#FFF1D8" },
  { title: "Dizziness", icon: "zap", type: "feather", color: Colors.light.accent, bg: "#FFF1D8" },
  { title: "Sadness", icon: "frown-outline", type: "ion", color: Colors.light.textSecondary, bg: "#F1F4F5" },
  { title: "Swelling", icon: "wind", type: "feather", color: Colors.light.accent, bg: "#FFF1D8" },
  { title: "Pain", icon: "zap", type: "feather", color: Colors.light.danger, bg: "#FFE7E8" },
  { title: "Headache", icon: "frown-outline", type: "ion", color: Colors.light.accent, bg: "#FFF1D8" },
  { title: "Infection signs", icon: "wind", type: "feather", color: Colors.light.danger, bg: "#FFE7E8" },
  { title: "Trouble feeding", icon: "zap", type: "feather", color: Colors.light.accent, bg: "#FFF1D8" },
];

export default function Checkin() {
  const { user } = useAuth();
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
            <Feather name="chevron-left" size={34} color={Colors.light.text} />
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
                  <MaterialCommunityIcons name={item.icon as any} size={25} color={active ? item.color : Colors.light.textSecondary} />
                )}
                {item.type === "feather" && (
                  <Feather name={item.icon as any} size={25} color={active ? item.color : Colors.light.textSecondary} />
                )}
                {item.type === "ion" && (
                  <Ionicons name={item.icon as any} size={25} color={active ? item.color : Colors.light.textSecondary} />
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
          placeholderTextColor={Colors.light.textMuted}
        />

        <Pressable
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.light.white} />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </Pressable>
      </ScrollView>

            {user?.careStage === "pregnant" ? (
        <PregnantFooter activeTab="health" />
      ) : (
        <PostpartumFooter activeTab="health" />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingHorizontal: 27, paddingTop: 40, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.light.white, alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: Colors.light.text },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginBottom: 28 },
  symptomCard: { width: "31.5%", height: 64, borderRadius: 10, borderWidth: 1, borderColor: "#CED9DD", backgroundColor: Colors.light.white, alignItems: "center", justifyContent: "center" },
  symptomText: { marginTop: 5, fontSize: 11, fontWeight: "700", color: "#6F747B", textAlign: "center" },
  label: { fontSize: 15, fontWeight: "800", color: Colors.light.text, marginBottom: 12 },
  severityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  severityBtn: { width: "31.5%", height: 50, borderRadius: 10, borderWidth: 1, borderColor: "#CED9DD", backgroundColor: Colors.light.white, alignItems: "center", justifyContent: "center" },
  activeSeverity: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  severityText: { fontSize: 15, fontWeight: "800", color: Colors.light.textSecondary },
  activeSeverityText: { fontSize: 15, fontWeight: "800", color: Colors.light.white },
  notes: { height: 90, backgroundColor: Colors.light.white, borderRadius: 12, borderWidth: 1, borderColor: "#CED9DD", padding: 18, fontSize: 15, textAlignVertical: "top", marginBottom: 24 },
  submitBtn: { height: 56, borderRadius: 11, backgroundColor: Colors.light.primary, alignItems: "center", justifyContent: "center" },
  submitText: { color: Colors.light.white, fontSize: 17, fontWeight: "800" },

});