import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Register() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>A safe start for your 42-day journey</Text>

      {["Full name", "Date of birth", "Email", "Password", "Days after childbirth", "Emergency contact"].map((label, i) => (
        <View key={label}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={
              i === 0 ? "Kaniz Fatema" :
              i === 1 ? "mm/dd/yyyy" :
              i === 2 ? "example@gmail.com" :
              i === 3 ? "••••••••••" :
              i === 4 ? "7" : "Caregiver phone number"
            }
            secureTextEntry={i === 3}
          />
        </View>
      ))}

      <Text style={styles.label}>Delivery type</Text>
      <View style={styles.row}>
        <Pressable style={[styles.option, styles.activeOption]}>
          <Text style={styles.optionText}>Normal</Text>
        </Pressable>
        <Pressable style={styles.option}>
          <Text style={styles.optionText}>C-section</Text>
        </Pressable>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🛡 Your health data is protected and used only for care support.
        </Text>
      </View>

      <Pressable style={styles.primaryBtn} onPress={() => router.replace("/(home)" as any)}>
        <Text style={styles.primaryText}>Create Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FAF9", padding: 27, paddingTop: 55 },
  scrollContent: { paddingBottom: 80 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 38, color: "#263238" },
  title: { fontSize: 22, fontWeight: "700", color: "#263238", marginTop: 8 },
  subtitle: { color: "#7B8288", marginTop: 4, marginBottom: 28 },
  label: { fontWeight: "600", color: "#263238", marginBottom: 8 },
  input: { height: 54, backgroundColor: "#fff", borderWidth: 1, borderColor: "#CFD8DC", borderRadius: 12, paddingHorizontal: 18, fontSize: 16, marginBottom: 18 },
  row: { flexDirection: "row", gap: 10, marginBottom: 20 },
  option: { flex: 1, height: 48, borderWidth: 1, borderColor: "#C9D5D5", borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  activeOption: { backgroundColor: "#DDF5F1", borderColor: "#2FA99A" },
  optionText: { fontWeight: "700", color: "#263238" },
  notice: { backgroundColor: "#DDF5F1", padding: 14, borderRadius: 12, marginBottom: 24 },
  noticeText: { color: "#6B777B", lineHeight: 20 },
  primaryBtn: { height: 56, backgroundColor: "#32A99A", borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 30 },
  primaryText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});