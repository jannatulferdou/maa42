import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language || "en");

  const changeLanguage = async (lang: "en" | "bn") => {
    await i18n.changeLanguage(lang);
    setActiveLang(lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image
          source={require("../../assets/images/maa42-logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>{t("onboarding.title")}</Text>

      <Text style={styles.subtitle}>{t("onboarding.subtitle")}</Text>

      <Text style={styles.label}>{t("onboarding.chooseLanguage")}</Text>

      <View style={styles.langRow}>
        <Pressable
          style={[styles.langBtn, activeLang === "en" && styles.activeLang]}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.langText}>English</Text>
        </Pressable>

        <Pressable
          style={[styles.langBtn, activeLang === "bn" && styles.activeLang]}
          onPress={() => changeLanguage("bn")}
        >
          <Text style={styles.langText}>বাংলা</Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryBtn} onPress={() => router.push("/login")}>
        <Text style={styles.primaryText}>{t("onboarding.getStarted")}</Text>
      </Pressable>

      <Text style={styles.footer}>{t("onboarding.footer")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 27,
    backgroundColor: "#F5FAF9",
    justifyContent: "center",
  },
  imageBox: {
    alignItems: "center",
    marginBottom: 45,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#263238",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#7B8288",
    marginTop: 8,
    marginBottom: 45,
  },
  label: {
    textAlign: "center",
    color: "#8A8F95",
    marginBottom: 14,
  },
  langRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  langBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#C9D5D5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activeLang: {
    backgroundColor: "#DDF5F1",
    borderColor: "#2FA99A",
  },
  langText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37474F",
  },
  primaryBtn: {
    backgroundColor: "#32A99A",
    height: 56,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#8A8F95",
    fontSize: 12,
    marginTop: 20,
  },
});