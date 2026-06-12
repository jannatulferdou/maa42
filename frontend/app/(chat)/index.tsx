import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
};

export default function AIChat() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState(
  "Sophia is thinking"
);
  const [questionCount, setQuestionCount] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Welcome to Maa42 🌸 I'm Sophia AI, your trusted maternal health companion. I can help monitor postpartum symptoms, assess potential risks, and guide you toward timely care. How are you feeling today?",
    },
  ]);

  const getAIResponse = (message: string) => {
    const text = message.toLowerCase();

    if (text.includes("headache")) {
      return "Headache can be common after childbirth, but if it is severe, persistent, or comes with blurred vision, swelling, or dizziness, please contact a healthcare provider.";
    }

    if (text.includes("fever")) {
      return "Fever may indicate an infection. Please monitor your temperature and contact a doctor or health worker if it continues.";
    }

    if (text.includes("bleeding")) {
      return "Heavy bleeding is a maternal danger sign. Please seek urgent medical care or contact your emergency support immediately.";
    }

    if (text.includes("pain")) {
      return "Pain can happen during recovery, but severe or increasing pain should be checked by a healthcare provider.";
    }

    if (text.includes("sad") || text.includes("cry")) {
      return "Feeling emotional after childbirth can happen. If sadness continues or feels overwhelming, please talk to a trusted person or healthcare provider.";
    }

    return null;
  };

  const handleSend = () => {
    if (!input.trim() || thinking) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    const aiAnswer = getAIResponse(userMessage);

    if (!aiAnswer) {
      setThinking(true);
      return;
    }

    const count = questionCount + 1;
    setQuestionCount(count);

    const reply = {
      id: `${Date.now()}-ai`,
      role: "ai" as const,
      text: aiAnswer,
    };

    if (count >= 3) {
      setThinking(true);

      setTimeout(() => {
        setThinking(false);
        setMessages((prev) => [...prev, reply]);
      }, 2000);
    } else {
      setMessages((prev) => [...prev, reply]);
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

    setThinkingText(
      "Sophia is thinking" + ".".repeat(dots)
    );
  }, 500);

  return () => clearInterval(interval);
}, [thinking]);

 const chatData = thinking
  ? [
      ...messages,
      {
        id: "thinking",
        role: "ai" as const,
        text: thinkingText,
      },
    ]
  : messages;

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
          <Feather name="clock" size={24} color="#7A7F86" />
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
                {item.text}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.warning}>
        <Feather name="shield" size={15} color="#F5A623" />
        <Text style={styles.warningText}>
          For emergencies, use the emergency button or contact a health expert.
        </Text>
      </View>

      <View style={styles.inputRow}>
        <Pressable style={styles.micBtn}>
          <Feather name="mic" size={21} color="#7A7F86" />
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
          <Feather name="send" size={22} color="#fff" />
        </Pressable>
      </View>

      <BottomNav />
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <NavItem
        label="Health"
        icon="emoticon-happy-outline"
        onPress={() => router.push("/checkin" as any)}
      />

      <NavItem
        label="Reminder"
        featherIcon="bell"
        onPress={() => router.push("/reminder" as any)}
      />

      <NavItem
        label="Home"
        featherIcon="home"
        onPress={() => router.push("/" as any)}
      />

      <NavItem
        label="Chat"
        ionIcon="chatbubble-outline"
        active
        onPress={() => router.push("/(chat)" as any)}
      />

      <NavItem
        label="Profile"
        featherIcon="file-text"
        onPress={() => router.push("/(profile)" as any)}
      />
    </View>
  );
}

function NavItem({
  label,
  icon,
  featherIcon,
  ionIcon,
  active,
  onPress,
}: {
  label: string;
  icon?: any;
  featherIcon?: any;
  ionIcon?: any;
  active?: boolean;
  onPress?: () => void;
}) {
  const color = active ? "#2FA99A" : "#A7AFB3";

  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      {icon && <MaterialCommunityIcons name={icon} size={23} color={color} />}
      {featherIcon && <Feather name={featherIcon} size={23} color={color} />}
      {ionIcon && <Ionicons name={ionIcon} size={23} color={color} />}

      <Text style={[styles.navLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF9", paddingTop: 42 },
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
  title: { fontSize: 19, fontWeight: "800", color: "#263238" },
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
    backgroundColor: "#fff",
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
    backgroundColor: "#32A99A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignSelf: "flex-end",
    maxWidth: "92%",
  },
  bubbleText: { color: "#263238", fontSize: 15, lineHeight: 21 },
  userText: { color: "#fff", fontSize: 15, lineHeight: 21 },
  warning: {
    height: 32,
    backgroundColor: "#FFF3E3",
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
    backgroundColor: "#32A99A",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E0E7E7",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 7,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
});