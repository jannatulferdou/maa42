import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const COLORS = {
  bg: "#F5FAF9",
  cardBg: "#FFFFFF",
  primary: "#32A99A",
  primaryDark: "#159B8D",
  primaryLight: "#DDF5F1",
  textDark: "#263238",
  textMuted: "#7A7F86",
  mutedDay: "#D2D8DA",
  border: "#CED9DD",
  deleteBtn: "#E83E48",
};

export default function ReminderScreen() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const [title, setTitle] = useState("");
  
  // Time Picker States
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [repeat, setRepeat] = useState<"Once" | "Daily" | "Weekly">("Once");
  const [alarm, setAlarm] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();

  const selectedFullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

  // Formatting Date Object to 12-hour AM/PM String
  const formatTimeToString = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  const formattedTimeString = useMemo(() => {
    return formatTimeToString(selectedTime);
  }, [selectedTime]);

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
        lightColor: COLORS.primary,
      });
    }
    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) {
      await Notifications.requestPermissionsAsync();
    }
  };

  const loadReminders = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) setReminders(JSON.parse(stored));
  };

  const saveToStorage = async (data: Reminder[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setReminders(data);
  };

  const parseReminderDate = (dateStr: string, timeObj: Date) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, timeObj.getHours(), timeObj.getMinutes(), 0);
  };

  const scheduleAlarm = async (reminder: Reminder, timeObj: Date) => {
    if (!reminder.alarm || Platform.OS === "web") return null;
    const triggerDate = parseReminderDate(reminder.date, timeObj);

    let trigger: Notifications.NotificationTriggerInput;
    if (reminder.repeat === "Daily") {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: triggerDate.getHours(), minute: triggerDate.getMinutes() };
    } else if (reminder.repeat === "Weekly") {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: triggerDate.getDay() + 1, hour: triggerDate.getHours(), minute: triggerDate.getMinutes() };
    } else {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate };
    }

    return await Notifications.scheduleNotificationAsync({
      content: { title: "Maa42 Reminder", body: reminder.title, sound: "default" },
      trigger,
    });
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
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, muted: true });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, muted: false });
    while (days.length % 7 !== 0) days.push({ day: days.length, muted: true });
    return days;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setSelectedDate(1);
  };

  const toggleRepeat = () => {
    setRepeat((prev) => (prev === "Once" ? "Daily" : prev === "Daily" ? "Weekly" : "Once"));
  };

  const resetForm = () => {
    setTitle("");
    setSelectedTime(new Date());
    setRepeat("Once");
    setAlarm(true);
    setEditingId(null);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleSaveReminder = async () => {
    if (!title.trim()) {
      Toast.show({ type: "error", text1: "Missing Title", text2: "Please enter reminder title." });
      return;
    }

    try {
      if (editingId) {
        const old = reminders.find((r) => r.id === editingId);
        await cancelAlarm(old?.notificationId);
        const updatedItem: Reminder = {
          id: editingId,
          title: title.trim(),
          date: selectedFullDate,
          time: formattedTimeString,
          repeat,
          alarm,
          notificationId: null,
        };
        updatedItem.notificationId = await scheduleAlarm(updatedItem, selectedTime);
        const list = reminders.map((r) => (r.id === editingId ? updatedItem : r));
        await saveToStorage(list);
        resetForm();
        Toast.show({ type: "success", text1: "Reminder Updated" });
        return;
      }

      const newR: Reminder = {
        id: Date.now().toString(),
        title: title.trim(),
        date: selectedFullDate,
        time: formattedTimeString,
        repeat,
        alarm,
        notificationId: null,
      };
      newR.notificationId = await scheduleAlarm(newR, selectedTime);
      await saveToStorage([newR, ...reminders]);
      resetForm();
      Toast.show({ type: "success", text1: "Reminder Saved" });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Reminder Error", text2: e.message });
    }
  };

  const handleEdit = (item: Reminder) => {
    const [y, m, d] = item.date.split("-").map(Number);
    setEditingId(item.id);
    setTitle(item.title);
    setRepeat(item.repeat);
    setAlarm(item.alarm);
    setCurrentYear(y);
    setCurrentMonth(m - 1);
    setSelectedDate(d);

    // Parse String back to Date Object for TimePicker
    const match = item.time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      let h = Number(match[1]);
      const min = Number(match[2]);
      const p = match[3].toUpperCase();
      if (p === "PM" && h !== 12) h += 12;
      if (p === "AM" && h === 12) h = 0;
      const tDate = new Date();
      tDate.setHours(h, min, 0);
      setSelectedTime(tDate);
    }
  };

  const handleDelete = (item: Reminder) => {
    Alert.alert("Delete Reminder", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await cancelAlarm(item.notificationId);
          const list = reminders.filter((r) => r.id !== item.id);
          await saveToStorage(list);
          if (editingId === item.id) resetForm();
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Top Header Section */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingText}>Good morning, {user?.name || "User"} 🌱</Text>
            <Text style={styles.mainTitle}>Plan your day</Text>
          </View>
          <Pressable style={styles.bellBtn} onPress={() => router.back()}>
            <Feather name="bell" size={20} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* Card 1: Today's Routine / Add Reminder Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>
            {editingId ? "Edit Reminder" : "Today's Routine"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Reminder title"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.row}>
            {/* Clock Trigger Pressable */}
            <Pressable style={styles.halfInput} onPress={() => setShowTimePicker(true)}>
              <Feather name="clock" size={18} color={COLORS.primary} />
              <Text style={styles.inputText}>{formattedTimeString}</Text>
            </Pressable>

            <Pressable style={styles.halfInput} onPress={toggleRepeat}>
              <Feather name="refresh-cw" size={18} color={COLORS.textMuted} />
              <Text style={styles.inputText}>{repeat}</Text>
              <Feather name="chevron-down" size={16} color={COLORS.textMuted} />
            </Pressable>
          </View>

          {/* Time Picker Modal/Dialog */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.alarmRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <MaterialCommunityIcons name="alarm" size={22} color={COLORS.textMuted} />
              <Text style={styles.alarmText}>Alarm</Text>
            </View>
            <Switch
              value={alarm}
              onValueChange={setAlarm}
              trackColor={{ false: "#D1D5DB", true: COLORS.primary }}
              thumbColor="#FFF"
            />
          </View>

          <Pressable style={styles.addBtn} onPress={handleSaveReminder}>
            <Feather name="plus" size={18} color={COLORS.primary} />
            <Text style={styles.addBtnText}>
              {editingId ? "Update Activity" : "Add Activity"}
            </Text>
          </Pressable>

          {editingId && (
            <Pressable onPress={resetForm} style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ color: COLORS.primaryDark, fontSize: 13, fontWeight: "700" }}>Cancel Edit</Text>
            </Pressable>
          )}
        </View>

        {/* Card 2: Calendar View */}
        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.arrow} onPress={handlePrevMonth}>
              <Feather name="chevron-left" size={20} color={COLORS.textDark} />
            </Pressable>
            <Text style={styles.monthTitle}>{monthNames[currentMonth]} {currentYear}</Text>
            <Pressable style={styles.arrow} onPress={handleNextMonth}>
              <Feather name="chevron-right" size={20} color={COLORS.textDark} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <Text key={i} style={styles.weekText}>{d}</Text>
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
                  <View style={[styles.dayCircle, active && styles.activeDayCircle]}>
                    <Text style={[styles.dayText, item.muted && styles.mutedText, active && styles.activeText]}>
                      {item.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Card 3: Upcoming Activities */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Upcoming Activities</Text>

          {reminders.length === 0 ? (
            <Text style={styles.emptyText}>No reminder added yet.</Text>
          ) : (
            reminders.map((item) => (
              <View key={item.id} style={styles.reminderRow}>
                <Pressable style={styles.checkIcon} onPress={() => handleEdit(item)}>
                  <MaterialCommunityIcons 
                    name={item.alarm ? "alarm" : "alarm-off"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </Pressable>

                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderSub}>{item.date} • {item.time} • {item.repeat}</Text>
                </View>

                <Pressable onPress={() => handleEdit(item)} style={{ padding: 4, marginRight: 4 }}>
                  <Feather name="edit-2" size={16} color={COLORS.primary} />
                </Pressable>
                
                <Pressable onPress={() => handleDelete(item)} style={{ padding: 4 }}>
                  <Feather name="trash-2" size={16} color={COLORS.deleteBtn} />
                </Pressable>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {user?.careStage === "pregnant" ? (
        <PregnantFooter activeTab="appointments" />
      ) : (
        <PostpartumFooter activeTab="reminder" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 120 },
  
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greetingText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "500" },
  mainTitle: { fontSize: 24, fontWeight: "800", color: COLORS.textDark, marginTop: 2 },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.cardBg, alignItems: "center", justifyContent: "center" },

  card: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: 18, marginBottom: 16 },
  cardHeaderTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, marginBottom: 14 },

  input: { height: 45, backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 11, paddingHorizontal: 16, fontSize: 15, color: COLORS.textDark, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  halfInput: { flex: 1, height: 48, backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 11, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 8 },
  inputText: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark },

  alarmRow: { height: 48, backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 11, paddingHorizontal: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  alarmText: { fontSize: 15, color: COLORS.textMuted, fontWeight: "700" },

  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 },
  addBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "800" },

  calendarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  arrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" },
  monthTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  weekRow: { flexDirection: "row", marginBottom: 10 },
  weekText: { width: "14.28%", textAlign: "center", color: COLORS.textMuted, fontSize: 13, fontWeight: "800" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayBox: { width: "14.28%", height: 36, alignItems: "center", justifyContent: "center" },
  dayCircle: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primaryLight },
  activeDayCircle: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 13, color: COLORS.textDark, fontWeight: "600" },
  mutedText: { color: COLORS.mutedDay, backgroundColor: "transparent" },
  activeText: { color: "#FFF", fontWeight: "800" },

  reminderRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.bg },
  checkIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center" },
  reminderTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark },
  reminderSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  emptyText: { color: COLORS.textMuted, fontSize: 13, fontWeight: "600" },
});