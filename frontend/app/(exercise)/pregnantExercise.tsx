import { Colors } from "@/constants/theme";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "@/hooks/useAuth";
import PregnantFooter from "../(footer)/PregnantFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_KEY = "maa42_exercise_pregnant";

type Exercise = {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: "Easy" | "Moderate";
  description: string;
  steps: string[];
  repetitions: string;
  safetyTips: string[];
  icon: any;
  color: string;
  bg: string;
  recommendedFor: string;
  videoUrl: string;
};

type ExerciseHistory = {
  id: string;
  exerciseName: string;
  duration: number;
  date: string;
  category: string;
};

const pregnantExercises: Exercise[] = [
  {
    id: "p1",
    name: "Deep Breathing",
    category: "Breathing",
    duration: 5,
    difficulty: "Easy",
    description: "Calm your mind and increase oxygen flow to your baby through diaphragmatic breathing.",
    steps: [
      "Sit comfortably with your back straight or lean against a support",
      "Place one hand on your chest and one on your belly",
      "Inhale slowly through your nose for 4 seconds",
      "Feel your belly expand gently under your lower hand",
      "Exhale gently through your mouth for 6 seconds",
      "Repeat for 5 minutes continuously",
    ],
    repetitions: "10-15 breaths",
    safetyTips: ["Don't hold your breath forcefully", "Stop if feeling lightheaded or dizzy"],
    icon: "air",
    color: Colors.light.primary,
    bg: Colors.light.primaryLight,
    recommendedFor: "All pregnancy stages",
    videoUrl: "https://www.youtube.com/watch?v=LCqxcKNImYw",
  },
  {
    id: "p2",
    name: "Cat-Cow Stretch",
    category: "Stretching",
    duration: 10,
    difficulty: "Easy",
    description: "Relieves lower back pain, opens chest muscles, and improves spine flexibility.",
    steps: [
      "Get on hands and knees in a tabletop position on a yoga mat",
      "Inhale, slowly drop belly towards floor, lift head gently (Cow pose)",
      "Exhale, gently round your back up toward ceiling, tuck chin (Cat pose)",
      "Move slowly and rhythmically between positions",
      "Keep movements gentle and aligned with your breath",
    ],
    repetitions: "10 rounds",
    safetyTips: ["Keep wrists directly under shoulders", "Don't arch your lower back too deeply"],
    icon: "cat",
    color: Colors.light.accent,
    bg: Colors.light.accentLight,
    recommendedFor: "Week 12 onwards",
    videoUrl: "https://www.youtube.com/watch?v=LympZqVz14s",
  },
  {
    id: "p3",
    name: "Pelvic Floor Squeeze",
    category: "Pelvic Floor",
    duration: 5,
    difficulty: "Easy",
    description: "Strengthens pelvic floor muscles (Kegels) for better support during labor and postpartum recovery.",
    steps: [
      "Sit comfortably on a chair or lie on your side",
      "Squeeze and lift your pelvic floor muscles (as if stopping urine flow)",
      "Hold the squeeze firmly for 5 seconds",
      "Completely relax the muscles for 10 seconds",
      "Repeat the contraction cycle smoothly",
    ],
    repetitions: "10 squeezes, 3 sets daily",
    safetyTips: ["Don't hold your breath while squeezing", "Keep abdomen, thighs, and buttocks relaxed"],
    icon: "yoga",
    color: "#9B59B6",
    bg: "#F3E5F5",
    recommendedFor: "All pregnancy stages",
    videoUrl: "https://www.youtube.com/watch?v=1HH4Rz6WKd8",
  },
  {
    id: "p4",
    name: "Gentle Walking",
    category: "Walking",
    duration: 20,
    difficulty: "Easy",
    description: "Low-impact cardiovascular exercise that keeps heart rate up safely throughout pregnancy.",
    steps: [
      "Wear comfortable supportive footwear",
      "Walk at a moderate pace where you can easily hold a conversation",
      "Swing arms naturally and maintain an upright posture",
      "Keep water nearby and sip regularly",
    ],
    repetitions: "20-30 minutes daily",
    safetyTips: ["Walk on flat, even surfaces", "Avoid walking in hot or humid conditions"],
    icon: "walk",
    color: Colors.light.primary,
    bg: Colors.light.primaryLight,
    recommendedFor: "All pregnancy stages",
    videoUrl: "https://www.youtube.com/watch?v=zmUJWKM98hM",
  },
  {
    id: "p5",
    name: "Prenatal Yoga Flow",
    category: "Prenatal Yoga",
    duration: 15,
    difficulty: "Moderate",
    description: "A series of gentle yoga poses designed to enhance hip mobility, body balance, and relaxation.",
    steps: [
      "Start with standing mountain pose focusing on posture",
      "Transition gently to wide-stance Warrior II pose",
      "Perform gentle side stretches using a wall or chair if needed",
      "Finish with gentle hip opening stretches on the mat",
    ],
    repetitions: "Hold each pose for 30 seconds",
    safetyTips: ["Avoid deep abdominal twists", "Use props, cushions, or wall support for balance"],
    icon: "yoga",
    color: "#9B59B6",
    bg: "#F3E5F5",
    recommendedFor: "Week 12 onwards",
    videoUrl: "https://www.youtube.com/watch?v=zmUJWKM98hM",
  },
  {
    id: "p6",
    name: "Upper Back Relief",
    category: "Back & Neck Relief",
    duration: 8,
    difficulty: "Easy",
    description: "Targeted shoulder and neck stretches to relieve tension caused by changes in pregnancy posture.",
    steps: [
      "Sit tall with shoulders relaxed and hands on lap",
      "Gently roll shoulders backward in full circles",
      "Slowly tilt head side-to-side towards shoulders",
      "Interlace fingers, stretch arms forward to open upper back",
    ],
    repetitions: "5-10 repetitions per movement",
    safetyTips: ["Keep movements slow and gentle", "Never force a stretch beyond comfort"],
    icon: "back-brace",
    color: Colors.light.accent,
    bg: Colors.light.accentLight,
    recommendedFor: "Week 20 onwards",
    videoUrl: "https://www.youtube.com/watch?v=4q1mbbOytuQ",
  },
];

