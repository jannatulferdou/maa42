import { Colors } from "@/constants/theme";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostpartumFooter from "../(footer)/PostpartumFooter";


const STORAGE_KEY = "maa42_nutrition_postpartum";

type MealPlan = {
  id: string;
  meal: string;
  time: string;
  foods: string[];
  calories: string;
  benefits: string;
  budget: string;
};

type NutritionData = {
  allergies: string[];
  conditions: string[];
  restrictions: string[];
  dietType: string;
  budget: string;
  mealPlan: MealPlan[];
  budgetMealPlan: MealPlan[];
  savedAt: string | null;
};

const allergiesList = [
  "Milk/Dairy", "Eggs", "Peanuts", "Tree nuts", "Soy",
  "Wheat/Gluten", "Fish", "Shellfish", "Sesame", "No allergies",
];

const conditionsList = [
  "Anemia/Weakness", "Breastfeeding issues", "Postpartum depression",
  "Thyroid issues", "Constipation", "Weight retention",
  "Hair loss", "No health conditions",
];

const restrictionsList = [
  "Raw/Undercooked meat", "Raw fish/Sushi", "Unpasteurized dairy",
  "Raw eggs", "Excess caffeine", "Alcohol", "High-mercury fish",
  "Street food", "Too spicy food", "No restrictions",
];

