import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";

const { width } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Week-based baby illustration data
const WEEKLY_DATA: Record<number, {
  trimester: string;
  babySize: string;
  babyWeight: string;
  babyIcon: any;
  fruit: string;
  development: string;
  motherChanges: string;
  diet: string[];
  waterGoal: number;
  sleepNeeded: string;
  weightGain: string;
  tips: string[];
  watchOuts: string;
  babyImage: any; // Image source
  babyColor: string;
  babySizePercent: number;
}> = {
  4: {
    trimester: "First Trimester",
    babySize: "Sesame Seed",
    babyWeight: "< 1 gram",
    babyIcon: "seed-outline",
    fruit: "Sesame Seed",
    development: "Heart begins to beat. Neural tube forms.",
    motherChanges: "Morning sickness may start. Fatigue increases.",
    diet: ["Folic acid: leafy greens", "Vitamin B6: bananas"],
    waterGoal: 2.5,
    sleepNeeded: "9-10 hrs",
    weightGain: "0.5-1 kg",
    tips: ["Start prenatal vitamins daily", "Eat small frequent meals", "Avoid caffeine and alcohol"],
    watchOuts: "Avoid heavy lifting. Watch for severe nausea.",
    babyImage: require("../../assets/images/week4.png"),
    babyColor: "#FFE8E8",
    babySizePercent: 5,
  },
  8: {
    trimester: "First Trimester",
    babySize: "Raspberry",
    babyWeight: "1 gram",
    babyIcon: "baby-face-outline",
    fruit: "Raspberry",
    development: "All organs formed. Tiny fingers & toes develop.",
    motherChanges: "Breast tenderness. Mood swings.",
    diet: ["Iron-rich: spinach", "Protein: eggs, chicken"],
    waterGoal: 2.8,
    sleepNeeded: "9 hrs",
    weightGain: "1-2 kg",
    tips: ["Schedule first prenatal visit", "Gentle walking daily", "Stay hydrated always"],
    watchOuts: "Avoid raw meat. No smoking or alcohol.",
    babyImage: require("../../assets/images/week8.jpg"),
    babyColor: "#FFD4D4",
    babySizePercent: 10,
  },
  12: {
    trimester: "First Trimester",
    babySize: "Plum",
    babyWeight: "14 grams",
    babyIcon: "human-baby-changing-table",
    fruit: "Plum",
    development: "Fingernails form. Baby can kick and move.",
    motherChanges: "Belly starts showing. More energy returns.",
    diet: ["Calcium: milk, yogurt", "Omega-3: salmon"],
    waterGoal: 3.0,
    sleepNeeded: "8-9 hrs",
    weightGain: "2-3 kg",
    tips: ["Start Kegel exercises", "Buy maternity clothes", "Take progress photos"],
    watchOuts: "Avoid stress. Monitor blood pressure.",
    babyImage: require("../../assets/images/week12.webp"),
    babyColor: "#FFC8C8",
    babySizePercent: 15,
  },
  16: {
    trimester: "Second Trimester",
    babySize: "Avocado",
    babyWeight: "100 grams",
    babyIcon: "baby-carriage",
    fruit: "Avocado",
    development: "Can hear your voice. Facial expressions develop.",
    motherChanges: "Glowing skin. Less nausea. Increased appetite.",
    diet: ["Vitamin C: oranges", "Fiber: oats, brown rice"],
    waterGoal: 3.0,
    sleepNeeded: "8 hrs",
    weightGain: "3-5 kg",
    tips: ["Talk and sing to baby", "Start prenatal yoga", "Book anomaly scan"],
    watchOuts: "Watch for swelling. Regular checkups important.",
    babyImage: require("../../assets/images/week16.png"),
    babyColor: "#FFB8B8",
    babySizePercent: 25,
  },
  20: {
    trimester: "Second Trimester",
    babySize: "Banana",
    babyWeight: "300 grams",
    babyIcon: "baby-bottle-outline",
    fruit: "Banana",
    development: "Active movements. Hair begins to grow.",
    motherChanges: "Backache may start. Stretch marks appear.",
    diet: ["Protein: lean meat", "Iron: lentils, red meat"],
    waterGoal: 3.2,
    sleepNeeded: "8 hrs",
    weightGain: "5-7 kg",
    tips: ["Sleep on left side", "Use pregnancy belt", "Count baby kicks daily"],
    watchOuts: "Avoid standing too long. Rest frequently.",
    babyImage: require("../../assets/images/week20.jpg"),
    babyColor: "#FFA8A8",
    babySizePercent: 35,
  },
  24: {
    trimester: "Second Trimester",
    babySize: "Corn",
    babyWeight: "600 grams",
    babyIcon: "baby-bottle",
    fruit: "Ear of Corn",
    development: "Lungs developing. Taste buds form.",
    motherChanges: "Stretch marks visible. Braxton Hicks start.",
    diet: ["Vitamin E: nuts", "Magnesium: bananas, avocado"],
    waterGoal: 3.2,
    sleepNeeded: "8-9 hrs",
    weightGain: "7-9 kg",
    tips: ["Moisturize belly daily", "Glucose test this week", "Practice breathing exercises"],
    watchOuts: "Monitor fetal movements. Report any concerns.",
    babyImage: require("../../assets/images/week-24.webp"),
    babyColor: "#FF9898",
    babySizePercent: 45,
  },
  28: {
    trimester: "Third Trimester",
    babySize: "Eggplant",
    babyWeight: "1 kg",
    babyIcon: "baby",
    fruit: "Eggplant",
    development: "Eyes open. Brain develops rapidly.",
    motherChanges: "Shortness of breath. Frequent urination.",
    diet: ["DHA: salmon, walnuts", "Calcium: cheese, paneer"],
    waterGoal: 3.5,
    sleepNeeded: "8 hrs",
    weightGain: "9-11 kg",
    tips: ["Pack hospital bag", "Tour delivery room", "TDAP vaccine if needed"],
    watchOuts: "Watch for preterm labor signs. Rest well.",
    babyImage: require("../../assets/images/week 28.jpg"),
    babyColor: "#FF8888",
    babySizePercent: 55,
  },
  32: {
    trimester: "Third Trimester",
    babySize: "Pineapple",
    babyWeight: "1.7 kg",
    babyIcon: "human-pregnant",
    fruit: "Pineapple",
    development: "Bones hardening. Baby dreams now.",
    motherChanges: "Braxton Hicks regular. Pelvic pressure.",
    diet: ["Fiber: prunes, figs", "Iron: spinach, liver"],
    waterGoal: 3.5,
    sleepNeeded: "7-8 hrs",
    weightGain: "11-13 kg",
    tips: ["Finalize birth plan", "Pelvic floor exercises", "Install car seat"],
    watchOuts: "Avoid heavy lifting. Check baby position.",
    babyImage: require("../../assets/images/week 28.jpg"),
    babyColor: "#FF7878",
    babySizePercent: 65,
  },
  36: {
    trimester: "Third Trimester",
    babySize: "Romaine Lettuce",
    babyWeight: "2.6 kg",
    babyIcon: "baby-face",
    fruit: "Romaine Lettuce",
    development: "Lungs mature. Head down position ready.",
    motherChanges: "Waddling. Nesting instinct strong.",
    diet: ["Dates for labor prep", "Raspberry leaf tea"],
    waterGoal: 3.5,
    sleepNeeded: "7-8 hrs",
    weightGain: "13-15 kg",
    tips: ["Weekly doctor visits", "Perineal massage", "Keep phone charged always"],
    watchOuts: "Monitor contractions. Hospital bag ready.",
    babyImage: require("../../assets/images/week 28.jpg"),
    babyColor: "#FF6868",
    babySizePercent: 80,
  },
  40: {
    trimester: "Due Date!",
    babySize: "Watermelon",
    babyWeight: "3.5 kg",
    babyIcon: "baby-face-outline",
    fruit: "Watermelon",
    development: "Full term. Ready to meet you!",
    motherChanges: "Excitement and anticipation. Lightening.",
    diet: ["Energy foods", "Light easy meals"],
    waterGoal: 3.5,
    sleepNeeded: "Rest when possible",
    weightGain: "11-16 kg",
    tips: ["Trust your body", "Breathe and relax", "Contact doctor when ready"],
    watchOuts: "Track contractions. Water breaking signs.",
    babyImage: require("../../assets/images/week 28.jpg"),
    babyColor: "#FF5050",
    babySizePercent: 100,
  },
};

