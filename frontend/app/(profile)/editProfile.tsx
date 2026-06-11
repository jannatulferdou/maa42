import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditProfileScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [childbirthDate, setChildbirthDate] = useState("");

  const [deliveryType, setDeliveryType] = useState("Normal");

  const [previousComplications, setPreviousComplications] =
    useState("");

  const [existingHealthConditions, setExistingHealthConditions] =
    useState("");

  const [currentMedicines, setCurrentMedicines] =
    useState("");

  const [doctor, setDoctor] = useState("");
  const [clinic, setClinic] = useState("");

  const [emergencyContact, setEmergencyContact] =
    useState("");

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const res = await fetch(
        `${API_URL}/users/${user.uid}`
      );

      const data = await res.json();

      const profile = data.data;

      setProfileImage(profile.profileImage || "");

      setName(profile.name || "");
      setAge(profile.age?.toString() || "");
      setGender(profile.gender || "");
      setBloodGroup(profile.bloodGroup || "");

      setDateOfBirth(profile.dateOfBirth || "");
      setChildbirthDate(profile.childbirthDate || "");

      setDeliveryType(profile.deliveryType || "Normal");

      setPreviousComplications(
        profile.previousComplications || ""
      );

      setExistingHealthConditions(
        profile.existingHealthConditions || ""
      );

      setCurrentMedicines(
        profile.currentMedicines || ""
      );

      setDoctor(profile.doctor || "");
      setClinic(profile.clinic || "");

      setEmergencyContact(
        profile.emergencyContact || ""
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
      });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        profileImage,

        name,
        age,
        gender,
        bloodGroup,

        dateOfBirth,
        childbirthDate,

        deliveryType,

        previousComplications,

        existingHealthConditions,

        currentMedicines,

        doctor,
        clinic,

        emergencyContact,
      };

      const res = await fetch(
        `${API_URL}/users/${user.uid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#2FA99A"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Feather
            name="chevron-left"
            size={32}
            color="#263238"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../assets/images/icon.png")
          }
          style={styles.avatar}
        />

        <Pressable
          style={styles.imageBtn}
          onPress={pickImage}
        >
          <Text style={styles.imageBtnText}>
            Change Photo
          </Text>
        </Pressable>
      </View>

      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Age"
        value={age}
        onChangeText={setAge}
      />

      <Input
        label="Gender"
        value={gender}
        onChangeText={setGender}
      />

      <Input
        label="Blood Group"
        value={bloodGroup}
        onChangeText={setBloodGroup}
      />

      <Input
        label="Date Of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <Input
        label="Childbirth Date"
        value={childbirthDate}
        onChangeText={setChildbirthDate}
      />

      <Input
        label="Doctor"
        value={doctor}
        onChangeText={setDoctor}
      />

      <Input
        label="Clinic"
        value={clinic}
        onChangeText={setClinic}
      />

      <Input
        label="Emergency Contact"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
      />

      <Input
        label="Current Medicines"
        value={currentMedicines}
        onChangeText={setCurrentMedicines}
      />

      <Input
        label="Existing Health Conditions"
        value={existingHealthConditions}
        onChangeText={
          setExistingHealthConditions
        }
      />

      <Input
        label="Previous Complications"
        value={previousComplications}
        onChangeText={
          setPreviousComplications
        }
      />

      <Pressable
        style={styles.saveBtn}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Input({
  label,
  value,
  onChangeText,
}: any) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    paddingHorizontal: 27,
    paddingTop: 40,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "800",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  imageBtn: {
    marginTop: 10,
  },

  imageBtnText: {
    color: "#2FA99A",
    fontWeight: "700",
  },

  label: {
    marginBottom: 6,
    fontWeight: "700",
    color: "#263238",
  },

  input: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D8E2E2",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
  },

  saveBtn: {
    height: 56,
    backgroundColor: "#2FA99A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});