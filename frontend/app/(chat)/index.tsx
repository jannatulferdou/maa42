import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AIChat() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Feather name="star" size={30} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Sophia AI</Text>
          <Text style={styles.online}>Online •</Text>
        </View>

        <Pressable style={styles.historyBtn} onPress={() => router.push("/(chat)/history" as any)}>
          <Feather name="clock" size={24} color="#7A7F86" />
        </Pressable>
      </View>

      <View style={styles.line} />

      <View style={styles.chatArea}>
        <View style={styles.aiBubble}>
          <Text style={styles.bubbleText}>
            Hello Kaniz! I’m sophia, your AI care companion. How are you feeling today?
          </Text>
        </View>

        <View style={styles.userBubble}>
          <Text style={styles.userText}>I’m feeling headache.</Text>
        </View>

        <View style={styles.aiBubble}>
          <Text style={styles.bubbleText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          </Text>
        </View>
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
        />

        <Pressable style={styles.sendBtn}>
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
        active
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
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 27 },
  logo: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#32A99A", alignItems: "center", justifyContent: "center", marginRight: 12 },
  title: { fontSize: 19, fontWeight: "800", color: "#263238" },
  online: { color: "#149B55", fontSize: 13, fontWeight: "700", marginTop: 2 },
  historyBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff", borderWidth: 1, borderColor: "#D8E2E2", alignItems: "center", justifyContent: "center" },
  line: { height: 1, backgroundColor: "#CED9DD", marginHorizontal: 27, marginTop: 22 },
  chatArea: { flex: 1, paddingHorizontal: 43, paddingTop: 36 },
  aiBubble: { backgroundColor: "#DFF2EE", borderRadius: 14, padding: 16, marginBottom: 12, alignSelf: "flex-start", maxWidth: "100%" },
  userBubble: { backgroundColor: "#32A99A", borderRadius: 14, padding: 16, marginBottom: 12, alignSelf: "flex-end", minWidth: "92%" },
  bubbleText: { color: "#263238", fontSize: 15, lineHeight: 21 },
  userText: { color: "#fff", fontSize: 15 },
  warning: { height: 32, backgroundColor: "#FFF3E3", flexDirection: "row", alignItems: "center", paddingHorizontal: 18, gap: 8 },
  warningText: { fontSize: 11, color: "#6F747B" },
  inputRow: { height: 82, flexDirection: "row", alignItems: "center", paddingHorizontal: 27, gap: 12 },
  micBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F2F4F5", borderWidth: 1, borderColor: "#DDE4E4", alignItems: "center", justifyContent: "center" },
  input: { flex: 1, height: 48, borderRadius: 24, backgroundColor: "#EEF0F1", paddingHorizontal: 18, fontSize: 15 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#32A99A", alignItems: "center", justifyContent: "center" },
  bottomNav: { height: 72, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#E0E7E7", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 7 },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 11, fontWeight: "700", color: "#A7AFB3", marginTop: 3 },
});