const generateMealPlan = (
  allergies: string[],
  conditions: string[],
  restrictions: string[],
  dietType: string,
): { mealPlan: MealPlan[]; budgetMealPlan: MealPlan[] } => {
  
  const hasAllergy = (food: string) => allergies.includes(food);
  const hasCondition = (condition: string) => conditions.includes(condition);

  let mealPlan: MealPlan[] = [];
  let budgetMealPlan: MealPlan[] = [];

  if (dietType === "vegetarian") {
    mealPlan = [
      {
        id: "1", meal: "Breakfast", time: "7:00 - 8:00 AM",
        foods: hasAllergy("Milk/Dairy") 
          ? ["Methi paratha", "Almond milk", "Soaked nuts"]
          : ["Methi paratha with ghee", "Milk with turmeric", "Dry fruits laddu"],
        calories: "400-450 kcal",
        benefits: "Galactagogue foods to boost milk supply and recovery",
        budget: "৳50-70",
      },
      {
        id: "2", meal: "Morning Snack", time: "10:00 AM",
        foods: ["Panjiri (whole wheat + nuts + ghee)", "Coconut water", "Dates"],
        calories: "200-250 kcal",
        benefits: "Traditional postpartum food for strength and lactation",
        budget: "৳30-50",
      },
      {
        id: "3", meal: "Lunch", time: "12:30 - 1:30 PM",
        foods: hasCondition("Anemia/Weakness")
          ? ["Rice", "Moong dal", "Spinach", "Beetroot salad", "Ghee"]
          : ["Rice/Roti", "Dal", "Seasonal vegetables", "Curd", "Ghee"],
        calories: "550-650 kcal",
        benefits: "Iron, protein and healthy fats for postpartum recovery",
        budget: "৳60-90",
      },
      {
        id: "4", meal: "Evening Snack", time: "4:00 PM",
        foods: ["Milk with gond (edible gum)", "Roasted makhana", "Dry fruits"],
        calories: "200-250 kcal",
        benefits: "Calcium-rich for bone recovery, gond for joint strength",
        budget: "৳30-50",
      },
      {
        id: "5", meal: "Dinner", time: "7:00 - 8:00 PM",
        foods: ["Khichdi with ghee", "Steamed vegetables", "Curd"],
        calories: "400-450 kcal",
        benefits: "Light, easily digestible, promotes healing and good sleep",
        budget: "৳40-60",
      },
      {
        id: "6", meal: "Bedtime", time: "9:30 PM",
        foods: hasAllergy("Milk/Dairy")
          ? ["Ajwain water", "Soaked almonds", "Dates"]
          : ["Warm milk with turmeric", "Dates (3 pieces)"],
        calories: "100-120 kcal",
        benefits: "Anti-inflammatory, helps milk production overnight",
        budget: "৳20-30",
      },
    ];

    budgetMealPlan = [
      {
        id: "1", meal: "Breakfast", time: "7:00 - 8:00 AM",
        foods: ["Ruti with ghee and jaggery", "Banana", "Herbal tea"],
        calories: "350-400 kcal",
        benefits: "Energy-dense affordable start for breastfeeding mothers",
        budget: "৳15-25",
      },
      {
        id: "2", meal: "Lunch", time: "12:00 - 1:00 PM",
        foods: ["Rice", "Moong dal", "Seasonal greens", "Lemon", "Ghee"],
        calories: "500-600 kcal",
        benefits: "Complete nutrition with galactagogue properties",
        budget: "৳25-40",
      },
      {
        id: "3", meal: "Dinner", time: "7:00 - 8:00 PM",
        foods: ["Khichdi", "Curd", "Steamed papaya"],
        calories: "400-450 kcal",
        benefits: "Easy to digest, promotes milk production",
        budget: "৳20-30",
      },
    ];
  } else {
    mealPlan = [
      {
        id: "1", meal: "Breakfast", time: "7:00 - 8:00 AM",
        foods: hasAllergy("Eggs")
          ? ["Chicken soup with vegetables", "Ruti with ghee", "Dates"]
          : ["Egg bhurji with ghee", "Ruti", "Milk with turmeric"],
        calories: "450-500 kcal",
        benefits: "High protein for tissue repair and milk production",
        budget: "৳60-90",
      },
      {
        id: "2", meal: "Morning Snack", time: "10:00 AM",
        foods: ["Chicken broth/soup", "Dry fruits laddu", "Coconut water"],
        calories: "200-250 kcal",
        benefits: "Collagen-rich broth for healing, energy for breastfeeding",
        budget: "৳40-60",
      },
      {
        id: "3", meal: "Lunch", time: "12:30 - 1:30 PM",
        foods: hasCondition("Anemia/Weakness")
          ? ["Rice", "Fish curry", "Spinach", "Beetroot", "Ghee"]
          : ["Rice", "Chicken/Fish curry", "Vegetables", "Dal", "Ghee"],
        calories: "600-700 kcal",
        benefits: "Complete protein, omega-3, iron for postpartum recovery",
        budget: "৳80-120",
      },
      {
        id: "4", meal: "Evening Snack", time: "4:00 PM",
        foods: hasAllergy("Eggs")
          ? ["Chicken soup", "Roasted makhana", "Dry fruits"]
          : ["Boiled egg", "Milk with gond", "Dates"],
        calories: "200-250 kcal",
        benefits: "Protein and calcium for milk quality and quantity",
        budget: "৳30-50",
      },
      {
        id: "5", meal: "Dinner", time: "7:00 - 8:00 PM",
        foods: ["Chapati", "Light chicken curry", "Dal", "Curd"],
        calories: "400-500 kcal",
        benefits: "Lean protein for overnight recovery and milk synthesis",
        budget: "৳70-100",
      },
      {
        id: "6", meal: "Bedtime", time: "9:30 PM",
        foods: hasAllergy("Milk/Dairy")
          ? ["Ajwain water", "Almonds (5-6)", "Dates (3)"]
          : ["Warm milk with turmeric", "Dates (3 pieces)"],
        calories: "100-120 kcal",
        benefits: "Traditional galactagogue, promotes deep healing sleep",
        budget: "৳20-30",
      },
    ];

    budgetMealPlan = [
      {
        id: "1", meal: "Breakfast", time: "7:00 - 8:00 AM",
        foods: ["Ruti", "Egg (any style)", "Banana", "Tea with ginger"],
        calories: "350-450 kcal",
        benefits: "Affordable protein to start the day, ginger for digestion",
        budget: "৳20-30",
      },
      {
        id: "2", meal: "Lunch", time: "12:00 - 1:00 PM",
        foods: ["Rice", "Small fish curry", "Mixed vegetables", "Dal", "Ghee"],
        calories: "550-650 kcal",
        benefits: "Omega-3 from fish, iron from vegetables, ghee for strength",
        budget: "৳40-60",
      },
      {
        id: "3", meal: "Dinner", time: "7:00 - 8:00 PM",
        foods: ["Ruti", "Egg curry/Dal", "Seasonal vegetable"],
        calories: "400-500 kcal",
        benefits: "Protein and fiber for recovery and digestion",
        budget: "৳25-40",
      },
    ];
  }

  if (hasCondition("Anemia/Weakness")) {
    mealPlan = mealPlan.map(m => ({
      ...m,
      foods: [...m.foods, "💪 Iron-rich: liver/dates/spinach/beetroot"],
    }));
  }
  if (hasCondition("Breastfeeding issues")) {
    mealPlan = mealPlan.map(m => ({
      ...m,
      foods: [...m.foods, "🥛 Lactation: fenugreek/fennel/jeera water"],
    }));
  }

  return { mealPlan, budgetMealPlan };
};

