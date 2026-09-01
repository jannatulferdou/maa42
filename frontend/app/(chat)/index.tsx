import { Colors } from "@/constants/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useAuth from "@/hooks/useAuth";
import PostpartumFooter from "../(footer)/PostpartumFooter";
import PregnantFooter from "../(footer)/PregnantFooter";

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const WELCOME: Message = {
  id: "welcome",
  role: "ai",
  text: "Welcome to Maa42 🌸 I'm Sophia AI, your trusted maternal health companion. I can help monitor postpartum symptoms, assess potential risks, and guide you toward timely care. How are you feeling today?",
};

export default function AIChat() {
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [sending, setSending] = useState(false);
  const [thinkingText, setThinkingText] = useState("Sophia is thinking");

  const [messages, setMessages] = useState<Message[]>([WELCOME]);

  // Hydrate the current (still-active) session so reopening resumes the chat.
  useEffect(() => {
    if (!user?.uid || !API_URL) return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/chat/current/${user.uid}`);
        const json = await res.json();
        const history = json?.data?.messages ?? [];
        if (history.length) {
          setMessages(
            history.map((m: { role: string; content: string }, i: number) => ({
              id: `h-${i}`,
              role: m.role === "assistant" ? "ai" : "user",
              text: m.content,
            }))
          );
        }
      } catch {
        // Keep the welcome message on failure.
      }
    })();
  }, [user?.uid]);

  const updateMessage = (id: string, text: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    if (!API_URL || !user?.uid) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: "ai",
          text: "I can't reach the server right now. Please make sure you're logged in and try again.",
        },
      ]);
      return;
    }

    const userMessage = input.trim();
    const aiId = `${Date.now()}-ai`;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: userMessage },
      { id: aiId, role: "ai", text: "" },
    ]);
    setInput("");
    setSending(true);
    setThinking(true);

    let full = "";
    try {
      const res = await expoFetch(`${API_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, message: userMessage }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Network response was not ok");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            if (json.delta) {
              setThinking(false);
              full += json.delta;
              updateMessage(aiId, full);
            } else if (json.error) {
              throw new Error(json.error);
            }
          } catch {
            // Ignore non-JSON keep-alive lines.
          }
        }
      }

      if (!full.trim()) {
        updateMessage(
          aiId,
          "Sorry, I couldn't generate a response. Please try again."
        );
      }
    } catch {
      updateMessage(
        aiId,
        "Something went wrong reaching Sophia. Please check your connection and try again."
      );
    } finally {
      setThinking(false);
      setSending(false);
    }
  };

  useEffect(() => {
    if (!thinking) {
      setThinkingText("Sophia is thinking");
      return;
    }

    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setThinkingText("Sophia is thinking" + ".".repeat(dots));
    }, 500);

    return () => clearInterval(interval);
  }, [thinking]);

  const chatData = messages;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.logo}>
           <Image
    source={require("../../assets/images/fllower.png")}
    style={styles.logoImage}
    resizeMode="cover"
  />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Sophia AI</Text>
          <Text style={styles.online}>Online •</Text>
        </View>

        <Pressable
          style={styles.historyBtn}
          onPress={() => router.push("/(chat)/history" as any)}
        >
          <Feather name="clock" size={24} color={Colors.light.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.line} />

      <View style={styles.chatArea}>
        <FlatList
          data={chatData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={item.role === "ai" ? styles.aiBubble : styles.userBubble}
            >
              <Text
                style={item.role === "ai" ? styles.bubbleText : styles.userText}
              >
                {item.role === "ai" && item.text === ""
                  ? thinkingText
                  : item.text}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.warning}>
        <Feather name="shield" size={15} color={Colors.light.accent} />
        <Text style={styles.warningText}>
          For emergencies, use the emergency button or contact a health expert.
        </Text>
      </View>

      <View style={styles.inputRow}>
        <Pressable style={styles.micBtn}>
          <Feather name="mic" size={21} color={Colors.light.textSecondary} />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9AA0A6"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />

        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Feather name="send" size={22} color={Colors.light.white} />
        </Pressable>
      </View>
      {user?.careStage === "pregnant" ? (
      <PregnantFooter activeTab="chat" />
       ) : (
  <PostpartumFooter activeTab="chat" />
)}
     
    </View>
  );
}




const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 42 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 27,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  title: { fontSize: 19, fontWeight: "800", color: Colors.light.text },
  online: {
    color: "#149B55",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  historyBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: "#D8E2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    height: 1,
    backgroundColor: "#CED9DD",
    marginHorizontal: 27,
    marginTop: 22,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 27,
    paddingTop: 28,
  },
  aiBubble: {
    backgroundColor: "#DFF2EE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignSelf: "flex-start",
    maxWidth: "92%",
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignSelf: "flex-end",
    maxWidth: "92%",
  },
  bubbleText: { color: Colors.light.text, fontSize: 15, lineHeight: 21 },
  userText: { color: Colors.light.white, fontSize: 15, lineHeight: 21 },
  warning: {
    height: 32,
    backgroundColor: Colors.light.accentLight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 8,
  },
  warningText: { fontSize: 11, color: "#6F747B", flex: 1 },
  inputRow: {
    height: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 27,
    gap: 12,
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F4F5",
    borderWidth: 1,
    borderColor: "#DDE4E4",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF0F1",
    paddingHorizontal: 18,
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});