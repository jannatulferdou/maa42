import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Msg = { id: number; role: string; content: string };

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !API_URL) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/chat/sessions/messages/${id}`);
        const json = await res.json();
        setMessages(json?.data ?? []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Conversation</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.light.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={item.role === "assistant" ? styles.aiBubble : styles.userBubble}
            >
              <Text
                style={item.role === "assistant" ? styles.bubbleText : styles.userText}
              >
                {item.content}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.light.background, paddingHorizontal: 27, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.light.white, alignItems: "center", justifyContent: "center" },
  headerTitle: { marginLeft: 12, fontSize: 20, fontWeight: "800", color: Colors.light.text },
  aiBubble: { backgroundColor: "#DFF2EE", borderRadius: 14, padding: 16, marginBottom: 12, alignSelf: "flex-start", maxWidth: "92%" },
  userBubble: { backgroundColor: Colors.light.primary, borderRadius: 14, padding: 16, marginBottom: 12, alignSelf: "flex-end", maxWidth: "92%" },
  bubbleText: { color: Colors.light.text, fontSize: 15, lineHeight: 21 },
  userText: { color: Colors.light.white, fontSize: 15, lineHeight: 21 },
});
