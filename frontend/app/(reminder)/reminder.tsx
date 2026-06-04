import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const days = [
  "27", "28", "1", "2", "3", "4",
  "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22",
  "23", "24", "25", "26", "27", "28",
  "29", "30", "31", "1", "2", "3",
];

export default function ReminderScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>
          <Text style={styles.headerTitle}>Reminder</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarTop}>
            <Pressable style={styles.pill}>
              <Text style={styles.pillText}>March</Text>
              <Feather name="chevron-down" size={17} color="#263238" />
            </Pressable>

            <Pressable style={styles.pill}>
              <Text style={styles.pillText}>2021</Text>
              <Feather name="chevron-down" size={17} color="#263238" />
            </Pressable>
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const muted = index < 2 || index > 32;
              const active = day === "13";

              return (
                <View key={`${day}-${index}`} style={styles.dayBox}>
                  <View style={[styles.activeDay, active && styles.activeDayBg]}>
                    <Text
                      style={[
                        styles.dayText,
                        muted && styles.mutedDay,
                        active && styles.activeDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Reminder title"
          placeholderTextColor="#7A7F86"
        />

        <View style={styles.row}>
          <Pressable style={styles.halfInput}>
            <Feather name="clock" size={23} color="#7A7F86" />
            <Text style={styles.inputText}>10:00 AM</Text>
            <Feather name="chevron-down" size={18} color="#7A7F86" />
          </Pressable>

          <Pressable style={styles.halfInput}>
            <Feather name="refresh-cw" size={23} color="#7A7F86" />
            <Text style={styles.inputText}>Once</Text>
            <Feather name="chevron-down" size={18} color="#7A7F86" />
          </Pressable>
        </View>

        <View style={styles.alarmBox}>
          <MaterialCommunityIcons name="alarm" size={26} color="#7A7F86" />
          <Text style={styles.alarmText}>Alarm</Text>
          <View style={styles.switchTrack}>
            <View style={styles.switchCircle} />
          </View>
        </View>

        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Reminder</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Upcoming reminder</Text>

        <ReminderItem
          icon="alarm"
          title="6-week postbirth checkup"
          subtitle="May 14 • 10:00 • Ibn sina"
        />

        <ReminderItem
          icon="office-building"
          title="Take iron supplement"
          subtitle="Daily • 08:00 • Self care"
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="emoticon-happy-outline" label="Health" />
        <NavItem icon="bell-ring-outline" label="Reminder" active />
        <NavItem icon="home-outline" label="Home" />
        <NavItem icon="chat-outline" label="Chat" />
        <NavItem icon="file-document-outline" label="Profile" />
      </View>
    </View>
  );
}

function ReminderItem({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.reminderCard}>
      <View style={styles.reminderIconBox}>
        <MaterialCommunityIcons name={icon} size={25} color="#2FA99A" />
      </View>

      <View>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={active ? "#2FA99A" : "#A7AFB3"}
      />
      <Text style={[styles.navLabel, active && { color: "#2FA99A" }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAF9",
  },
  content: {
    paddingHorizontal: 27,
    paddingTop: 42,
    paddingBottom: 120,
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
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 28,
  },
  calendarTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  pill: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F5F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  pillText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263238",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayBox: {
    width: "16.66%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDay: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDayBg: {
    backgroundColor: "#32A99A",
  },
  dayText: {
    fontSize: 13,
    color: "#263238",
  },
  mutedDay: {
    color: "#D2D8DA",
  },
  activeDayText: {
    color: "#fff",
    fontWeight: "800",
  },
  input: {
    height: 45,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CED9DD",
    borderRadius: 11,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CED9DD",
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#7A7F86",
  },
  alarmBox: {
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CED9DD",
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  alarmText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#7A7F86",
    fontWeight: "700",
  },
  switchTrack: {
    width: 38,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#32A99A",
    padding: 3,
    alignItems: "flex-end",
  },
  switchCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveBtn: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#32A99A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  saveText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 12,
  },
  reminderCard: {
    height: 72,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reminderIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#DDF5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reminderTitle: {
    color: "#263238",
    fontSize: 15,
    fontWeight: "800",
  },
  reminderSubtitle: {
    color: "#8A8F95",
    marginTop: 4,
    fontSize: 13,
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
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A7AFB3",
    marginTop: 3,
  },
});