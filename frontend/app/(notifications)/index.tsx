import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const notifications = [
  {
    title: "AI health alert",
    subtitle: "Mild headache pattern detected.",
    time: "Yesterday",
    icon: "alert-circle",
    bg: "#FFECEF",
    color: "#EF3340",
    active: true,
  },
  {
    title: "Upcoming checkup",
    subtitle: "6-week postnatal visit at Ibn Sina.",
    time: "Tomorrow • 9:00",
    icon: "calendar",
    bg: "#FFF1DF",
    color: "#F5A623",
    active: true,
  },
  {
    title: "AI health alert",
    subtitle: "Mild headache pattern detected.",
    time: "Yesterday",
    icon: "star",
    bg: "#E1F7F3",
    color: "#2FA99A",
  },
  {
    title: "Emergency follow-up",
    subtitle: "Mild headache pattern detected.",
    time: "May 15",
    icon: "phone",
    bg: "#FFECEF",
    color: "#EF3340",
  },
  {
    title: "Reminder completed",
    subtitle: "Iron supplement taken.",
    time: "May 1",
    icon: "check-square",
    bg: "#E8F8EE",
    color: "#35B66A",
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color="#263238" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {notifications.map((item) => (
        <View key={`${item.title}-${item.time}`} style={styles.wrapper}>
          {item.active && <View style={styles.activeLine} />}

          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
              <Feather name={item.icon as any} size={23} color={item.color} />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      ))}
    </View>
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
    marginBottom: 31,
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
  wrapper: {
    marginBottom: 12,
    position: "relative",
  },
  activeLine: {
    position: "absolute",
    left: -5,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#32A99A",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  card: {
    height: 72,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    color: "#263238",
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8A8F95",
    fontSize: 13,
    marginTop: 4,
  },
  time: {
    color: "#6F747B",
    fontSize: 11,
    alignSelf: "flex-start",
    marginTop: 19,
  },
});