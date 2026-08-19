import useAuth from "@/hooks/useAuth";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PostpartumFooter from "../(footer)/PostpartumFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Profile = {
  uid: string;
  name: string;
  email: string;
  careStage?: string | null;
  role?: string | null;
  dateOfBirth?: string | null;
  deliveryType?: string | null;
  postpartumDay?: number | null;
  emergencyContact?: string | null;
};

export default function PostpartumHome() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/(auth)/splash" as any);
      return;
    }
    fetchProfile();
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      if (!API_URL || !user?.uid) return;
      const res = await fetch(`${API_URL}/users/${user.uid}`);
      const data = await res.json();
      if (data?.success) setProfile(data.data);
    } catch (error) {
      console.log("Profile fetch error:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return <LoadingScreen />;
  }

  const name = profile?.name || user?.displayName || "Mother";
  const postpartumDay = profile?.postpartumDay || 0;
  const remainingDays = Math.max(42 - postpartumDay, 0);
  const progressPercent = Math.min((postpartumDay / 42) * 100, 100);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require("../../assets/images/icon.png")} style={styles.avatar} />
          <View style={styles.userBox}>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
          <Pressable style={styles.topIconBtn} onPress={() => router.push("/(notifications)" as any)}>
            <Feather name="bell" size={22} color="#263238" />
          </Pressable>
          <Pressable style={styles.topIconBtn} onPress={() => router.push("/(settings)" as any)}>
            <Feather name="settings" size={22} color="#263238" />
          </Pressable>
        </View>

        {/* RECOVERY JOURNEY */}
        <View style={styles.journeyCard}>
          <Text style={styles.journeySmall}>Recovery journey</Text>
          <Text style={styles.journeyTitle}>Day {postpartumDay} of 42</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.journeyText}>{remainingDays} days of postpartum care remaining</Text>
        </View>

        {/* TODAY STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconBox}>
            <Feather name="heart" size={25} color="#2FA99A" />
          </View>
          <View style={styles.statusTextBox}>
            <Text style={styles.statusSmall}>Todays health</Text>
            <Text style={styles.statusTitle}>Check your condition</Text>
          </View>
          <Pressable onPress={() => router.push("/(health)/checkin" as any)}>
            <Text style={styles.checkNow}>Check now</Text>
          </Pressable>
        </View>

        {/* EMERGENCY */}
        <Pressable style={styles.emergencyCard} onPress={() => router.push("/(help)/emergency" as any)}>
          <View style={styles.emergencyIconBox}>
            <Feather name="alert-triangle" size={25} color="#fff" />
          </View>
          <View style={styles.emergencyTextBox}>
            <Text style={styles.emergencyTitle}>Emergency Help</Text>
            <Text style={styles.emergencySub}>
              {profile?.emergencyContact || "Tap for immediate support"}
            </Text>
          </View>
          <Feather name="phone-call" size={25} color="#fff" />
        </Pressable>

        {/* CARE TOOLS */}
        <Text style={styles.sectionTitle}>Postpartum care</Text>
        <View style={styles.grid}>
          <ToolCard
            bg="#A8DCAD"
            iconBg="#CDEFD0"
            title="Health Check"
            icon={<MaterialCommunityIcons name="emoticon-happy-outline" size={27} color="#263238" />}
            onPress={() => router.push("/(health)/checkin" as any)}
          />
          <ToolCard
            bg="#E7C7DC"
            iconBg="#F2DBEA"
            title="Reminder"
            icon={<Feather name="bell" size={26} color="#263238" />}
            onPress={() => router.push("/(reminder)/reminder" as any)}
          />
          <ToolCard
            bg="#F4E8A6"
            iconBg="#FFF4C8"
            title="AI Chat"
            icon={<Ionicons name="chatbubble-outline" size={27} color="#263238" />}
            onPress={() => router.push("/(chat)" as any)}
          />
          <ToolCard
            bg="#9FC5DF"
            iconBg="#C9E0EF"
            title="Medical Profile"
            icon={<Feather name="file-text" size={26} color="#263238" />}
            onPress={() => router.push("/(profile)/medicalProfile" as any)}
          />
          <ToolCard
            bg="#FFF4E0"
            iconBg="#FFF8EC"
            title="Nutrition"
            icon={<MaterialCommunityIcons name="food-apple" size={27} color="#263238" />}
            onPress={() => router.push("/(nutrition)/postpartumNutrition" as any)}
          />
          <ToolCard
            bg="#D5F5E3"
            iconBg="#E8F8F0"
            title="Exercise"
            icon={<MaterialCommunityIcons name="yoga" size={27} color="#263238" />}
            onPress={() => router.push("/(exercise)/postpartumExercise" as any)}
          />
          <ToolCard
            bg="#FFD5D5"
            iconBg="#FFE8E8"
            title="Community"
            icon={<MaterialCommunityIcons name="account-group" size={27} color="#263238" />}
            onPress={() => router.push("/(community)/community" as any)}
          />
          <ToolCard
            bg="#FFE0E0"
            iconBg="#FFF0F0"
            title="Emergency"
            icon={<Feather name="phone" size={26} color="#263238" />}
            onPress={() => router.push("/(help)/emergency" as any)}
          />
        </View>
      </ScrollView>

      {/* DYNAMIC FOOTER */}
      <PostpartumFooter activeTab="home" />
    </View>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#32A99A" />
    </View>
  );
}

function ToolCard({ bg, iconBg, icon, title, onPress }: {
  bg: string;
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={[styles.toolCard, { backgroundColor: bg }]} onPress={onPress}>
      <View style={[styles.toolIconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.toolTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FAF9",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F5FAF9",
  },
  content: {
    paddingHorizontal: 27,
    paddingTop: 35,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2FA99A",
  },
  userBox: {
    flex: 1,
    marginLeft: 12,
  },
  welcome: {
    fontSize: 13,
    color: "#8A8F95",
    marginBottom: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#263238",
  },
  topIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D8E2E2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },
  journeyCard: {
    backgroundColor: "#32A99A",
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginBottom: 14,
  },
  journeySmall: {
    fontSize: 13,
    color: "#E7FFFB",
    marginBottom: 7,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 999,
    marginTop: 13,
    marginBottom: 9,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 999,
  },
  journeyText: {
    color: "#E7FFFB",
    fontSize: 13,
  },
  statusCard: {
    height: 73,
    backgroundColor: "#fff",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#BDE8E2",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  statusIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#DDF5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  statusTextBox: {
    flex: 1,
  },
  statusSmall: {
    fontSize: 13,
    color: "#8A8F95",
  },
  statusTitle: {
    marginTop: 3,
    color: "#263238",
    fontSize: 15,
    fontWeight: "800",
  },
  checkNow: {
    color: "#159B8D",
    fontSize: 13,
    fontWeight: "800",
  },
  emergencyCard: {
    height: 72,
    backgroundColor: "#E83E48",
    borderRadius: 13,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  emergencyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emergencyTextBox: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  emergencySub: {
    color: "#FFECEC",
    marginTop: 3,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  toolCard: {
    width: "48%",
    height: 94,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },
  toolIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#263238",
  },
});