import { Colors } from "@/constants/theme";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
  MaterialCommunityIcons,
  
} from "@expo/vector-icons";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import PregnantFooter from "../(footer)/PregnantFooter";
import PostpartumFooter from "../(footer)/PostpartumFooter";

const { width } = Dimensions.get("window");

export default function CommunityScreen() {
  const { user } = useAuth();
  const careStage = user?.careStage || "pregnant";

  const [dots, setDots] = useState("");
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => {
      clearInterval(dotInterval);
      rotateAnim.stopAnimation();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-3deg", "3deg"],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.background, "#E8F5F1", Colors.light.primaryLight]}
        style={styles.backgroundGradient}
      />

      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.primaryDark]}
            style={styles.iconGradient}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={60}
              color={Colors.light.white}
            />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Community</Text>
        <Text style={styles.comingSoon}>Coming Soon{dots}</Text>

        {/* Description */}
        <Text style={styles.description}>
          We are building a safe space for mothers to connect, share experiences,
          and support each other throughout their journey.
        </Text>

        {/* Features Preview */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Whats Coming:</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="message-circle" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Discussion Forums</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="users" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Support Groups</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="share-2" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Experience Sharing</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="heart" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Peer Support</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Q&A Sessions</Text>
          </View>
        </View>

        {/* Work in Progress Badge */}
        <View style={styles.wipBadge}>
          <Feather name="tool" size={16} color={Colors.light.accent} />
          <Text style={styles.wipText}>Work in Progress</Text>
        </View>

        {/* Back Button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={Colors.light.primary} />
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>

      {/* Footer */}
      {careStage === "pregnant" ? (
        <PregnantFooter  />
      ) : (
        <PostpartumFooter />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 500,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 27,
    paddingBottom: 120,
  },
  iconContainer: {
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 4,
  },
  comingSoon: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: width * 0.85,
  },
  featuresCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#37474F",
    fontWeight: "600",
  },
  wipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 20,
  },
  wipText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.accent,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    gap: 8,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});