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

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

type DoctorProfile = {
  name?: string;
  specialization?: string | null;
  hospitalClinic?: string | null;
  experienceYears?: number | null;
};

export default function DoctorHome() {
  const { user, loading } = useAuth();

  const [profile, setProfile] =
    useState<DoctorProfile | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(
        "/(auth)/splash" as any
      );
      return;
    }

    fetchProfile();
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `${API_URL}/users/${user?.uid}`
      );

      const data = await res.json();

      if (data?.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (
    loading ||
    profileLoading
  ) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#32A99A"
        />
      </View>
    );
  }

  const doctorName =
    profile?.name ||
    user?.displayName ||
    "Doctor";

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.avatar}
          />

          <View style={styles.userBox}>
            <Text style={styles.welcome}>
              Welcome back,
            </Text>

            <Text style={styles.name}>
              Dr. {doctorName}
            </Text>

            <Text
              style={styles.specialization}
            >
              {profile?.specialization ||
                "Healthcare Professional"}
            </Text>
          </View>

          <Pressable
            style={styles.topIconBtn}
            onPress={() =>
              router.push(
                "/(notifications)" as any
              )
            }
          >
            <Feather
              name="bell"
              size={22}
              color="#263238"
            />
          </Pressable>

          <Pressable
            style={styles.topIconBtn}
            onPress={() =>
              router.push(
                "/(settings)" as any
              )
            }
          >
            <Feather
              name="settings"
              size={22}
              color="#263238"
            />
          </Pressable>
        </View>

        {/* OVERVIEW */}

        <Text
          style={styles.sectionTitle}
        >
          Todays overview
        </Text>

        <View style={styles.statsRow}>
          <StatCard
            number="12"
            label="Patients"
            icon="users"
          />

          <StatCard
            number="5"
            label="Pregnant"
            icon="heart"
          />

          <StatCard
            number="7"
            label="Postpartum"
            icon="activity"
          />
        </View>

        {/* QUICK ACTIONS */}

        <Text
          style={styles.sectionTitle}
        >
          Quick actions
        </Text>

        <View style={styles.grid}>
          <ActionCard
            title="Patient List"
            bg="#A8DCAD"
            iconBg="#CDEFD0"
            icon={
              <Feather
                name="users"
                size={26}
                color="#263238"
              />
            }
          />

          <ActionCard
            title="Appointments"
            bg="#E7C7DC"
            iconBg="#F2DBEA"
            icon={
              <Feather
                name="calendar"
                size={26}
                color="#263238"
              />
            }
          />

          <ActionCard
            title="Health Reports"
            bg="#F4E8A6"
            iconBg="#FFF4C8"
            icon={
              <Feather
                name="file-text"
                size={26}
                color="#263238"
              />
            }
          />

          <ActionCard
            title="Messages"
            bg="#9FC5DF"
            iconBg="#C9E0EF"
            icon={
              <Ionicons
                name="chatbubble-outline"
                size={26}
                color="#263238"
              />
            }
          />
        </View>

        {/* EMERGENCY ALERT */}

        <Pressable
          style={styles.alertCard}
        >
          <View
            style={styles.alertIcon}
          >
            <Feather
              name="alert-triangle"
              size={25}
              color="#fff"
            />
          </View>

          <View
            style={styles.alertContent}
          >
            <Text
              style={styles.alertTitle}
            >
              Emergency Alerts
            </Text>

            <Text
              style={styles.alertText}
            >
              No critical alerts at this time
            </Text>
          </View>

          <Feather
            name="chevron-right"
            size={24}
            color="#fff"
          />
        </Pressable>

        {/* RECENT PATIENTS */}

        <Text
          style={styles.sectionTitle}
        >
          Recent patients
        </Text>

        <PatientCard
          name="Sarah Ahmed"
          status="Pregnant"
          detail="Week 28"
        />

        <PatientCard
          name="Ayesha Rahman"
          status="Postpartum"
          detail="Day 12"
        />

        <PatientCard
          name="Nusrat Jahan"
          status="Pregnant"
          detail="Week 34"
        />
      </ScrollView>

      {/* BOTTOM NAV */}

      <View style={styles.bottomNav}>
        <NavItem
          label="Home"
          featherIcon="home"
          active
        />

        <NavItem
          label="Patients"
          featherIcon="users"
        />

        <NavItem
          label="Messages"
          ionIcon="chatbubble-outline"
        />

        <NavItem
          label="Profile"
          featherIcon="user"
        />
      </View>
    </View>
  );
}

function StatCard({
  number,
  label,
  icon,
}: any) {
  return (
    <View style={styles.statCard}>
      <Feather
        name={icon}
        size={22}
        color="#2FA99A"
      />

      <Text
        style={styles.statNumber}
      >
        {number}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </View>
  );
}

function ActionCard({
  title,
  bg,
  iconBg,
  icon,
}: any) {
  return (
    <Pressable
      style={[
        styles.actionCard,
        {
          backgroundColor: bg,
        },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: iconBg,
          },
        ]}
      >
        {icon}
      </View>

      <Text
        style={styles.actionTitle}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function PatientCard({
  name,
  status,
  detail,
}: any) {
  return (
    <Pressable
      style={styles.patientCard}
    >
      <View
        style={styles.patientAvatar}
      >
        <Feather
          name="user"
          size={22}
          color="#2FA99A"
        />
      </View>

      <View
        style={styles.patientContent}
      >
        <Text
          style={styles.patientName}
        >
          {name}
        </Text>

        <Text
          style={styles.patientStatus}
        >
          {status} • {detail}
        </Text>
      </View>

      <Feather
        name="chevron-right"
        size={22}
        color="#8A8F95"
      />
    </Pressable>
  );
}

function NavItem({
  label,
  featherIcon,
  ionIcon,
  active,
}: any) {
  const color = active
    ? "#2FA99A"
    : "#A7AFB3";

  return (
    <Pressable
      style={styles.navItem}
    >
      {featherIcon && (
        <Feather
          name={featherIcon}
          size={23}
          color={color}
        />
      )}

      {ionIcon && (
        <Ionicons
          name={ionIcon}
          size={23}
          color={color}
        />
      )}

      <Text
        style={[
          styles.navLabel,
          {
            color,
          },
        ]}
      >
        {label}
      </Text>
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
    marginBottom: 28,
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

  specialization: {
    color: "#2FA99A",
    fontSize: 12,
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#263238",
    marginBottom: 12,
    marginTop: 5,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 13,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8E2E2",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#263238",
    marginTop: 8,
  },

  statLabel: {
    fontSize: 11,
    color: "#8A8F95",
    marginTop: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 25,
  },

  actionCard: {
    width: "48%",
    height: 95,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    color: "#263238",
    fontWeight: "800",
    fontSize: 14,
  },

  alertCard: {
    height: 72,
    backgroundColor: "#E83E48",
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  alertContent: {
    flex: 1,
  },

  alertTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  alertText: {
    color: "#FFECEC",
    fontSize: 12,
    marginTop: 3,
  },

  patientCard: {
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E7E7",
  },

  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DDF5F1",
    alignItems: "center",
    justifyContent: "center",
  },

  patientContent: {
    flex: 1,
    marginLeft: 12,
  },

  patientName: {
    color: "#263238",
    fontSize: 15,
    fontWeight: "800",
  },

  patientStatus: {
    color: "#8A8F95",
    fontSize: 12,
    marginTop: 3,
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E0E7E7",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
});