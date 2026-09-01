import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { deleteUser, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { auth } from "@/config/firebase.config";
import useAuth from "@/hooks/useAuth";

const LANGUAGE_KEY = "maa42_language";
const NOTIFICATION_KEY = "maa42_notification_enabled";
const OFFLINE_SYNC_KEY = "maa42_offline_sync_enabled";

export default function SettingsScreen() {
  const { user, logoutUser } = useAuth();

  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (
    type: "success" | "error" | "info",
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 2500,
    });
  };

  const loadSettings = async () => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    const savedNotification = await AsyncStorage.getItem(NOTIFICATION_KEY);
    const savedOffline = await AsyncStorage.getItem(OFFLINE_SYNC_KEY);

    if (savedLanguage === "bn" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    if (savedNotification !== null) {
      setNotificationEnabled(savedNotification === "true");
    }

    if (savedOffline !== null) {
      setOfflineSyncEnabled(savedOffline === "true");
    }
  };

  const handleLanguageChange = async (lang: "en" | "bn") => {
    setLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);

    showToast(
      "success",
      "Language Updated",
      lang === "en" ? "English selected." : "বাংলা সিলেক্ট করা হয়েছে।"
    );
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationEnabled(value);
    await AsyncStorage.setItem(NOTIFICATION_KEY, String(value));

    showToast(
      "success",
      "Notification Settings",
      value ? "Notifications enabled." : "Notifications disabled."
    );
  };

  const handleOfflineToggle = async (value: boolean) => {
    setOfflineSyncEnabled(value);
    await AsyncStorage.setItem(OFFLINE_SYNC_KEY, String(value));

    showToast(
      "success",
      "Offline Sync",
      value ? "Offline sync enabled." : "Offline sync disabled."
    );
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      showToast("error", "No Email Found", "Please login again.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);

      showToast(
        "success",
        "Reset Email Sent",
        "Check your email to change password."
      );
    } catch (error: any) {
      showToast(
        "error",
        "Password Reset Failed",
        error.message || "Something went wrong."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();

            showToast("success", "Logged Out", "You have been logged out.");

            setTimeout(() => {
              router.replace("/(auth)/login" as any);
            }, 700);
          } catch (error: any) {
            showToast("error", "Logout Failed", error.message);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your Firebase account. Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;

              if (!currentUser) {
                showToast("error", "No User Found", "Please login again.");
                return;
              }

              await deleteUser(currentUser);

              showToast("success", "Account Deleted");

              setTimeout(() => {
                router.replace("/(auth)/register" as any);
              }, 700);
            } catch (error: any) {
              showToast(
                "error",
                "Delete Failed",
                "Please logout and login again before deleting account."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={34} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <SettingRow
          icon="user"
          label="Edit profile"
          onPress={() => router.push("/(profile)/editProfile" as any)}
        />

        <SettingRow
          icon="lock"
          label="Change password"
          onPress={handleChangePassword}
          last
        />
      </View>

      <View style={styles.card}>
        <View style={styles.languageHeader}>
          <Feather name="globe" size={23} color="#111827" />
          <Text style={styles.languageTitle}>Language</Text>
        </View>

        <View style={styles.langRow}>
          <Pressable
            style={[styles.langBtn, language === "en" && styles.langActive]}
            onPress={() => handleLanguageChange("en")}
          >
            <Text
              style={
                language === "en" ? styles.langActiveText : styles.langText
              }
            >
              English
            </Text>
          </Pressable>

          <Pressable
            style={[styles.langBtn, language === "bn" && styles.langActive]}
            onPress={() => handleLanguageChange("bn")}
          >
            <Text
              style={
                language === "bn" ? styles.langActiveText : styles.langText
              }
            >
              বাংলা
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <SettingSwitchRow
          icon="bell"
          label="Notification settings"
          value={notificationEnabled}
          onValueChange={handleNotificationToggle}
        />

        <SettingRow
          icon="shield"
          label="Privacy settings"
          onPress={() =>
            router.push("/(settings)/privacySettings" as any)
          }
        />

        <SettingSwitchRow
          icon="wifi"
          label="Offline sync settings"
          value={offlineSyncEnabled}
          onValueChange={handleOfflineToggle}
          last
        />
      </View>

      <Pressable style={styles.deleteCard} onPress={handleDeleteAccount}>
        <Feather name="trash-2" size={23} color={Colors.light.danger} />
        <Text style={styles.deleteText}>Delete account</Text>
        <Feather name="chevron-right" size={25} color={Colors.light.danger} />
      </Pressable>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Feather name="log-out" size={24} color={Colors.light.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  last,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={[styles.settingRow, last && styles.noBorder]}
      onPress={onPress}
    >
      <Feather name={icon} size={22} color="#111827" />
      <Text style={styles.settingText}>{label}</Text>
      <Feather name="chevron-right" size={25} color="#111827" />
    </Pressable>
  );
}

function SettingSwitchRow({
  icon,
  label,
  value,
  last,
  onValueChange,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: boolean;
  last?: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={[styles.settingRow, last && styles.noBorder]}>
      <Feather name={icon} size={22} color="#111827" />
      <Text style={styles.settingText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: Colors.light.primary }}
        thumbColor={Colors.light.white}
      />
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
    marginBottom: 32,
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
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 25,
  },
  settingRow: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.text,
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 14,
  },
  languageTitle: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.text,
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  langBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#E8EAED",
    alignItems: "center",
    justifyContent: "center",
  },
  langActive: {
    backgroundColor: Colors.light.primary,
  },
  langText: {
    color: Colors.light.textSecondary,
    fontWeight: "800",
    fontSize: 15,
  },
  langActiveText: {
    color: Colors.light.white,
    fontWeight: "800",
    fontSize: 15,
  },
  deleteCard: {
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  deleteText: {
    flex: 1,
    marginLeft: 12,
    color: Colors.light.danger,
    fontSize: 15,
    fontWeight: "800",
  },
  logoutBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FCE6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    color: Colors.light.danger,
    fontSize: 16,
    fontWeight: "800",
  },
});