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
import PregnantFooter from "../(footer)/PregnantFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Profile = {
  name?: string;
  pregnancyWeek?: number | null;
  expectedDeliveryDate?: string | null;
  emergencyContact?: string | null;
};

export default function PregnantHome() {
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
      const res = await fetch(`${API_URL}/users/${user?.uid}`);
      const data = await res.json();
      if (data?.success) setProfile(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#32A99A" />
      </View>
    );
  }

  const name = profile?.name || user?.displayName || "Mother";
  const week = profile?.pregnancyWeek || 0;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require("../../assets/images/maa42-logo.png")} style={styles.avatar} />
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

        {/* PREGNANCY JOURNEY */}
        <View style={styles.pregnancyCard}>
          <Text style={styles.cardSmall}>Your pregnancy journey</Text>
          <Text style={styles.weekTitle}>Week {week}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min((week / 40) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.cardText}>Keep monitoring your health and pregnancy progress.</Text>
        </View>

        {/* TODAY STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Feather name="heart" size={24} color="#2FA99A" />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusSmall}>Todays health</Text>
            <Text style={styles.statusTitle}>Check your condition</Text>
          </View>
          <Pressable onPress={() => router.push("/(health)/checkin" as any)}>
            <Text style={styles.checkNow}>Check now</Text>
          </Pressable>
        </View>

        {/* EMERGENCY */}
        <Pressable style={styles.emergencyCard} onPress={() => router.push("/(help)/emergency" as any)}>
          <View style={styles.emergencyIcon}>
            <Feather name="alert-triangle" size={25} color="#fff" />
          </View>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Emergency Help</Text>
            <Text style={styles.emergencyText}>Get immediate support</Text>
          </View>
          <Feather name="phone-call" size={24} color="#fff" />
        </Pressable>

        {/* CARE TOOLS */}
        <Text style={styles.sectionTitle}>Pregnancy care</Text>
        <View style={styles.grid}>
          <ToolCard
            title="Health Check"
            bg="#A8DCAD"
            iconBg="#CDEFD0"
            icon={<MaterialCommunityIcons name="heart-pulse" size={27} color="#263238" />}
            onPress={() => router.push("/(health)/checkin" as any)}
          />
          <ToolCard
            title="Reminder"
            bg="#E7C7DC"
            iconBg="#F2DBEA"
            icon={<Feather name="bell" size={26} color="#263238" />}
            onPress={() => router.push("/(reminder)/reminder" as any)}
          />
          <ToolCard
            title="AI Chat"
            bg="#F4E8A6"
            iconBg="#FFF4C8"
            icon={<Ionicons name="chatbubble-outline" size={27} color="#263238" />}
            onPress={() => router.push("/(chat)" as any)}
          />
          <ToolCard
            title="Pregnancy Profile"
            bg="#9FC5DF"
            iconBg="#C9E0EF"
            icon={<Feather name="file-text" size={26} color="#263238" />}
            onPress={() => router.push("/(profile)/medicalProfile" as any)}
          />
          <ToolCard
            title="Calendar"
            bg="#FFD5D5"
            iconBg="#FFE8E8"
            icon={<Feather name="calendar" size={26} color="#263238" />}
            onPress={() => router.push("/(calender)/pregencyCalender" as any)}
          />
          <ToolCard
            title="Nutrition"
            bg="#FFF4E0"
            iconBg="#FFF8EC"
            icon={<MaterialCommunityIcons name="food-apple" size={27} color="#263238" />}
            onPress={() => router.push("/(nutrition)/pregnantNutrition" as any)}
          />
          <ToolCard
            title="Exercise"
            bg="#D5F5E3"
            iconBg="#E8F8F0"
            icon={<MaterialCommunityIcons name="yoga" size={27} color="#263238" />}
            onPress={() => router.push("/(exercise)/pregnantExercise" as any)}
          />
          <ToolCard
            title="Community"
            bg="#F0E6FF"
            iconBg="#F5F0FF"
            icon={<MaterialCommunityIcons name="account-group" size={27} color="#263238" />}
            onPress={() => router.push("/(community)/community" as any)}
          />
        </View>
      </ScrollView>

      {/* DYNAMIC FOOTER */}
      <PregnantFooter activeTab="home" />
    </View>
  );
}

function ToolCard({ title, bg, iconBg, icon, onPress }: {
  title: string;
  bg: string;
  iconBg: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={[styles.toolCard, { backgroundColor: bg }]} onPress={onPress}>
      <View style={[styles.toolIcon, { backgroundColor: iconBg }]}>{icon}</View>
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
    padding: 27,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  userBox: {
    flex: 1,
    marginLeft: 12,
  },
  welcome: {
    color: "#8A8F95",
    fontSize: 13,
  },
  name: {
    color: "#263238",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 3,
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
  pregnancyCard: {
    backgroundColor: "#32A99A",
    borderRadius: 15,
    padding: 22,
    marginBottom: 15,
  },
  cardSmall: {
    color: "#E7FFFB",
    fontSize: 13,
  },
  weekTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 10,
    marginVertical: 14,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardText: {
    color: "#E7FFFB",
    fontSize: 13,
  },
  statusCard: {
    height: 72,
    backgroundColor: "#fff",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#BDE8E2",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#DDF5F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusSmall: {
    color: "#8A8F95",
    fontSize: 13,
  },
  statusTitle: {
    color: "#263238",
    fontWeight: "800",
    marginTop: 3,
  },
  checkNow: {
    color: "#159B8D",
    fontWeight: "800",
    fontSize: 13,
  },
  emergencyCard: {
    height: 72,
    backgroundColor: "#E83E48",
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  emergencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  emergencyText: {
    color: "#FFECEC",
    fontSize: 13,
    marginTop: 3,
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
    height: 95,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toolTitle: {
    color: "#263238",
    fontWeight: "800",
    fontSize: 14,
  },
});