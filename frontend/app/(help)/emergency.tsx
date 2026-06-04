import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EmergencyScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color="#263238" />
        </Pressable>
        <Text style={styles.headerTitle}>Emergency Help</Text>
      </View>

      <View style={styles.notice}>
        <View style={styles.noticeIcon}>
          <Feather name="shield" size={22} color="#2FA99A" />
        </View>
        <Text style={styles.noticeText}>
          If you feel unsafe or have danger signs, call for help right away.
        </Text>
      </View>

      <EmergencyCard
        color="#35B66A"
        icon="phone"
        title="Call Doctor"
        subtitle="Dr. Rima"
      />

      <EmergencyCard
        color="#F5A11A"
        icon="phone-call"
        title="Nearest Hospital"
        subtitle="096546367"
      />

      <EmergencyCard
        color="#E83E48"
        icon="truck"
        title="Call ambulance"
        subtitle="999"
      />
    </View>
  );
}

function EmergencyCard({
  color,
  icon,
  title,
  subtitle,
}: {
  color: string;
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable style={[styles.emergencyCard, { backgroundColor: color }]}>
      <View style={styles.iconBox}>
        <Feather name={icon} size={27} color="#fff" />
      </View>

      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
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
    marginBottom: 34,
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
  notice: {
    backgroundColor: "#DDF5F1",
    borderRadius: 12,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#EFFFFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    color: "#6F747B",
    fontSize: 13,
    lineHeight: 20,
  },
  emergencyCard: {
    height: 70,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
});