const getDefaultWeekData = (week: number) => ({
  trimester: week <= 12 ? "First Trimester" : week <= 24 ? "Second Trimester" : "Third Trimester",
  babySize: "Growing",
  babyWeight: `${(week * 0.1).toFixed(1)} kg`,
  babyIcon: "baby-face-outline",
  fruit: "Growing",
  development: "Baby is developing rapidly.",
  motherChanges: "Your body is adapting to pregnancy.",
  diet: ["Balanced diet", "Prenatal vitamins", "Stay hydrated"],
  waterGoal: 3.0,
  sleepNeeded: "8 hrs",
  weightGain: `${(week * 0.3).toFixed(0)}-${(week * 0.4).toFixed(0)} kg`,
  tips: ["Regular checkups important", "Stay active with walking", "Get enough rest"],
  watchOuts: "Monitor your health. Report any concerns.",
  babyImage: require("../../assets/images/week 28.jpg"),
  babyColor: "#FFD4D4",
  babySizePercent: Math.min((week / 40) * 100, 100),
});

const getWeekData = (week: number) => {
  const exact = WEEKLY_DATA[week];
  if (exact) return exact;
  
  const availableWeeks = Object.keys(WEEKLY_DATA).map(Number).sort((a, b) => a - b);
  const nearest = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  
  return { ...WEEKLY_DATA[nearest], ...getDefaultWeekData(week) };
};

