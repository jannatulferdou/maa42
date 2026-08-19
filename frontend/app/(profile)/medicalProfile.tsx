import useAuth from "@/hooks/useAuth";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Toast from "react-native-toast-message";
import PostpartumFooter from "../(footer)/PostpartumFooter";
import PregnantFooter from "../(footer)/PregnantFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Profile = {
  uid: string;
  name: string;
  email: string;
  profileImage?: string | null;
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
  dateOfBirth?: string | null;
  childbirthDate?: string | null;
  deliveryType?: string | null;
  postpartumDay?: number | null;
  previousComplications?: string | null;
  existingHealthConditions?: string | null;
  currentMedicines?: string | null;
  doctor?: string | null;
  clinic?: string | null;
  emergencyContact?: string | null;
};

export default function ProfileScreen() {
  const { user, loading, logoutUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/(auth)/login" as any);
      return;
    }

    fetchProfile();
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      if (!API_URL || !user?.uid) return;

      const res = await fetch(`${API_URL}/users/${user.uid}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Profile fetch failed");
      }

      setProfile(data.data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Profile Error",
        text2: error.message || "Could not load profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      Toast.show({
        type: "success",
        text1: "Logout Successful",
        text2: "See you again!",
      });

      router.replace("/(auth)/login" as any);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message || "Something went wrong",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2FA99A" />
      </View>
    );
  }

  const profileData = [
    ["Full Name", profile?.name || "Not added"],
    ["Age", profile?.age ? String(profile.age) : "Not added"],
    ["Blood group", profile?.bloodGroup || "Not added"],
    ["Date of birth", profile?.dateOfBirth || "Not added"],
    ["Childbirth date", profile?.childbirthDate || "Not added"],
    ["Delivery Type", profile?.deliveryType || "Not added"],
    [
      "Days after childbirth",
      profile?.postpartumDay !== null &&
      profile?.postpartumDay !== undefined
        ? String(profile.postpartumDay)
        : "Not added",
    ],
    ["Previous complications", profile?.previousComplications || "None"],
    ["Existing health conditions", profile?.existingHealthConditions || "None"],
    ["Current medicines", profile?.currentMedicines || "None"],
    ["Doctor", profile?.doctor || "Not added"],
    ["Clinic", profile?.clinic || "Not added"],
    ["Emergency contact", profile?.emergencyContact || "Not added"],
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={
              profile?.profileImage
                ? { uri: profile.profileImage }
                : require("../../assets/images/maa42-logo.png")
            }
            style={styles.avatar}
          />

          <View style={styles.userBox}>
            <Text style={styles.name}>{profile?.name || "Mother"}</Text>
            <Text style={styles.meta}>
              {profile?.age ? `${profile.age}y` : "Age not added"} •{" "}
              {profile?.gender || "Gender not added"}
            </Text>
          </View>

          <Pressable
            style={styles.circleBtn}
            onPress={() => router.push("/(notifications)/index" as any)}
          >
            <Feather name="bell" size={22} color="#111827" />
          </Pressable>

          <Pressable
            style={styles.circleBtn}
            onPress={() => router.push("/(settings)/index" as any)}
          >
            <Feather name="settings" size={22} color="#111827" />
          </Pressable>
        </View>

        <View style={styles.card}>
          {profileData.map(([label, value], index) => (
            <View
              key={label}
              style={[
                styles.row,
                index === profileData.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.settingsBtn}
          onPress={() => router.push("/(profile)/editProfile" as any)}
        >
          <Feather name="edit-2" size={23} color="#2FA99A" />
          <Text style={styles.settingsText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.settingsBtn, { marginTop: 12 }]}
          onPress={() => router.push("/(settings)/index" as any)}
        >
          <Feather name="settings" size={25} color="#2FA99A" />
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>

        {/* Logout Button */}
        <Pressable
          style={[styles.settingsBtn, styles.logoutBtn]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      {user?.careStage === "pregnant" ? (
        <PregnantFooter activeTab="profile" />
      ) : (
        <PostpartumFooter activeTab="profile" />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    alignItems: "center",
    justifyContent: "center",
  },
  screen: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: 35, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 34 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2FA99A",
  },
  userBox: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: "800", color: "#263238" },
  meta: { fontSize: 13, color: "#7A7F86", marginTop: 4 },
  circleBtn: {
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 28,
  },
  row: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E0E0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: { flex: 1, fontSize: 15, color: "#7A7F86" },
  value: {
    flex: 1,
    fontSize: 15,
    color: "#263238",
    fontWeight: "800",
    textAlign: "right",
  },
  settingsBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2FA99A",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  settingsText: {
    color: "#2FA99A",
    fontSize: 17,
    fontWeight: "800",
  },
  logoutBtn: {
    marginTop: 12,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 17,
    fontWeight: "800",
  },

});