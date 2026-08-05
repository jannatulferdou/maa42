import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useState, useRef } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Role = "mother" | "doctor";
type CareStage = "pregnant" | "postpartum";

export default function Register() {
  const { registerUser } = useAuth();
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Role>("mother");

  const [careStage, setCareStage] =
    useState<CareStage>("pregnant");

  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  const [pregnancyWeek, setPregnancyWeek] =
    useState("");

  const [childbirthDate, setChildbirthDate] =
    useState("");

  const [deliveryType, setDeliveryType] =
    useState("Normal");

  const [postpartumDay, setPostpartumDay] =
    useState("");

  const [previousComplications, setPreviousComplications] =
    useState("");

  const [existingHealthConditions, setExistingHealthConditions] =
    useState("");

  const [currentMedicines, setCurrentMedicines] =
    useState("");

  const [specialization, setSpecialization] =
    useState("");

  const [medicalRegistration, setMedicalRegistration] =
    useState("");

  const [hospitalClinic, setHospitalClinic] =
    useState("");

  const [experienceYears, setExperienceYears] =
    useState("");

  const [bloodGroup, setBloodGroup] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [emergencyContact, setEmergencyContact] =
    useState("");

  const [doctor, setDoctor] =
    useState("");

  const [clinic, setClinic] =
    useState("");

  const [consent, setConsent] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [datePickerType, setDatePickerType] =
    useState<
      "dob" |
      "delivery" |
      "childbirth" |
      null
    >(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  // Custom date picker states
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [tempDay, setTempDay] = useState(new Date().getDate());

  // Refs for scroll views
  const yearScrollRef = useRef<any>(null);
  const monthScrollRef = useRef<any>(null);
  const dayScrollRef = useRef<any>(null);

  // Generate years (from 1900 to current year)
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(tempYear, tempMonth) },
    (_, i) => i + 1
  );

  const showToast = (
    type: "success" | "error",
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

  const openCustomDatePicker = (
    type: "dob" | "delivery" | "childbirth",
    currentDate?: string
  ) => {
    setDatePickerType(type);
    
    if (currentDate) {
      const [year, month, day] = currentDate.split("-").map(Number);
      setTempYear(year);
      setTempMonth(month - 1);
      setTempDay(day);
    } else {
      const now = new Date();
      setTempYear(now.getFullYear());
      setTempMonth(now.getMonth());
      setTempDay(now.getDate());
    }
    
    setShowCustomPicker(true);
  };

  const handleCustomDateConfirm = () => {
    const formattedDate = `${tempYear}-${String(tempMonth + 1).padStart(2, "0")}-${String(tempDay).padStart(2, "0")}`;

    if (datePickerType === "dob") {
      setDateOfBirth(formattedDate);
    } else if (datePickerType === "delivery") {
      setExpectedDeliveryDate(formattedDate);
    } else if (datePickerType === "childbirth") {
      setChildbirthDate(formattedDate);
    }

    setShowCustomPicker(false);
  };

  const openDatePicker = (
    type: "dob" | "delivery" | "childbirth"
  ) => {
    // For iOS, use the native picker, for Android use custom picker
    if (Platform.OS === "ios") {
      setDatePickerType(type);
      setSelectedDate(new Date());
      setShowDatePicker(true);
    } else {
      // For Android, use custom picker with year-first selection
      let currentDate = "";
      if (type === "dob") currentDate = dateOfBirth;
      else if (type === "delivery") currentDate = expectedDeliveryDate;
      else if (type === "childbirth") currentDate = childbirthDate;
      
      openCustomDatePicker(type, currentDate || undefined);
    }
  };

  const handleDateChange = (
    event: any,
    date?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      return;
    }

    if (!date) {
      return;
    }

    const formattedDate =
      date.toISOString().split("T")[0];

    if (datePickerType === "dob") {
      setDateOfBirth(formattedDate);
    } else if (datePickerType === "delivery") {
      setExpectedDeliveryDate(formattedDate);
    } else if (datePickerType === "childbirth") {
      setChildbirthDate(formattedDate);
    }

    if (Platform.OS === "ios") {
      setShowDatePicker(false);
    }
  };

 const handleRegister = async () => {
  if (
    !name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    showToast(
      "error",
      "Missing Information",
      "Name, email and password are required."
    );
    return;
  }

  if (password.length < 6) {
    showToast(
      "error",
      "Weak Password",
      "Password must be at least 6 characters."
    );
    return;
  }

  if (!consent) {
    showToast(
      "error",
      "Consent Required",
      "Please accept the consent policy."
    );
    return;
  }

  if (role === "mother") {
    if (!careStage) {
      showToast(
        "error",
        "Select Care Stage",
        "Please select pregnant or postpartum."
      );
      return;
    }

    if (
      careStage === "pregnant" &&
      !expectedDeliveryDate
    ) {
      showToast(
        "error",
        "Missing Information",
        "Please select your expected delivery date."
      );
      return;
    }

    if (
      careStage === "postpartum" &&
      !childbirthDate
    ) {
      showToast(
        "error",
        "Missing Information",
        "Please select your childbirth date."
      );
      return;
    }
  }

  if (role === "doctor") {
    if (
      !specialization.trim() ||
      !medicalRegistration.trim()
    ) {
      showToast(
        "error",
        "Missing Information",
        "Specialization and medical registration are required."
      );
      return;
    }
  }

  if (!API_URL) {
    showToast(
      "error",
      "API Error",
      "EXPO_PUBLIC_API_URL is missing."
    );
    return;
  }

  try {
    console.log("Starting registration process...");
    
    // Step 1: Register with Firebase
    const result = await registerUser(
      email.trim(),
      password
    );
    
    console.log("Firebase registration successful:", result.user.uid);

    // Step 2: Prepare user data for backend
    const userData = {
      uid: result.user.uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
      careStage: role === "mother" ? careStage : null,
      expectedDeliveryDate:
        role === "mother" && careStage === "pregnant"
          ? expectedDeliveryDate
          : null,
      pregnancyWeek:
        role === "mother" && careStage === "pregnant" && pregnancyWeek
          ? Number(pregnancyWeek)
          : null,
      childbirthDate:
        role === "mother" && careStage === "postpartum"
          ? childbirthDate
          : null,
      deliveryType:
        role === "mother" && careStage === "postpartum"
          ? deliveryType
          : null,
      postpartumDay:
        role === "mother" && careStage === "postpartum" && postpartumDay
          ? Number(postpartumDay)
          : null,
      previousComplications:
        role === "mother" ? previousComplications || null : null,
      existingHealthConditions:
        role === "mother" ? existingHealthConditions || null : null,
      currentMedicines:
        role === "mother" ? currentMedicines || null : null,
      specialization: role === "doctor" ? specialization : null,
      medicalRegistration: role === "doctor" ? medicalRegistration : null,
      hospitalClinic: role === "doctor" ? hospitalClinic || null : null,
      experienceYears:
        role === "doctor" && experienceYears
          ? Number(experienceYears)
          : null,
      doctor: role === "mother" ? doctor || null : null,
      clinic: role === "mother" ? clinic || null : null,
      emergencyContact: role === "mother" ? emergencyContact || null : null,
      shareWithDoctor: true,
      emergencyAccess: true,
      offlineSync: true,
      chatHistoryEnabled: true,
      analyticsEnabled: false,
    };

    console.log("Saving user to backend with role:", role, "careStage:", careStage);

    // Step 3: Save to backend
    const res = await fetch(
      `${API_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await res.json().catch(() => null);

    console.log("Backend response:", data);

    if (!res.ok) {
      throw new Error(
        data?.message || "Failed to save user profile."
      );
    }

    showToast(
      "success",
      "Registration Successful",
      "Welcome to Maa42"
    );

    console.log("Registration complete, will redirect to home in 2 seconds");

    // Step 4: Wait for AuthProvider to fetch user data, then redirect
    setTimeout(() => {
      console.log("Redirecting to home now");
      router.replace("/(home)" as any);
    }, 2000); // 2 seconds delay

  } catch (error: any) {
    console.log("REGISTER ERROR:", error);
    showToast(
      "error",
      "Registration Failed",
      error?.message || "Something went wrong."
    );
  }
};

  // Custom Date Picker Modal Component
  const CustomDatePickerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomPicker}
        onRequestClose={() => setShowCustomPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCustomPicker(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {datePickerType === "dob" ? "Select Birth Date" : 
                 datePickerType === "delivery" ? "Select Delivery Date" : 
                 "Select Childbirth Date"}
              </Text>
              <TouchableOpacity onPress={handleCustomDateConfirm}>
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <ScrollView
                  ref={yearScrollRef}
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  decelerationRate="fast"
                >
                  <View style={styles.pickerSpacer} />
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        tempYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempYear === year && styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.pickerSpacer} />
                </ScrollView>
              </View>

              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <ScrollView
                  ref={monthScrollRef}
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  decelerationRate="fast"
                >
                  <View style={styles.pickerSpacer} />
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        tempMonth === index && styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setTempMonth(index);
                        // Adjust day if needed
                        const daysInMonth = getDaysInMonth(tempYear, index);
                        if (tempDay > daysInMonth) {
                          setTempDay(daysInMonth);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempMonth === index && styles.pickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.pickerSpacer} />
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <ScrollView
                  ref={dayScrollRef}
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  decelerationRate="fast"
                >
                  <View style={styles.pickerSpacer} />
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        tempDay === day && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempDay(day)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempDay === day && styles.pickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.pickerSpacer} />
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK BUTTON */}
      <Pressable
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Feather name="chevron-left" size={32} color="#263238" />
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your maternal healthcare journey</Text>

      {/* NAME */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#B0B8BC"
        value={name}
        onChangeText={setName}
      />

      {/* DATE OF BIRTH */}
      <Text style={styles.label}>Date of Birth</Text>
      <Pressable
        style={styles.dateInput}
        onPress={() => openDatePicker("dob")}
      >
        <Text style={dateOfBirth ? styles.dateText : styles.placeholderText}>
          {dateOfBirth || "Select your date of birth"}
        </Text>
        <Feather name="calendar" size={20} color="#8A8F95" />
      </Pressable>

      {/* iOS Native Date Picker */}
      {Platform.OS === "ios" && showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          maximumDate={datePickerType === "dob" ? new Date() : undefined}
          onChange={handleDateChange}
        />
      )}

      {/* Custom Date Picker Modal for Android */}
      {Platform.OS === "android" && <CustomDatePickerModal />}

      {/* ROLE */}
      <Text style={styles.label}>I am a</Text>
      <View style={styles.optionRow}>
        <Pressable
          style={[styles.option, role === "mother" && styles.activeOption]}
          onPress={() => setRole("mother")}
        >
          <Text style={[styles.optionText, role === "mother" && styles.activeOptionText]}>
            Mother
          </Text>
        </Pressable>
        <Pressable
          style={[styles.option, role === "doctor" && styles.activeOption]}
          onPress={() => setRole("doctor")}
        >
          <Text style={[styles.optionText, role === "doctor" && styles.activeOptionText]}>
            Doctor
          </Text>
        </Pressable>
      </View>

      {/* MOTHER FORM */}
      {role === "mother" && (
        <>
          <Text style={styles.label}>Current Condition</Text>
          <View style={styles.optionRow}>
            <Pressable
              style={[styles.option, careStage === "pregnant" && styles.activeOption]}
              onPress={() => setCareStage("pregnant")}
            >
              <Text style={[styles.optionText, careStage === "pregnant" && styles.activeOptionText]}>
                Pregnant
              </Text>
            </Pressable>
            <Pressable
              style={[styles.option, careStage === "postpartum" && styles.activeOption]}
              onPress={() => setCareStage("postpartum")}
            >
              <Text style={[styles.optionText, careStage === "postpartum" && styles.activeOptionText]}>
                Postpartum
              </Text>
            </Pressable>
          </View>

          {/* PREGNANT */}
          {careStage === "pregnant" && (
            <>
              <Text style={styles.label}>Expected Delivery Date</Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => openDatePicker("delivery")}
              >
                <Text style={expectedDeliveryDate ? styles.dateText : styles.placeholderText}>
                  {expectedDeliveryDate || "Select expected delivery date"}
                </Text>
                <Feather name="calendar" size={20} color="#8A8F95" />
              </Pressable>

              <Text style={styles.label}>Pregnancy Week</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 24"
                placeholderTextColor="#B0B8BC"
                value={pregnancyWeek}
                onChangeText={setPregnancyWeek}
                keyboardType="numeric"
              />
            </>
          )}

          {/* POSTPARTUM */}
          {careStage === "postpartum" && (
            <>
              <Text style={styles.label}>Childbirth Date</Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => openDatePicker("childbirth")}
              >
                <Text style={childbirthDate ? styles.dateText : styles.placeholderText}>
                  {childbirthDate || "Select childbirth date"}
                </Text>
                <Feather name="calendar" size={20} color="#8A8F95" />
              </Pressable>

              <Text style={styles.label}>Delivery Type</Text>
              <View style={styles.optionRow}>
                <Pressable
                  style={[styles.option, deliveryType === "Normal" && styles.activeOption]}
                  onPress={() => setDeliveryType("Normal")}
                >
                  <Text style={styles.optionText}>Normal</Text>
                </Pressable>
                <Pressable
                  style={[styles.option, deliveryType === "C-section" && styles.activeOption]}
                  onPress={() => setDeliveryType("C-section")}
                >
                  <Text style={styles.optionText}>C-section</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Days After Childbirth</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number of days"
                placeholderTextColor="#B0B8BC"
                value={postpartumDay}
                onChangeText={setPostpartumDay}
                keyboardType="numeric"
              />
            </>
          )}

          <Text style={styles.label}>Blood Group</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. O+"
            placeholderTextColor="#B0B8BC"
            value={bloodGroup}
            onChangeText={setBloodGroup}
          />

          <Text style={styles.label}>Previous Complications</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter previous complications if any"
            placeholderTextColor="#B0B8BC"
            value={previousComplications}
            onChangeText={setPreviousComplications}
            multiline
          />

          <Text style={styles.label}>Existing Health Conditions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter existing health conditions"
            placeholderTextColor="#B0B8BC"
            value={existingHealthConditions}
            onChangeText={setExistingHealthConditions}
            multiline
          />

          <Text style={styles.label}>Current Medicines</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter current medicines"
            placeholderTextColor="#B0B8BC"
            value={currentMedicines}
            onChangeText={setCurrentMedicines}
            multiline
          />

          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Caregiver phone number"
            placeholderTextColor="#B0B8BC"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
          />
        </>
      )}

      {/* DOCTOR FORM */}
      {role === "doctor" && (
        <>
          <Text style={styles.label}>Specialization</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Obstetrics and Gynecology"
            placeholderTextColor="#B0B8BC"
            value={specialization}
            onChangeText={setSpecialization}
          />

          <Text style={styles.label}>Medical Registration Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registration number"
            placeholderTextColor="#B0B8BC"
            value={medicalRegistration}
            onChangeText={setMedicalRegistration}
          />

          <Text style={styles.label}>Hospital / Clinic</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hospital or clinic name"
            placeholderTextColor="#B0B8BC"
            value={hospitalClinic}
            onChangeText={setHospitalClinic}
          />

          <Text style={styles.label}>Experience (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            placeholderTextColor="#B0B8BC"
            value={experienceYears}
            onChangeText={setExperienceYears}
            keyboardType="numeric"
          />
        </>
      )}

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#B0B8BC"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* PASSWORD */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter password"
          placeholderTextColor="#B0B8BC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? "eye-off" : "eye"} size={21} color="#8A8F95" />
        </Pressable>
      </View>

      {/* CONSENT */}
      <View style={styles.consentContainer}>
        <Checkbox
          value={consent}
          onValueChange={setConsent}
          color={consent ? "#2FA99A" : undefined}
        />
        <Text style={styles.consentText}>
          I agree to securely share my information for healthcare
          support and research purposes.
        </Text>
      </View>

      {/* CREATE ACCOUNT */}
      <Pressable style={styles.primaryBtn} onPress={handleRegister}>
        <Text style={styles.primaryText}>Create Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    paddingHorizontal: 27,
    paddingTop: 55,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#263238",
  },
  subtitle: {
    color: "#7B8288",
    marginTop: 4,
    marginBottom: 28,
  },
  label: {
    fontWeight: "600",
    color: "#263238",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 90,
    paddingTop: 15,
    textAlignVertical: "top",
  },
  dateInput: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: "#263238",
    fontSize: 16,
  },
  placeholderText: {
    color: "#B0B8BC",
    fontSize: 16,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  option: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  activeOption: {
    backgroundColor: "#DDF5F1",
    borderColor: "#2FA99A",
  },
  optionText: {
    color: "#263238",
    fontWeight: "600",
  },
  activeOptionText: {
    color: "#168F82",
  },
  passwordContainer: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#263238",
  },
  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  consentText: {
    flex: 1,
    marginLeft: 10,
    color: "#6B777B",
    lineHeight: 20,
    fontSize: 13,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: "#32A99A",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  // Custom Date Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 380,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCancel: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  modalTitle: {
    color: "#263238",
    fontSize: 17,
    fontWeight: "600",
  },
  modalDone: {
    color: "#32A99A",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 5,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
    marginVertical: 8,
  },
  pickerScroll: {
    flex: 1,
    width: "100%",
  },
  pickerSpacer: {
    height: 80,
  },
  pickerItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pickerItemSelected: {
    backgroundColor: "#DDF5F1",
    borderRadius: 8,
  },
  pickerItemText: {
    color: "#263238",
    fontSize: 16,
  },
  pickerItemTextSelected: {
    color: "#168F82",
    fontWeight: "600",
  },
});