// Baby Image Component with animation
function BabyImageComponent({ week, weekData }: { week: number; weekData: any }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const maxSize = width * 0.5;
  const minSize = 60;
  const babySize = minSize + (maxSize - minSize) * (weekData.babySizePercent / 100);

  useEffect(() => {
    opacityAnim.setValue(0);
    scaleAnim.setValue(0.3);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      floatAnim.stopAnimation();
    };
  }, [week]);

  return (
    <Animated.View
      style={[
        styles.babyImageContainer,
        {
          width: babySize,
          height: babySize,
          borderRadius: babySize / 2,
          backgroundColor: weekData.babyColor,
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <Image
        source={weekData.babyImage}
        style={{
          width: babySize * 0.85,
          height: babySize * 0.85,
          borderRadius: babySize / 2,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export default function PregnantHomeScreen() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(4);
  const [daysLeft, setDaysLeft] = useState(280);
  const [totalDays, setTotalDays] = useState(280);
  const [dueDate, setDueDate] = useState("Not set");
  const [waterCurrent, setWaterCurrent] = useState(1.5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!API_URL || !user?.uid) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/users/${user.uid}`);
      const data = await res.json();
      if (data?.success && data.data) {
        const week = data.data.pregnancyWeek || 4;
        const edd = data.data.expectedDeliveryDate;
        setCurrentWeek(week);
        if (edd) {
          setDueDate(edd);
          calculateDaysLeft(edd);
        }
      }
    } catch (error) {
      console.log("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (due: string) => {
    const dueDate = new Date(due);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays > 0 ? diffDays : 0);
    setTotalDays(280);
  };

  const weekData = getWeekData(currentWeek);
  const currentDay = 280 - daysLeft;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#8A8F95", fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#F5FAF9", "#E8F5F1", "#F5FAF9"]} style={styles.backgroundGradient} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.topBar}>
          <Text style={styles.smallLabel}>TODAY</Text>
          <Text style={styles.weekLabel}>Week {currentWeek}</Text>
        </View>

        <View style={styles.weekSelector}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
            const isToday = index === new Date().getDay() - 1 || index === 5;
            return (
              <View key={index} style={[styles.weekDayBox, isToday && styles.weekDayBoxActive]}>
                <Text style={[styles.weekDayText, isToday && styles.weekDayTextActive]}>{1 + index}</Text>
                <Text style={[styles.weekDayLabel, isToday && styles.weekDayLabelActive]}>{day}</Text>
                {isToday && <View style={styles.currentDayDot} />}
              </View>
            );
          })}
        </View>

        {/* BABY IMAGE SECTION */}
        <View style={styles.babyHeroContainer}>
          <BabyImageComponent week={currentWeek} weekData={weekData} />

          <View style={styles.heroInfo}>
            <Text style={styles.heroWeekText}>{currentWeek} Weeks</Text>
            <Text style={styles.heroDaysText}>{daysLeft} Days left</Text>
            <Text style={styles.heroSubText}>
              Size: {weekData.babySize} ({weekData.fruit})
            </Text>
            <Text style={styles.trimesterBadge}>{weekData.trimester}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My daily insights · Today</Text>

        <View style={styles.insightGrid}>
          <LinearGradient colors={["#A8DCAD", "#CDEFD0"]} style={styles.insightCard}>
            <Text style={styles.insightLabel}>Pregnancy day</Text>
            <Text style={styles.insightBigNumber}>{currentDay}</Text>
            <Text style={styles.insightSubText}>of {totalDays} days</Text>
          </LinearGradient>

          <LinearGradient colors={["#E7C7DC", "#F2DBEA"]} style={styles.insightCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.insightLabel}>Week {currentWeek}</Text>
            </View>
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="baby" size={24} color="#2FA99A" />
            </View>
            <Text style={styles.insightTitle}>Your baby</Text>
            <Text style={{ fontSize: 10, color: "#2FA99A", marginTop: 2 }}>{weekData.babyWeight}</Text>
          </LinearGradient>

          <LinearGradient colors={["#F4E8A6", "#FFF4C8"]} style={[styles.insightCard, { width: "100%", marginTop: 0 }]}>
            <Text style={styles.insightLabel}>Watch-outs</Text>
            <Text style={[styles.insightTitle, { fontSize: 14 }]}>{weekData.watchOuts}</Text>
          </LinearGradient>
        </View>

        <View style={styles.trackerContainer}>
          <Text style={styles.trackerTitle}>Essential Check-ins</Text>

          <View style={styles.trackerCard}>
            <View style={styles.trackerHeader}>
              <View style={styles.trackerIconBox}>
                <Feather name="droplet" size={22} color="#32A99A" />
              </View>
              <Text style={styles.trackerLabel}>Water Intake</Text>
              <Text style={styles.trackerValue}>{waterCurrent}L / {weekData.waterGoal}L</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min((waterCurrent / weekData.waterGoal) * 100, 100)}%`, backgroundColor: "#32A99A" }]} />
            </View>
            <Text style={styles.trackerHint}>Aim for {Math.round(weekData.waterGoal * 4)} glasses today! 💧</Text>
          </View>

          <View style={styles.rowTrackerContainer}>
            <View style={[styles.trackerCard, { flex: 1, marginRight: 8 }]}>
              <View style={styles.trackerHeader}>
                <View style={[styles.trackerIconBox, { backgroundColor: "#CDEFD0" }]}>
                  <Feather name="activity" size={22} color="#2FA99A" />
                </View>
                <Text style={styles.trackerLabel}>Weight</Text>
              </View>
              <Text style={styles.trackerBigValue}>{weekData.weightGain}</Text>
              <Text style={styles.trackerHint}>Target gain</Text>
            </View>

            <View style={[styles.trackerCard, { flex: 1, marginLeft: 8 }]}>
              <View style={styles.trackerHeader}>
                <View style={[styles.trackerIconBox, { backgroundColor: "#DDF5F1" }]}>
                  <Feather name="moon" size={22} color="#2FA99A" />
                </View>
                <Text style={styles.trackerLabel}>Sleep</Text>
              </View>
              <Text style={styles.trackerBigValue}>{weekData.sleepNeeded}</Text>
              <Text style={styles.trackerHint}>Recommended</Text>
            </View>
          </View>

          <View style={styles.trackerCard}>
            <View style={styles.trackerHeader}>
              <View style={[styles.trackerIconBox, { backgroundColor: "#F2DBEA" }]}>
                <MaterialCommunityIcons name="food-apple" size={22} color="#2FA99A" />
              </View>
              <Text style={styles.trackerLabel}>Todays Focus Diet</Text>
            </View>
            {weekData.diet.map((food, idx) => (
              <Text key={idx} style={styles.dietText}>🥗 {food}</Text>
            ))}
          </View>

          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Feather name="info" size={18} color="#32A99A" />
              <Text style={styles.tipsTitle}>Important Tips for Week {currentWeek}</Text>
            </View>
            {weekData.tips.map((tip, idx) => (
              <View key={idx} style={styles.tipRow}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
            
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E0E7E7" }}>
              <Text style={[styles.tipsTitle, { marginBottom: 8 }]}>Your Body This Week</Text>
              <Text style={styles.tipText}>{weekData.motherChanges}</Text>
            </View>

            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E0E7E7" }}>
              <Text style={[styles.tipsTitle, { marginBottom: 8 }]}>Babys Development</Text>
              <Text style={styles.tipText}>{weekData.development}</Text>
            </View>

            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E0E7E7" }}>
              <Text style={[styles.tipsTitle, { marginBottom: 8 }]}>Quick Info</Text>
              <Text style={styles.tipText}>📅 Trimester: {weekData.trimester}</Text>
              <Text style={styles.tipText}>📆 Due Date: {dueDate}</Text>
              <Text style={styles.tipText}>⏰ {daysLeft} days remaining</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FAF9", paddingTop: Platform.OS === "ios" ? 50 : 40 },
  backgroundGradient: { position: "absolute", top: 0, left: 0, right: 0, height: 500 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 27, marginBottom: 20 },
  smallLabel: { fontSize: 12, color: "#8A8F95", fontWeight: "600", letterSpacing: 1 },
  weekLabel: { fontSize: 16, fontWeight: "800", color: "#263238" },
  weekSelector: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 27, marginBottom: 30 },
  weekDayBox: { alignItems: "center", justifyContent: "center", width: 40, height: 60, borderRadius: 20 },
  weekDayBoxActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  weekDayText: { fontSize: 16, fontWeight: "700", color: "#8A8F95" },
  weekDayTextActive: { color: "#263238" },
  weekDayLabel: { fontSize: 10, color: "#8A8F95", marginTop: 4, fontWeight: "600" },
  weekDayLabelActive: { color: "#32A99A" },
  currentDayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#32A99A", marginTop: 6 },
  babyHeroContainer: { alignItems: "center", marginBottom: 30 },
  babyImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
  heroInfo: { marginTop: 24, alignItems: "center" },
  heroWeekText: { fontSize: 28, fontWeight: "800", color: "#263238" },
  heroDaysText: { fontSize: 16, color: "#7B8288", marginTop: 4 },
  heroSubText: { fontSize: 14, color: "#32A99A", fontWeight: "600", marginTop: 4 },
  trimesterBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#32A99A",
    backgroundColor: "#DDF5F1",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#263238", paddingHorizontal: 27, marginBottom: 16 },
  insightGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 27, gap: 10 },
  insightCard: { width: "48%", padding: 16, borderRadius: 16, minHeight: 110, justifyContent: "space-between" },
  insightLabel: { fontSize: 12, color: "#7B8288", fontWeight: "600" },
  insightBigNumber: { fontSize: 28, fontWeight: "800", color: "#263238" },
  insightSubText: { fontSize: 12, color: "#8A8F95", marginTop: -4 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  cardIconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", alignSelf: "flex-start", marginTop: 8 },
  insightTitle: { fontSize: 16, fontWeight: "700", color: "#263238", marginTop: 6 },
  trackerContainer: { paddingHorizontal: 27, marginTop: 20 },
  trackerTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 16 },
  trackerCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E0E7E7" },
  trackerHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  trackerIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#DDF5F1", alignItems: "center", justifyContent: "center", marginRight: 10 },
  trackerLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#263238" },
  trackerValue: { fontSize: 14, fontWeight: "700", color: "#32A99A" },
  trackerBigValue: { fontSize: 24, fontWeight: "800", color: "#263238" },
  progressBar: { height: 8, backgroundColor: "#E0E7E7", borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", borderRadius: 4 },
  trackerHint: { fontSize: 12, color: "#8A8F95", marginTop: 4 },
  rowTrackerContainer: { flexDirection: "row", marginBottom: 12 },
  dietText: { fontSize: 14, color: "#7B8288", lineHeight: 22, marginBottom: 4 },
  tipsContainer: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E0E7E7" },
  tipsHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  tipsTitle: { fontSize: 14, fontWeight: "700", color: "#263238", marginLeft: 8 },
  tipRow: { flexDirection: "row", marginBottom: 8 },
  bulletPoint: { fontSize: 16, color: "#32A99A", marginRight: 8 },
  tipText: { flex: 1, fontSize: 13, color: "#7B8288", lineHeight: 20 },
});