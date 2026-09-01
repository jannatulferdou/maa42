import Footer, { FooterTab } from "./Footer";

type PregnantFooterProps = {
  activeTab?: "home" | "health" | "appointments" | "chat" | "profile";
};

const TABS: FooterTab[] = [
  {
    key: "health",
    label: "Health",
    route: "/(health)/checkin",
    icon: "heart-pulse",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    key: "appointments",
    label: "Appointments",
    route: "/(reminder)/reminder",
    icon: "calendar",
    iconLibrary: "Feather",
  },
  {
    key: "home",
    label: "Home",
    route: "/(home)/pregnant",
    icon: "home",
    iconLibrary: "Feather",
  },
  {
    key: "chat",
    label: "Chat",
    route: "/(chat)",
    icon: "chatbubble-outline",
    iconLibrary: "Ionicons",
  },
  {
    key: "profile",
    label: "Profile",
    route: "/(profile)/medicalProfile",
    icon: "file-text",
    iconLibrary: "Feather",
  },
];

export default function PregnantFooter({ activeTab = "home" }: PregnantFooterProps) {
  return <Footer tabs={TABS} activeTab={activeTab} />;
}
