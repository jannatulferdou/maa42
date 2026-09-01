import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "maa42_privacy_settings";

export default function PrivacyScreen() {
  const [doctorAccess, setDoctorAccess] = useState(true);
  const [emergencyAccess, setEmergencyAccess] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const data = JSON.parse(stored);

        setDoctorAccess(data.doctorAccess);
        setEmergencyAccess(data.emergencyAccess);
        setOfflineSync(data.offlineSync);
        setChatHistory(data.chatHistory);
        setAnalytics(data.analytics);
      }
    } catch {}
  };

  const saveSettings = async (updated: any) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  const updateSetting = async (
    key: string,
    value: boolean
  ) => {
    const updated = {
      doctorAccess,
      emergencyAccess,
      offlineSync,
      chatHistory,
      analytics,
      [key]: value,
    };

    await saveSettings(updated);

    Toast.show({
      type: "success",
      text1: "Privacy Updated",
      position: "top",
    });
  };

  const exportData = () => {
    Toast.show({
      type: "success",
      text1: "Export Started",
      text2: "Preparing your health data.",
    });
  };

  const clearLocalData = () => {
    Alert.alert(
      "Delete Local Data",
      "Remove all local saved data?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();

            Toast.show({
              type: "success",
              text1: "Local Data Deleted",
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather
              name="chevron-left"
              size={30}
              color={Colors.light.text}
            />
          </Pressable>

          <Text style={styles.title}>
            Privacy Settings
          </Text>
        </View>

        <View style={styles.card}>
          <SettingRow
            title="Share Health Data with Doctor"
            value={doctorAccess}
            onChange={(v) => {
              setDoctorAccess(v);
              updateSetting("doctorAccess", v);
            }}
          />

          <SettingRow
            title="Emergency Contact Access"
            value={emergencyAccess}
            onChange={(v) => {
              setEmergencyAccess(v);
              updateSetting("emergencyAccess", v);
            }}
          />

          <SettingRow
            title="Offline Sync"
            value={offlineSync}
            onChange={(v) => {
              setOfflineSync(v);
              updateSetting("offlineSync", v);
            }}
          />

          <SettingRow
            title="AI Chat History"
            value={chatHistory}
            onChange={(v) => {
              setChatHistory(v);
              updateSetting("chatHistory", v);
            }}
          />

          <SettingRow
            title="Analytics & Crash Reports"
            value={analytics}
            onChange={(v) => {
              setAnalytics(v);
              updateSetting("analytics", v);
            }}
          />
        </View>

        <Pressable
          style={styles.actionBtn}
          onPress={exportData}
        >
          <Feather
            name="download"
            size={20}
            color={Colors.light.primary}
          />
          <Text style={styles.actionText}>
            Export My Data
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteBtn}
          onPress={clearLocalData}
        >
          <Feather
            name="trash-2"
            size={20}
            color={Colors.light.danger}
          />
          <Text style={styles.deleteText}>
            Delete Local Data
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  title,
  value,
  onChange,
}: {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>
        {title}
      </Text>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: "#D1D5DB",
          true: Colors.light.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    padding: 27,
    paddingTop: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.white,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginLeft: 12,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
  },

  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  row: {
    minHeight: 65,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },

  actionBtn: {
    height: 55,
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },

  actionText: {
    color: Colors.light.primary,
    fontWeight: "800",
    fontSize: 16,
  },

  deleteBtn: {
    height: 55,
    backgroundColor: "#FDEBEC",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  deleteText: {
    color: Colors.light.danger,
    fontWeight: "800",
    fontSize: 16,
  },
});