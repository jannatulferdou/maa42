import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type NotificationItem = {
  id: number;
  userId: number;
  title: string;
  subtitle: string;
  type?: string | null;
  isRead: boolean;
  createdAt: string;
};

const USER_ID = 1; // পরে logged in user id বসাবেন

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getIcon = (type?: string | null) => {
    if (type === "alert") return "alert-circle";
    if (type === "checkup") return "calendar";
    if (type === "emergency") return "phone";
    if (type === "completed") return "check-square";
    return "bell";
  };

  const getColor = (type?: string | null) => {
    if (type === "alert") return { bg: "#FFECEF", color: Colors.light.danger };
    if (type === "checkup") return { bg: "#FFF1DF", color: Colors.light.accent };
    if (type === "emergency") return { bg: "#FFECEF", color: Colors.light.danger };
    if (type === "completed") return { bg: "#E8F8EE", color: "#35B66A" };
    return { bg: "#E1F7F3", color: Colors.light.primary };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/notifications/${USER_ID}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load notifications");
      }

      setNotifications(data.data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch {
      Alert.alert("Error", "Failed to update notification");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch {
      Alert.alert("Error", "Failed to delete notification");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color={Colors.light.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications found</Text>
          ) : (
            notifications.map((item) => {
              const theme = getColor(item.type);

              return (
                <Pressable
                  key={item.id}
                  style={styles.wrapper}
                  onPress={() => markAsRead(item.id)}
                  onLongPress={() =>
                    Alert.alert(
                      "Delete notification?",
                      "Are you sure you want to delete this notification?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteNotification(item.id),
                        },
                      ]
                    )
                  }
                >
                  {!item.isRead && <View style={styles.activeLine} />}

                  <View style={styles.card}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: theme.bg },
                      ]}
                    >
                      <Feather
                        name={getIcon(item.type) as any}
                        size={23}
                        color={theme.color}
                      />
                    </View>

                    <View style={styles.textBox}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.subtitle}>{item.subtitle}</Text>
                    </View>

                    <Text style={styles.time}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    backgroundColor: Colors.light.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.text,
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
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  card: {
    minHeight: 72,
    borderRadius: 10,
    backgroundColor: Colors.light.white,
    paddingHorizontal: 13,
    paddingVertical: 12,
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
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.light.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  time: {
    color: "#6F747B",
    fontSize: 11,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.light.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
});