export default function PostpartumNutritionScreen() {
  const [step, setStep] = useState(1);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [dietType, setDietType] = useState("non-vegetarian");
  const [budget, setBudget] = useState("medium");
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [budgetMealPlan, setBudgetMealPlan] = useState<MealPlan[]>([]);
  const [saved, setSaved] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => { loadSavedData(); }, []);

  const loadSavedData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: NutritionData = JSON.parse(stored);
        setSelectedAllergies(data.allergies);
        setSelectedConditions(data.conditions);
        setSelectedRestrictions(data.restrictions);
        setDietType(data.dietType);
        setBudget(data.budget);
        setMealPlan(data.mealPlan);
        setBudgetMealPlan(data.budgetMealPlan);
        setHasExistingData(true);
      }
    } catch (error) {}
  };

  const toggleItem = (item: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (item === "No allergies" || item === "No health conditions" || item === "No restrictions") {
      setSelected(selected.includes(item) ? [] : [item]);
    } else {
      const filtered = selected.filter(i => i !== "No allergies" && i !== "No health conditions" && i !== "No restrictions");
      setSelected(filtered.includes(item) ? filtered.filter(i => i !== item) : [...filtered, item]);
    }
  };

  const generatePlan = () => {
    const { mealPlan: plan, budgetMealPlan: budgetPlan } = generateMealPlan(
      selectedAllergies, selectedConditions, selectedRestrictions, dietType
    );
    setMealPlan(plan);
    setBudgetMealPlan(budgetPlan);
    setStep(3);
  };

  const savePlan = async () => {
    const data: NutritionData = {
      allergies: selectedAllergies, conditions: selectedConditions,
      restrictions: selectedRestrictions, dietType, budget,
      mealPlan, budgetMealPlan, savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    Alert.alert("Saved!", "Your postpartum nutrition plan has been saved.");
  };

  const renderChips = (items: string[], selected: string[], setSelected: (val: string[]) => void) => (
    <View style={styles.optionsGrid}>
      {items.map(item => (
        <Pressable
          key={item}
          style={[styles.optionChip, selected.includes(item) && styles.optionChipActive]}
          onPress={() => toggleItem(item, selected, setSelected)}
        >
          <Text style={[styles.optionText, selected.includes(item) && styles.optionTextActive]}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );

  if (hasExistingData && step === 1) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.mainTitle}>👶 Postpartum Nutrition</Text>
          <Text style={styles.subtitle}>You have a saved nutrition plan</Text>
          <Pressable style={styles.viewBtn} onPress={() => setStep(3)}>
            <Feather name="eye" size={22} color={Colors.light.white} />
            <Text style={styles.viewBtnText}>View Saved Plan</Text>
          </Pressable>
          <Pressable style={styles.editBtn} onPress={() => { setStep(1); setSaved(false); }}>
            <Feather name="edit-2" size={22} color={Colors.light.primary} />
            <Text style={styles.editBtnText}>Create New Plan</Text>
          </Pressable>
        </ScrollView>
        <PostpartumFooter />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={styles.mainTitle}>👶 Postpartum Nutrition</Text>
            <Text style={styles.subtitle}>Lets create your postpartum recovery meal plan</Text>
            <Text style={styles.questionTitle}>Do you have any food allergies?</Text>
            {renderChips(allergiesList, selectedAllergies, setSelectedAllergies)}
            <Pressable style={styles.nextBtn} onPress={() => setStep(2)}>
              <Text style={styles.nextBtnText}>Next</Text>
              <Feather name="arrow-right" size={20} color={Colors.light.white} />
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.mainTitle}>Health & Preferences</Text>
            <Text style={styles.questionTitle}>Any health conditions?</Text>
            {renderChips(conditionsList, selectedConditions, setSelectedConditions)}
            <Text style={styles.questionTitle}>Doctors restrictions?</Text>
            {renderChips(restrictionsList, selectedRestrictions, setSelectedRestrictions)}
            <Text style={styles.questionTitle}>Diet preference</Text>
            <View style={styles.dietRow}>
              {["vegetarian", "non-vegetarian"].map(d => (
                <Pressable
                  key={d}
                  style={[styles.dietOption, dietType === d && styles.dietOptionActive]}
                  onPress={() => setDietType(d)}
                >
                  <MaterialCommunityIcons name={d === "vegetarian" ? "leaf" : "food-drumstick"} size={22} color={dietType === d ? Colors.light.white : Colors.light.primary} />
                  <Text style={[styles.dietText, dietType === d && styles.dietTextActive]}>{d === "vegetarian" ? "Vegetarian" : "Non-Veg"}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.stepButtons}>
              <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
                <Feather name="arrow-left" size={20} color={Colors.light.primary} />
                <Text style={styles.backBtnText}>Back</Text>
              </Pressable>
              <Pressable style={styles.nextBtn} onPress={generatePlan}>
                <Text style={styles.nextBtnText}>Generate Plan</Text>
                <Feather name="check" size={20} color={Colors.light.white} />
              </Pressable>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <View style={styles.planHeader}>
              <Text style={styles.mainTitle}>Your Postpartum Meal Plan</Text>
              <Pressable style={styles.saveBtn} onPress={savePlan}>
                <Feather name="download" size={20} color={Colors.light.white} />
                <Text style={styles.saveBtnText}>{saved ? "Saved!" : "Save"}</Text>
              </Pressable>
            </View>
            {mealPlan.map(meal => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View>
                    <Text style={styles.mealTitle}>{meal.meal}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                  <View style={styles.calorieBadge}><Text style={styles.calorieText}>{meal.calories}</Text></View>
                </View>
                <View style={styles.foodList}>
                  {meal.foods.map((food, idx) => (
                    <View key={idx} style={styles.foodItem}>
                      <Feather name="check-circle" size={16} color={Colors.light.primary} />
                      <Text style={styles.foodText}>{food}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.mealFooter}>
                  <Feather name="info" size={14} color={Colors.light.textMuted} />
                  <Text style={styles.benefitsText}>{meal.benefits}</Text>
                </View>
                <View style={styles.budgetTag}><Text style={styles.budgetTagText}>💰 {meal.budget}</Text></View>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Budget-Friendly Option</Text>
            {budgetMealPlan.map(meal => (
              <View key={meal.id} style={[styles.mealCard, styles.budgetCard]}>
                <View style={styles.mealHeader}>
                  <View>
                    <Text style={styles.mealTitle}>{meal.meal}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                  <View style={styles.budgetBadge}><Text style={styles.budgetBadgeText}>{meal.budget}</Text></View>
                </View>
                <View style={styles.foodList}>
                  {meal.foods.map((food, idx) => (
                    <View key={idx} style={styles.foodItem}>
                      <Feather name="check-circle" size={16} color={Colors.light.accent} />
                      <Text style={styles.foodText}>{food}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.mealFooter}>
                  <Feather name="info" size={14} color={Colors.light.textMuted} />
                  <Text style={styles.benefitsText}>{meal.benefits}</Text>
                </View>
              </View>
            ))}
            <Pressable style={styles.editPlanBtn} onPress={() => { setStep(1); setSaved(false); }}>
              <Feather name="edit-2" size={20} color={Colors.light.primary} />
              <Text style={styles.editPlanBtnText}>Edit Preferences</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
      <PostpartumFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingHorizontal: 27, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 120 },
  mainTitle: { fontSize: 24, fontWeight: "800", color: Colors.light.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.light.textMuted, marginBottom: 24 },
  questionTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text, marginBottom: 4, marginTop: 20 },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  optionChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border },
  optionChipActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  optionText: { fontSize: 13, fontWeight: "600", color: Colors.light.textSecondary },
  optionTextActive: { color: Colors.light.white },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.light.primary, paddingVertical: 14, borderRadius: 12, gap: 8, marginTop: 20, flex: 1 },
  nextBtnText: { color: Colors.light.white, fontSize: 16, fontWeight: "700" },
  backBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, gap: 8, flex: 1, borderWidth: 1, borderColor: Colors.light.primary },
  backBtnText: { color: Colors.light.primary, fontSize: 16, fontWeight: "700" },
  stepButtons: { flexDirection: "row", gap: 12, marginTop: 20 },
  dietRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  dietOption: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.light.border, backgroundColor: Colors.light.white, gap: 8 },
  dietOptionActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  dietText: { fontSize: 14, fontWeight: "700", color: Colors.light.primary },
  dietTextActive: { color: Colors.light.white },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  saveBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
  saveBtnText: { color: Colors.light.white, fontSize: 13, fontWeight: "700" },
  mealCard: { backgroundColor: Colors.light.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.light.border },
  budgetCard: { borderColor: Colors.light.accent, borderWidth: 2 },
  mealHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  mealTitle: { fontSize: 16, fontWeight: "800", color: Colors.light.text },
  mealTime: { fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  calorieBadge: { backgroundColor: Colors.light.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  calorieText: { fontSize: 12, fontWeight: "700", color: Colors.light.primary },
  budgetBadge: { backgroundColor: Colors.light.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  budgetBadgeText: { fontSize: 12, fontWeight: "700", color: Colors.light.accent },
  foodList: { marginBottom: 12 },
  foodItem: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
  foodText: { fontSize: 14, color: "#37474F", flex: 1 },
  mealFooter: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginBottom: 8 },
  benefitsText: { fontSize: 12, color: Colors.light.textMuted, flex: 1, lineHeight: 16 },
  budgetTag: { backgroundColor: Colors.light.accentLight, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: "flex-start" },
  budgetTagText: { fontSize: 12, fontWeight: "700", color: Colors.light.accent },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: Colors.light.text, marginTop: 24, marginBottom: 12 },
  editPlanBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, gap: 8, marginTop: 20, borderWidth: 1, borderColor: Colors.light.primary },
  editPlanBtnText: { color: Colors.light.primary, fontSize: 15, fontWeight: "700" },
  viewBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.light.primary, paddingVertical: 16, borderRadius: 12, gap: 10, marginBottom: 12 },
  viewBtnText: { color: Colors.light.white, fontSize: 16, fontWeight: "700" },
  editBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 12, gap: 10, borderWidth: 1, borderColor: Colors.light.primary },
  editBtnText: { color: Colors.light.primary, fontSize: 16, fontWeight: "700" },
});