const getWeekExercises = (week: number): Exercise[] => {
  if (week <= 12) {
    return pregnantExercises.filter(e => e.recommendedFor === "All pregnancy stages");
  } else if (week <= 24) {
    return pregnantExercises.filter(e => 
      e.recommendedFor === "All pregnancy stages" || 
      e.recommendedFor.includes("Week 12") ||
      e.recommendedFor.includes("Week 20")
    );
  }
  return pregnantExercises;
};

export default function PregnantExerciseScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState<string[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    fetchProfile();
    loadData();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fetchProfile = async () => {
    try {
      if (!API_URL || !user?.uid) return;
      const res = await fetch(`${API_URL}/users/${user.uid}`);
      const data = await res.json();
      if (data?.success) setProfile(data.data);
    } catch (error) {}
  };

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setHistory(data.history || []);
        setTodayMinutes(data.todayMinutes || 0);
        setWeeklyMinutes(data.weeklyMinutes || 0);
        setStreak(data.streak || 0);
        setCompletedCount(data.completedCount || 0);
        setTodayCompleted(data.todayCompleted || []);
      }
    } catch (error) {}
  };

  const saveData = async (newHistory?: ExerciseHistory[], newTodayCompleted?: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        history: newHistory || history,
        todayMinutes,
        weeklyMinutes,
        streak,
        completedCount,
        todayCompleted: newTodayCompleted || todayCompleted,
      }));
    } catch (error) {}
  };

  const openVideoTutorial = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open video link");
      }
    });
  };

  const pregnancyWeek = profile?.pregnancyWeek || 20;
  const exercises = getWeekExercises(pregnancyWeek);
  const categories = ["All", ...Array.from(new Set(exercises.map(e => e.category)))];
  const filteredExercises = selectedCategory === "All" ? exercises : exercises.filter(e => e.category === selectedCategory);
  const todayPlan = exercises.slice(0, 3);

  const startTimer = (duration: number) => {
    setTimerSeconds(duration * 60);
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerRunning(false);
          completeExercise(duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setSelectedExercise(null);
  };

  const completeExercise = (duration: number) => {
    if (selectedExercise) {
      const newHistory: ExerciseHistory = {
        id: Date.now().toString(),
        exerciseName: selectedExercise.name,
        duration,
        date: new Date().toISOString(),
        category: selectedExercise.category,
      };
      const updated = [...history, newHistory];
      const newTodayCompleted = [...todayCompleted, selectedExercise.id];
      setHistory(updated);
      setTodayMinutes(prev => prev + duration);
      setWeeklyMinutes(prev => prev + duration);
      setCompletedCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setTodayCompleted(newTodayCompleted);
      saveData(updated, newTodayCompleted);
      
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < todayPlan.length) {
        setCurrentExerciseIndex(nextIndex);
        Alert.alert(
          "✅ Complete!",
          `You completed ${selectedExercise.name}!\n\nNext: ${todayPlan[nextIndex].name}`,
          [
            { text: "Skip", onPress: () => setSelectedExercise(null) },
            { text: "Next Exercise", onPress: () => {
              setSelectedExercise(exercises.find(e => e.id === todayPlan[nextIndex].id) || null);
            }},
          ]
        );
      } else {
        Alert.alert("🎉 Amazing!", "You completed all exercises for today!");
        setSelectedExercise(null);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (selectedExercise && timerSeconds > 0) {
    return (
      <View style={styles.timerContainer}>
        <LinearGradient colors={[Colors.light.primary, Colors.light.primaryDark]} style={styles.timerGradient}>
          <MaterialCommunityIcons name={selectedExercise.icon} size={60} color={Colors.light.white} />
          <Text style={styles.timerTitle}>{selectedExercise.name}</Text>
          <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
          <Text style={styles.timerSubtext}>{selectedExercise.category}</Text>
          <View style={styles.timerControls}>
            {!isTimerRunning ? (
              <Pressable style={styles.timerBtn} onPress={() => startTimer(timerSeconds / 60)}>
                <Feather name="play" size={28} color={Colors.light.white} />
                <Text style={styles.timerBtnText}>Resume</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.timerBtn} onPress={pauseTimer}>
                <Feather name="pause" size={28} color={Colors.light.white} />
                <Text style={styles.timerBtnText}>Pause</Text>
              </Pressable>
            )}
            <Pressable style={[styles.timerBtn, styles.resetBtn]} onPress={resetTimer}>
              <Feather name="x" size={28} color={Colors.light.white} />
              <Text style={styles.timerBtnText}>End</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // EXERCISE DETAILS VIEW
  if (selectedExercise) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedExercise(null)}>
            <Feather name="chevron-left" size={34} color={Colors.light.text} />
          </Pressable>



          <Text style={styles.exerciseName}>{selectedExercise.name}</Text>
          <Text style={styles.exerciseCategory}>{selectedExercise.category}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="clock" size={18} color={Colors.light.primary} />
              <Text style={styles.infoText}>{selectedExercise.duration} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="bar-chart-2" size={18} color={Colors.light.primary} />
              <Text style={styles.infoText}>{selectedExercise.difficulty}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="users" size={18} color={Colors.light.primary} />
              <Text style={styles.infoText}>{selectedExercise.recommendedFor}</Text>
            </View>
          </View>

          {/* VIDEO TUTORIAL SECTION */}
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
          <Pressable 
            style={styles.videoCard} 
            onPress={() => openVideoTutorial(selectedExercise.videoUrl)}
          >
            <View style={styles.videoThumbnailContainer}>
              <LinearGradient colors={[Colors.light.text, "#37474F"]} style={styles.videoGradient}>
                <MaterialCommunityIcons name="youtube" size={48} color="#FF0000" />
                <Text style={styles.videoPlayText}>Watch Demonstration</Text>
                <View style={styles.playBadge}>
                  <Feather name="play" size={16} color={Colors.light.white} />
                  <Text style={styles.playBadgeText}>Play Video</Text>
                </View>
              </LinearGradient>
            </View>
          </Pressable>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{selectedExercise.description}</Text>

          <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          {selectedExercise.steps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{idx + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Repetitions</Text>
          <Text style={styles.repetitions}>{selectedExercise.repetitions}</Text>

          <Text style={styles.sectionTitle}>Safety Instructions</Text>
          {selectedExercise.safetyTips.map((tip, idx) => (
            <View key={idx} style={styles.safetyRow}>
              <Feather name="alert-triangle" size={16} color={Colors.light.accent} />
              <Text style={styles.safetyText}>{tip}</Text>
            </View>
          ))}

          <Pressable style={styles.startBtn} onPress={() => startTimer(selectedExercise.duration)}>
            <Feather name="play" size={24} color={Colors.light.white} />
            <Text style={styles.startBtnText}>Start Exercise</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // MAIN SCREEN VIEW
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>🤰 Pregnancy Exercise</Text>
        <Text style={styles.subtitle}>Safe exercises for Week {pregnancyWeek}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="clock" size={20} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{todayMinutes}</Text>
            <Text style={styles.statLabel}>Today (min)</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="calendar" size={20} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{weeklyMinutes}</Text>
            <Text style={styles.statLabel}>Weekly</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="zap" size={20} color={Colors.light.accent} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="check-circle" size={20} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>



        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <Pressable
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Exercises</Text>
        {filteredExercises.map(exercise => (
          <Pressable key={exercise.id} style={styles.exerciseCard} onPress={() => setSelectedExercise(exercise)}>
            <View style={[styles.exerciseIcon, { backgroundColor: exercise.bg }]}>
              <MaterialCommunityIcons name={exercise.icon} size={30} color={exercise.color} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>{exercise.category} • {exercise.duration} min</Text>
              <Text style={[styles.difficultyText, { color: exercise.color }]}>{exercise.difficulty}</Text>
            </View>
            <Feather name="chevron-right" size={22} color={Colors.light.textMuted} />
          </Pressable>
        ))}

        <View style={styles.warningCard}>
          <Feather name="alert-triangle" size={22} color={Colors.light.accent} />
          <Text style={styles.warningTitle}>Safety First!</Text>
          <Text style={styles.warningText}>
            Stop immediately if you experience:
            {"\n"}• Pain or discomfort
            {"\n"}• Dizziness or lightheadedness
            {"\n"}• Shortness of breath
            {"\n"}• Contractions
            {"\n"}• Vaginal bleeding or fluid leakage
          </Text>
        </View>

        {history.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Exercise History</Text>
            {history.slice(0, 10).map(item => (
              <View key={item.id} style={styles.historyRow}>
                <Feather name="check-circle" size={18} color={Colors.light.primary} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.historyText}>{item.exerciseName}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString()} • {item.category}
                  </Text>
                </View>
                <Text style={styles.historyDuration}>{item.duration} min</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      <PregnantFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingHorizontal: 27, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 120 },
  mainTitle: { fontSize: 24, fontWeight: "800", color: Colors.light.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.light.textMuted, marginBottom: 24 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statCard: { width: "23%", backgroundColor: Colors.light.white, borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 1, borderColor: Colors.light.border },
  statNumber: { fontSize: 20, fontWeight: "800", color: Colors.light.text, marginTop: 6 },
  statLabel: { fontSize: 10, color: Colors.light.textMuted, marginTop: 2, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Colors.light.text, marginBottom: 12, marginTop: 16 },
  planCard: { backgroundColor: Colors.light.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.light.border },
  planRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  planDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.light.primary, alignItems: "center", justifyContent: "center" },
  planDotDone: { backgroundColor: Colors.light.primary },
  planDotText: { color: Colors.light.white, fontWeight: "800", fontSize: 13 },
  planInfo: { flex: 1, marginLeft: 12 },
  planName: { fontSize: 14, fontWeight: "700", color: Colors.light.text },
  planNameDone: { textDecorationLine: "line-through", color: Colors.light.textMuted },
  planDuration: { fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  categoryScroll: { marginBottom: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border, marginRight: 8 },
  categoryChipActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  categoryText: { fontSize: 13, fontWeight: "600", color: Colors.light.textSecondary },
  categoryTextActive: { color: Colors.light.white },
  exerciseCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.white, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.light.border },
  exerciseIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  exerciseInfo: { flex: 1, marginLeft: 12 },
  exerciseTitle: { fontSize: 15, fontWeight: "800", color: Colors.light.text },
  exerciseMeta: { fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  difficultyText: { fontSize: 11, fontWeight: "700", marginTop: 4 },
  warningCard: { backgroundColor: Colors.light.accentLight, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: Colors.light.accent },
  warningTitle: { fontSize: 15, fontWeight: "800", color: Colors.light.accent, marginTop: 8 },
  warningText: { fontSize: 13, color: Colors.light.textSecondary, lineHeight: 20, marginTop: 8 },
  historyRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  historyText: { fontSize: 14, color: "#37474F", fontWeight: "600" },
  historyDate: { fontSize: 11, color: Colors.light.textMuted, marginTop: 2 },
  historyDuration: { fontSize: 13, fontWeight: "700", color: Colors.light.primary },
  detailContent: { paddingHorizontal: 27, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 120 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.light.white, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  exerciseHero: { width: "100%", height: 180, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  exerciseName: { fontSize: 24, fontWeight: "800", color: Colors.light.text, textAlign: "center" },
  exerciseCategory: { fontSize: 14, color: Colors.light.primary, fontWeight: "700", textAlign: "center", marginTop: 4 },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 16, marginBottom: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 13, color: "#37474F", fontWeight: "600" },
  videoCard: { width: "100%", height: 150, borderRadius: 16, overflow: "hidden", marginBottom: 16 },
  videoThumbnailContainer: { flex: 1 },
  videoGradient: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  videoPlayText: { color: Colors.light.white, fontWeight: "700", fontSize: 15, marginTop: 8 },
  playBadge: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginTop: 8 },
  playBadgeText: { color: Colors.light.white, fontSize: 12, fontWeight: "700" },
  description: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 22 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.light.primary, alignItems: "center", justifyContent: "center", marginRight: 10 },
  stepNumberText: { color: Colors.light.white, fontWeight: "800", fontSize: 13 },
  stepText: { flex: 1, fontSize: 14, color: "#37474F", lineHeight: 20 },
  repetitions: { fontSize: 15, fontWeight: "700", color: Colors.light.primary },
  safetyRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8, gap: 8 },
  safetyText: { flex: 1, fontSize: 13, color: Colors.light.textSecondary, lineHeight: 18 },
  startBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.light.primary, paddingVertical: 16, borderRadius: 12, gap: 10, marginTop: 24 },
  startBtnText: { color: Colors.light.white, fontSize: 17, fontWeight: "800" },
  timerContainer: { flex: 1, backgroundColor: Colors.light.background },
  timerGradient: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 27 },
  timerTitle: { fontSize: 22, fontWeight: "800", color: Colors.light.white, marginTop: 20 },
  timerText: { fontSize: 72, fontWeight: "800", color: Colors.light.white, marginTop: 20 },
  timerSubtext: { fontSize: 16, color: "#E7FFFB", marginTop: 10, marginBottom: 40 },
  timerControls: { flexDirection: "row", gap: 20 },
  timerBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, gap: 8 },
  resetBtn: { backgroundColor: "rgba(255,0,0,0.3)" },
  timerBtnText: { color: Colors.light.white, fontSize: 15, fontWeight: "700" },
});