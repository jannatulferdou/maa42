import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useAuth from "@/hooks/useAuth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Session = {
  id: number;
  title: string | null;
  createdAt: string;
  endedAt: string | null;
};

function dateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ChatHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.uid || !API_URL) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/chat/sessions/${user.uid}`);
        const json = await res.json();
        setSessions(json?.data ?? []);
      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.uid]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => (s.title ?? "").toLowerCase().includes(q));
  }, [sessions, search]);

  const groups = useMemo(() => {
    const map: Record<string, Session[]> = {};
    const order: string[] = [];
    for (const s of filtered) {
      const label = dateLabel(s.createdAt);
      if (!map[label]) {
        map[label] = [];
        order.push(label);
      }
      map[label].push(s);
    }
    return order.map((label) => ({ label, items: map[label] }));
  }, [filtered]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color="#263238" />
        </Pressable>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={24} color="#7A7F86" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#7A7F86"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color="#2FA99A" style={{ marginTop: 40 }} />
      ) : sessions.length === 0 ? (
        <Text style={styles.empty}>No conversations yet.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <View key={group.label}>
              <Text style={styles.date}>{group.label}</Text>
              {group.items.map((session) => (
                <Pressable
                  key={session.id}
                  style={styles.chatCard}
                  onPress={() =>
                    router.push(`/(chat)/session?id=${session.id}` as any)
                  }
                >
                  <View style={styles.chatIcon}>
                    <Feather name="message-circle" size={24} color="#2FA99A" />
                  </View>

                  <Text style={styles.chatTitle} numberOfLines={1}>
                    {session.title || "Conversation"}
                  </Text>

                  <Feather name="chevron-right" size={22} color="#A7AFB3" />
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9", paddingHorizontal: 27, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: "#263238" },
  searchBox: { height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#CFD8DC", backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 28 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  date: { fontSize: 14, fontWeight: "800", color: "#263238", marginBottom: 13, marginTop: 4 },
  chatCard: { height: 59, backgroundColor: "#fff", borderRadius: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 13 },
  chatIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#E1F7F3", alignItems: "center", justifyContent: "center", marginRight: 12 },
  chatTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: "#263238" },
  empty: { textAlign: "center", marginTop: 40, color: "#7A7F86", fontSize: 15 },
});
