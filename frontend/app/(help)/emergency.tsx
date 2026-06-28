import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Contact = {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isFavorite: boolean;
};

export default function EmergencyScreen() {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/emergency/${user.uid}`
      );

      const data = await res.json();

      if (res.ok) {
        setContacts(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    setName("");
    setRelation("");
    setPhone("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!name || !relation || !phone) {
      return Toast.show({
        type: "error",
        text1: "All fields are required",
      });
    }

    try {
      let res;

      if (editingId) {
        res = await fetch(
          `${API_URL}/emergency/${editingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              relation,
              phone,
            }),
          }
        );
      } else {
        res = await fetch(`${API_URL}/emergency`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            name,
            relation,
            phone,
            isFavorite: false,
          }),
        });
      }

      if (!res.ok) throw new Error();

      Toast.show({
        type: "success",
        text1: editingId
          ? "Contact Updated"
          : "Contact Added",
      });

      clearForm();
      fetchContacts();
    } catch {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(
                `${API_URL}/emergency/${id}`,
                {
                  method: "DELETE",
                }
              );

              fetchContacts();

              Toast.show({
                type: "success",
                text1: "Contact Deleted",
              });
            } catch {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
              });
            }
          },
        },
      ]
    );
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRelation(contact.relation);
    setPhone(contact.phone);
  };

  const toggleFavorite = async (
    contact: Contact
  ) => {
    try {
      await fetch(
        `${API_URL}/emergency/${contact.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: !contact.isFavorite,
          }),
        }
      );

      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  const makeCall = async (number: string) => {
    const url = `tel:${number}`;

    const supported =
      await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Cannot make call");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Feather
            name="chevron-left"
            size={30}
            color="#263238"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Emergency Help
        </Text>
      </View>

      <View style={styles.notice}>
        <Feather
          name="shield"
          size={22}
          color="#2FA99A"
        />

        <Text style={styles.noticeText}>
          Add emergency contacts for quick
          access during danger situations.
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Contact Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Relation (Mother, Doctor)"
        value={relation}
        onChangeText={setRelation}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Pressable
        style={styles.saveBtn}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          {editingId
            ? "Update Contact"
            : "Add Contact"}
        </Text>
      </Pressable>

      <FlatList
        data={contacts}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.info}>
                {item.relation}
              </Text>

              <Text style={styles.info}>
                {item.phone}
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  toggleFavorite(item)
                }
              >
                <Feather
                  name="star"
                  size={22}
                  color={
                    item.isFavorite
                      ? "#F5A623"
                      : "#B0B8BC"
                  }
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  makeCall(item.phone)
                }
              >
                <Feather
                  name="phone"
                  size={22}
                  color="#2FA99A"
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  handleEdit(item)
                }
              >
                <Feather
                  name="edit"
                  size={22}
                  color="#4A90E2"
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  handleDelete(item.id)
                }
              >
                <Feather
                  name="trash-2"
                  size={22}
                  color="#E83E48"
                />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        style={[
          styles.card,
          { backgroundColor: "#E83E48" },
        ]}
        onPress={() => makeCall("999")}
      >
        <Feather
          name="truck"
          size={24}
          color="#fff"
        />

        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            marginLeft: 10,
          }}
        >
          Call Ambulance (999)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAF9",
    padding: 24,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },

  notice: {
    flexDirection: "row",
    backgroundColor: "#DDF5F1",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },

  noticeText: {
    flex: 1,
    color: "#6F747B",
  },

  input: {
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  saveBtn: {
    height: 54,
    backgroundColor: "#2FA99A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
  },

  info: {
    color: "#6F747B",
    marginTop: 3,
  },

  actions: {
    gap: 16,
    alignItems: "center",
  },
});