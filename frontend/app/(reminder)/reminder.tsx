import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import PregnantFooter from "../(footer)/PregnantFooter";
import PostpartumFooter from "../(footer)/PostpartumFooter";
import useAuth from "@/hooks/useAuth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: "Once" | "Daily" | "Weekly";
  alarm: boolean;
  notificationId?: string | null;
};

const STORAGE_KEY = "maa42_reminders";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ReminderScreen() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [repeat, setRepeat] = useState<"Once" | "Daily" | "Weekly">("Once");
  const [alarm, setAlarm] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
 const { user } = useAuth();
  const selectedFullDate = `${currentYear}-${String(currentMonth + 1).padStart(
    2,
    "0"
  )}-${String(selectedDate).padStart(2, "0")}`;

  useEffect(() => {
    const setup = async () => {
      await setupNotifications();
      await loadReminders();
    };

    setup();
  }, []);

  const setupNotifications = async () => {
    if (Platform.OS === "web") return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#32A99A",
      });
    }

    const permission = await Notifications.getPermissionsAsync();

    if (!permission.granted) {
      const request = await Notifications.requestPermissionsAsync();

      if (!request.granted) {
        Toast.show({
          type: "error",
          text1: "Notification permission denied",
          text2: "Alarm notification will not work.",
          position: "top",
        });
      }
    }
  };

  const loadReminders = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  };

  const saveToStorage = async (data: Reminder[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setReminders(data);
  };

  const parseReminderDate = (date: string, timeText: string) => {
    const [year, month, day] = date.split("-").map(Number);

    const cleanTime = timeText.trim().toUpperCase();
    const match = cleanTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);

    if (!match) return null;

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3];

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, 0);
  };

  const scheduleAlarm = async (reminder: Reminder) => {
    if (!reminder.alarm || Platform.OS === "web") return null;

    const permission = await Notifications.getPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Notification permission is not granted.");
    }

    const triggerDate = parseReminderDate(reminder.date, reminder.time);

    if (!triggerDate) {
      throw new Error("Time format must be like 10:00 AM");
    }

    if (triggerDate <= new Date() && reminder.repeat === "Once") {
      throw new Error("Please select a future date and time.");
    }

    let trigger: Notifications.NotificationTriggerInput;

    if (reminder.repeat === "Daily") {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
      };
    } else if (reminder.repeat === "Weekly") {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: triggerDate.getDay() + 1,
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
      };
    } else {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Maa42 Reminder",
        body: reminder.title,
        sound: "default",
      },
      trigger,
    });

    return notificationId;
  };

  const cancelAlarm = async (notificationId?: string | null) => {
    if (!notificationId || Platform.OS === "web") return;

    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: { day: number; muted: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, muted: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, muted: false });
    }

    while (days.length % 7 !== 0) {
      days.push({ day: days.length, muted: true });
    }

    return days;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }

    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }

    setSelectedDate(1);
  };

  const toggleRepeat = () => {
    setRepeat((prev) => {
      if (prev === "Once") return "Daily";
      if (prev === "Daily") return "Weekly";
      return "Once";
    });
  };

  const resetForm = () => {
    setTitle("");
    setTime("10:00 AM");
    setRepeat("Once");
    setAlarm(true);
    setEditingId(null);
  };

  const handleSaveReminder = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Title",
        text2: "Please enter reminder title.",
        position: "top",
      });
      return;
    }

    if (!parseReminderDate(selectedFullDate, time)) {
      Toast.show({
        type: "error",
        text1: "Invalid Time",
        text2: "Use time like 10:00 AM",
        position: "top",
      });
      return;
    }

    try {
      if (editingId) {
        const oldReminder = reminders.find((item) => item.id === editingId);

        await cancelAlarm(oldReminder?.notificationId);

        const updatedReminder: Reminder = {
          id: editingId,
          title: title.trim(),
          date: selectedFullDate,
          time,
          repeat,
          alarm,
          notificationId: null,
        };

        const notificationId = await scheduleAlarm(updatedReminder);
        updatedReminder.notificationId = notificationId;

        const updated = reminders.map((item) =>
          item.id === editingId ? updatedReminder : item
        );

        await saveToStorage(updated);
        resetForm();

        Toast.show({
          type: "success",
          text1: "Reminder Updated",
          text2: `${updatedReminder.date} • ${updatedReminder.time}`,
          position: "top",
        });

        return;
      }

      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: title.trim(),
        date: selectedFullDate,
        time,
        repeat,
        alarm,
        notificationId: null,
      };

      const notificationId = await scheduleAlarm(newReminder);
      newReminder.notificationId = notificationId;

      const updated = [newReminder, ...reminders];

      await saveToStorage(updated);
      resetForm();

      Toast.show({
        type: "success",
        text1: "Reminder Saved",
        text2: `${newReminder.date} • ${newReminder.time}`,
        position: "top",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Reminder Error",
        text2: error.message || "Could not save reminder.",
        position: "top",
      });
    }
  };

  const handleEditReminder = (item: Reminder) => {
    const [year, month, day] = item.date.split("-").map(Number);

    setEditingId(item.id);
    setTitle(item.title);
    setTime(item.time);
    setRepeat(item.repeat);
    setAlarm(item.alarm);
    setCurrentYear(year);
    setCurrentMonth(month - 1);
    setSelectedDate(day);

    Toast.show({
      type: "info",
      text1: "Edit Mode",
      text2: "Update your reminder and save.",
      position: "top",
    });
  };

  const handleDeleteReminder = (item: Reminder) => {
    Alert.alert("Delete Reminder", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await cancelAlarm(item.notificationId);

          const updated = reminders.filter(
            (reminder) => reminder.id !== item.id
          );

          await saveToStorage(updated);

          if (editingId === item.id) resetForm();

          Toast.show({
            type: "success",
            text1: "Reminder Deleted",
            position: "top",
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>

          <Text style={styles.headerTitle}>Reminder</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarTop}>
            <Pressable style={styles.arrowBtn} onPress={handlePrevMonth}>
              <Feather name="chevron-left" size={22} color="#263238" />
            </Pressable>

            <Text style={styles.monthText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>

            <Pressable style={styles.arrowBtn} onPress={handleNextMonth}>
              <Feather name="chevron-right" size={22} color="#263238" />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <Text key={i} style={styles.weekText}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarDays.map((item, index) => {
              const active = !item.muted && item.day === selectedDate;

              return (
                <Pressable
                  key={index}
                  style={styles.dayBox}
                  disabled={item.muted}
                  onPress={() => setSelectedDate(item.day)}
                >
                  <View style={[styles.activeDay, active && styles.activeDayBg]}>
                    <Text
                      style={[
                        styles.dayText,
                        item.muted && styles.mutedDay,
                        active && styles.activeDayText,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Reminder title"
          placeholderTextColor="#7A7F86"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Feather name="clock" size={22} color="#7A7F86" />

            <TextInput
              style={styles.timeInput}
              value={time}
              onChangeText={setTime}
              placeholder="10:00 AM"
              placeholderTextColor="#7A7F86"
            />
          </View>

          <Pressable style={styles.halfInput} onPress={toggleRepeat}>
            <Feather name="refresh-cw" size={22} color="#7A7F86" />

            <Text style={styles.inputText}>{repeat}</Text>

            <Feather name="chevron-down" size={18} color="#7A7F86" />
          </Pressable>
        </View>

        <View style={styles.alarmBox}>
          <MaterialCommunityIcons name="alarm" size={26} color="#7A7F86" />

          <Text style={styles.alarmText}>Alarm</Text>

          <Switch
            value={alarm}
            onValueChange={setAlarm}
            trackColor={{ false: "#D1D5DB", true: "#32A99A" }}
            thumbColor="#fff"
          />
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSaveReminder}>
          <Text style={styles.saveText}>
            {editingId ? "Update Reminder" : "Save Reminder"}
          </Text>
        </Pressable>

        {editingId && (
          <Pressable style={styles.cancelBtn} onPress={resetForm}>
            <Text style={styles.cancelText}>Cancel Edit</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Upcoming reminder</Text>

        {reminders.length === 0 ? (
          <Text style={styles.emptyText}>No reminder added yet.</Text>
        ) : (
          reminders.map((item) => (
            <ReminderItem
              key={item.id}
              item={item}
              onEdit={() => handleEditReminder(item)}
              onDelete={() => handleDeleteReminder(item)}
            />
          ))
        )}
      </ScrollView>

      {user?.careStage === "pregnant" ? (
        <PregnantFooter activeTab="appointments" />
      ) : (
        <PostpartumFooter activeTab="reminder" />
      )}
    </View>
  );
}

function ReminderItem({
  item,
  onEdit,
  onDelete,
}: {
  item: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable style={styles.reminderCard} onPress={onEdit}>
      <View style={styles.reminderIconBox}>
        <MaterialCommunityIcons
          name={item.alarm ? "alarm" : "alarm-off"}
          size={25}
          color="#2FA99A"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.reminderTitle}>{item.title}</Text>

        <Text style={styles.reminderSubtitle}>
          {item.date} • {item.time} • {item.repeat}
        </Text>
      </View>

      <Pressable onPress={onEdit} style={styles.smallAction}>
        <Feather name="edit-2" size={19} color="#2FA99A" />
      </Pressable>

      <Pressable onPress={onDelete} style={styles.smallAction}>
        <Feather name="trash-2" size={20} color="#E83E48" />
      </Pressable>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: 42, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 34 },
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
    alignItems: "center",
    marginBottom: 13,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F5F6",
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#263238",
  },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekText: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "800",
    color: "#8A8F95",
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayBox: {
    width: "14.28%",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDay: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDayBg: { backgroundColor: "#32A99A" },
  dayText: { fontSize: 13, color: "#263238" },
  mutedDay: { color: "#D2D8DA" },
  activeDayText: { color: "#fff", fontWeight: "800" },
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
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
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
  timeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#7A7F86",
    outlineStyle: "none" as any,
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
  saveBtn: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#32A99A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  cancelBtn: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#32A99A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cancelText: {
    color: "#159B8D",
    fontSize: 15,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 12,
  },
  emptyText: {
    color: "#8A8F95",
    fontWeight: "600",
  },
  reminderCard: {
    minHeight: 72,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    paddingVertical: 12,
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
  smallAction: { padding: 8 },


});