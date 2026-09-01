import { Colors } from "@/constants/theme";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Shared bottom tab bar used by every role (pregnant, postpartum, doctor).
 *
 * Previously each role had its own copy-pasted footer component with
 * identical layout and styles and only the tab config (icon/label/route)
 * differing. That meant any style tweak (padding, colors, icon size) had
 * to be made in three places and would silently drift out of sync.
 * Now there's a single implementation; role-specific files just supply
 * their tab list.
 */

const ICON_LIBRARIES = {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} as const;

export type FooterIconLibrary = keyof typeof ICON_LIBRARIES;

export type FooterTab = {
  /** Unique key for this tab, also matched against `activeTab`. */
  key: string;
  label: string;
  /** Route passed to `router.push`. */
  route: string;
  /** Icon name within the chosen icon library. */
  icon: string;
  iconLibrary: FooterIconLibrary;
};

type FooterProps = {
  tabs: FooterTab[];
  activeTab?: string;
};

export default function Footer({ tabs, activeTab }: FooterProps) {
  const getColor = (tabKey: string) =>
    activeTab === tabKey ? Colors.light.primary : "#A7AFB3";

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = ICON_LIBRARIES[tab.iconLibrary];
        return (
          <Pressable
            key={tab.key}
            style={styles.navItem}
            onPress={() => router.push(tab.route as any)}
          >
            <IconComponent
              name={tab.icon as any}
              size={23}
              color={getColor(tab.key)}
            />
            <Text style={[styles.label, { color: getColor(tab.key) }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 7,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
});
