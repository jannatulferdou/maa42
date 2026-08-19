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
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "@/hooks/useAuth";
import PostpartumFooter from "../(footer)/PostpartumFooter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_KEY = "maa42_exercise_postpartum";

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

const postpartumExercises: Exercise[] = [
  {
    id: "pp1",
    name: "Diaphragmatic Breathing",
    category: "Breathing",
    duration: 5,
    difficulty: "Easy",
    description: "Deep breathing to reduce stress, improve oxygen flow, and aid postpartum recovery.",
    steps: [
      "Lie comfortably on your back with knees bent",
      "Place one hand on your belly and one on chest",
      "Inhale deeply through nose for 4 seconds",
      "Feel belly rise gently under your hand",
      "Exhale slowly through mouth for 6 seconds",
    ],
    repetitions: "10 breaths, 3 times daily",
    safetyTips: ["Comfortable position", "Stop if dizzy or lightheaded"],
    icon: "air",
    color: "#32A99A",
    bg: "#DDF5F1",
    recommendedFor: "Day 1 onwards",
    videoUrl: "https://www.youtube.com/watch?v=LCqxcKNImYw",
  },
  {
    id: "pp2",
    name: "Kegel Exercises",
    category: "Pelvic Floor",
    duration: 5,
    difficulty: "Easy",
    description: "Essential for pelvic floor recovery and bladder control after childbirth.",
    steps: [
      "Identify pelvic floor muscles (as if stopping urine flow)",
      "Contract muscles upward and inward gently",
      "Hold for 5 seconds while breathing normally",
      "Relax completely for 10 seconds",
      "Repeat the cycle as prescribed",
    ],
    repetitions: "10 reps, 3 sets daily",
    safetyTips: ["Start after doctor approval", "Don't overdo in initial days"],
    icon: "yoga",
    color: "#9B59B6",
    bg: "#F3E5F5",
    recommendedFor: "Day 3 onwards",
    videoUrl: "https://www.youtube.com/watch?v=1HH4Rz6WKd8",
  },
  {
    id: "pp3",
    name: "Gentle Walking",
    category: "Walking",
    duration: 10,
    difficulty: "Easy",
    description: "Short walks to improve blood circulation, mood, and overall recovery.",
    steps: [
      "Start with 5-10 minute easy walks indoors",
      "Maintain slow, steady comfortable pace",
      "Focus on good upright posture",
      "Gradually increase duration as strength returns",
      "Rest whenever needed",
    ],
    repetitions: "2-3 times daily",
    safetyTips: ["Listen to your body", "Avoid stairs initially"],
    icon: "walk",
    color: "#2FA99A",
    bg: "#DDF5F1",
    recommendedFor: "Day 7 onwards",
    videoUrl: "https://www.youtube.com/watch?v=zmUJWKM98hM",
  },
  {
    id: "pp4",
    name: "Postpartum Recovery Stretch",
    category: "Postpartum Recovery",
    duration: 10,
    difficulty: "Easy",
    description: "Gentle full-body stretches to ease muscle tension and promote healing.",
    steps: [
      "Lie on back with knees bent, feet flat",
      "Perform gentle pelvic tilts slowly",
      "Bring knees toward chest one at a time",
      "Stretch arms overhead and breathe deeply",
      "Add gentle neck and shoulder stretches",
    ],
    repetitions: "Hold each stretch 20-30 seconds",
    safetyTips: ["Avoid if C-section (wait 6 weeks)", "Stop if pain increases"],
    icon: "yoga",
    color: "#F5A623",
    bg: "#FFF3E0",
    recommendedFor: "Day 14 onwards",
    videoUrl: "https://www.youtube.com/watch?v=4q1mbbOytuQ",
  },
  {
    id: "pp5",
    name: "Bridge Pose",
    category: "Postpartum Recovery",
    duration: 8,
    difficulty: "Moderate",
    description: "Strengthens core, glutes, and lower back safely after childbirth.",
    steps: [
      "Lie on back with knees bent and feet flat",
      "Keep arms by sides with palms down",
      "Lift hips toward ceiling slowly",
      "Hold position for 5 seconds",
      "Lower back down with control",
    ],
    repetitions: "10 repetitions",
    safetyTips: ["Wait 6 weeks after C-section", "Keep movements controlled and slow"],
    icon: "yoga",
    color: "#9B59B6",
    bg: "#F3E5F5",
    recommendedFor: "Week 4 onwards",
    videoUrl: "https://www.youtube.com/watch?v=LympZqVz14s",
  },
  {
    id: "pp6",
    name: "Neck & Shoulder Relief",
    category: "Back & Neck Relief",
    duration: 5,
    difficulty: "Easy",
    description: "Targeted stretches to relieve tension from breastfeeding and baby care.",
    steps: [
      "Sit or stand comfortably with shoulders relaxed",
      "Perform slow neck rolls (5 times each side)",
      "Shoulder shrugs up and down (10 times)",
      "Gentle ear-to-shoulder stretch each side",
      "Hold each side for 20 seconds",
    ],
    repetitions: "2-3 times daily",
    safetyTips: ["Keep movements slow", "Relax jaw while stretching"],
    icon: "back-brace",
    color: "#F5A623",
    bg: "#FFF3E0",
    recommendedFor: "Day 1 onwards",
    videoUrl: "https://www.youtube.com/watch?v=4q1mbbOytuQ",
  },
];

const getPostpartumExercises = (day: number): Exercise[] => {
  if (day <= 7) {
    return postpartumExercises.filter(e => e.recommendedFor === "Day 1 onwards" || e.recommendedFor === "Day 3 onwards");
  } else if (day <= 14) {
    return postpartumExercises.filter(e => !e.recommendedFor.includes("Week 4"));
  }
  return postpartumExercises;
};

export default function PostpartumExerciseScreen() {
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

  const postpartumDay = profile?.postpartumDay || 14;
  const exercises = getPostpartumExercises(postpartumDay);
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
        <LinearGradient colors={["#32A99A", "#159B8D"]} style={styles.timerGradient}>
          <MaterialCommunityIcons name={selectedExercise.icon} size={60} color="#fff" />
          <Text style={styles.timerTitle}>{selectedExercise.name}</Text>
          <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
          <Text style={styles.timerSubtext}>{selectedExercise.category}</Text>
          <View style={styles.timerControls}>
            {!isTimerRunning ? (
              <Pressable style={styles.timerBtn} onPress={() => startTimer(timerSeconds / 60)}>
                <Feather name="play" size={28} color="#fff" />
                <Text style={styles.timerBtnText}>Resume</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.timerBtn} onPress={pauseTimer}>
                <Feather name="pause" size={28} color="#fff" />
                <Text style={styles.timerBtnText}>Pause</Text>
              </Pressable>
            )}
            <Pressable style={[styles.timerBtn, styles.resetBtn]} onPress={resetTimer}>
              <Feather name="x" size={28} color="#fff" />
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
            <Feather name="chevron-left" size={34} color="#263238" />
          </Pressable>

          <Text style={styles.exerciseName}>{selectedExercise.name}</Text>
          <Text style={styles.exerciseCategory}>{selectedExercise.category}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="clock" size={18} color="#32A99A" />
              <Text style={styles.infoText}>{selectedExercise.duration} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="bar-chart-2" size={18} color="#32A99A" />
              <Text style={styles.infoText}>{selectedExercise.difficulty}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="users" size={18} color="#32A99A" />
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
              <LinearGradient colors={["#263238", "#37474F"]} style={styles.videoGradient}>
                <MaterialCommunityIcons name="youtube" size={48} color="#FF0000" />
                <Text style={styles.videoPlayText}>Watch Demonstration</Text>
                <View style={styles.playBadge}>
                  <Feather name="play" size={16} color="#FFFFFF" />
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
              <Feather name="alert-triangle" size={16} color="#F5A623" />
              <Text style={styles.safetyText}>{tip}</Text>
            </View>
          ))}

          <Pressable style={styles.startBtn} onPress={() => startTimer(selectedExercise.duration)}>
            <Feather name="play" size={24} color="#fff" />
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
        <Text style={styles.mainTitle}>👶 Postpartum Exercise</Text>
        <Text style={styles.subtitle}>Gentle recovery exercises for Day {postpartumDay}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="clock" size={20} color="#32A99A" />
            <Text style={styles.statNumber}>{todayMinutes}</Text>
            <Text style={styles.statLabel}>Today (min)</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="calendar" size={20} color="#32A99A" />
            <Text style={styles.statNumber}>{weeklyMinutes}</Text>
            <Text style={styles.statLabel}>Weekly</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="zap" size={20} color="#F5A623" />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="check-circle" size={20} color="#2FA99A" />
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Todays Plan</Text>
        <View style={styles.planCard}>
          {todayPlan.map((plan, idx) => {
            const isDone = todayCompleted.includes(plan.id);
            return (
              <View key={plan.id} style={styles.planRow}>
                <View style={[styles.planDot, isDone && styles.planDotDone]}>
                  <Text style={styles.planDotText}>{isDone ? "✓" : idx + 1}</Text>
                </View>
                <View style={styles.planInfo}>
                  <Text style={[styles.planName, isDone && styles.planNameDone]}>{plan.name}</Text>
                  <Text style={styles.planDuration}>{plan.duration} min</Text>
                </View>
                {isDone ? (
                  <Feather name="check-circle" size={20} color="#2FA99A" />
                ) : (
                  <Pressable onPress={() => {
                    const ex = exercises.find(e => e.id === plan.id);
                    if (ex) setSelectedExercise(ex);
                  }}>
                    <Feather name="play-circle" size={24} color="#32A99A" />
                  </Pressable>
                )}
              </View>
            );
          })}
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
            <Feather name="chevron-right" size={22} color="#8A8F95" />
          </Pressable>
        ))}

        <View style={styles.warningCard}>
          <Feather name="alert-triangle" size={22} color="#F5A623" />
          <Text style={styles.warningTitle}>Safety First!</Text>
          <Text style={styles.warningText}>
            Stop immediately if you experience:
            {"\n"}• Pain or discomfort
            {"\n"}• Dizziness or lightheadedness
            {"\n"}• Shortness of breath
            {"\n"}• Excessive bleeding
            {"\n"}• Fever or chills
            {"\n"}• Wound opening (C-section)
          </Text>
        </View>

        {history.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Exercise History</Text>
            {history.slice(0, 10).map(item => (
              <View key={item.id} style={styles.historyRow}>
                <Feather name="check-circle" size={18} color="#2FA99A" />
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
      <PostpartumFooter  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FAF9" },
  content: { paddingHorizontal: 27, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 120 },
  mainTitle: { fontSize: 24, fontWeight: "800", color: "#263238", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#8A8F95", marginBottom: 24 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statCard: { width: "23%", backgroundColor: "#FFFFFF", borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#E0E7E7" },
  statNumber: { fontSize: 20, fontWeight: "800", color: "#263238", marginTop: 6 },
  statLabel: { fontSize: 10, color: "#8A8F95", marginTop: 2, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#263238", marginBottom: 12, marginTop: 16 },
  planCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#E0E7E7" },
  planRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  planDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#32A99A", alignItems: "center", justifyContent: "center" },
  planDotDone: { backgroundColor: "#2FA99A" },
  planDotText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  planInfo: { flex: 1, marginLeft: 12 },
  planName: { fontSize: 14, fontWeight: "700", color: "#263238" },
  planNameDone: { textDecorationLine: "line-through", color: "#8A8F95" },
  planDuration: { fontSize: 12, color: "#8A8F95", marginTop: 2 },
  categoryScroll: { marginBottom: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E0E7E7", marginRight: 8 },
  categoryChipActive: { backgroundColor: "#32A99A", borderColor: "#32A99A" },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#7B8288" },
  categoryTextActive: { color: "#FFFFFF" },
  exerciseCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#E0E7E7" },
  exerciseIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  exerciseInfo: { flex: 1, marginLeft: 12 },
  exerciseTitle: { fontSize: 15, fontWeight: "800", color: "#263238" },
  exerciseMeta: { fontSize: 12, color: "#8A8F95", marginTop: 2 },
  difficultyText: { fontSize: 11, fontWeight: "700", marginTop: 4 },
  warningCard: { backgroundColor: "#FFF3E0", borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: "#F5A623" },
  warningTitle: { fontSize: 15, fontWeight: "800", color: "#F5A623", marginTop: 8 },
  warningText: { fontSize: 13, color: "#7B8288", lineHeight: 20, marginTop: 8 },
  historyRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E0E7E7" },
  historyText: { fontSize: 14, color: "#37474F", fontWeight: "600" },
  historyDate: { fontSize: 11, color: "#8A8F95", marginTop: 2 },
  historyDuration: { fontSize: 13, fontWeight: "700", color: "#2FA99A" },
  detailContent: { paddingHorizontal: 27, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 120 },
  backBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  exerciseName: { fontSize: 24, fontWeight: "800", color: "#263238", textAlign: "center" },
  exerciseCategory: { fontSize: 14, color: "#32A99A", fontWeight: "700", textAlign: "center", marginTop: 4 },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 16, marginBottom: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 13, color: "#37474F", fontWeight: "600" },
  videoCard: { width: "100%", height: 150, borderRadius: 16, overflow: "hidden", marginBottom: 16 },
  videoThumbnailContainer: { flex: 1 },
  videoGradient: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  videoPlayText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginTop: 8 },
  playBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#32A99A", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginTop: 8 },
  playBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  description: { fontSize: 14, color: "#7B8288", lineHeight: 22 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#32A99A", alignItems: "center", justifyContent: "center", marginRight: 10 },
  stepNumberText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  stepText: { flex: 1, fontSize: 14, color: "#37474F", lineHeight: 20 },
  repetitions: { fontSize: 15, fontWeight: "700", color: "#32A99A" },
  safetyRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8, gap: 8 },
  safetyText: { flex: 1, fontSize: 13, color: "#7B8288", lineHeight: 18 },
  startBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#32A99A", paddingVertical: 16, borderRadius: 12, gap: 10, marginTop: 24 },
  startBtnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  timerContainer: { flex: 1, backgroundColor: "#F5FAF9" },
  timerGradient: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 27 },
  timerTitle: { fontSize: 22, fontWeight: "800", color: "#fff", marginTop: 20 },
  timerText: { fontSize: 72, fontWeight: "800", color: "#fff", marginTop: 20 },
  timerSubtext: { fontSize: 16, color: "#E7FFFB", marginTop: 10, marginBottom: 40 },
  timerControls: { flexDirection: "row", gap: 20 },
  timerBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, gap: 8 },
  resetBtn: { backgroundColor: "rgba(255,0,0,0.3)" },
  timerBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});