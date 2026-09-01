import Footer, { FooterTab } from "./Footer";

type PostpartumFooterProps = {
  activeTab?: "home" | "health" | "reminder" | "chat" | "profile";
};

const TABS: FooterTab[] = [
  {
    key: "health",
    label: "Health",
    route: "/(health)/checkin",
    icon: "emoticon-happy-outline",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    key: "reminder",
    label: "Reminder",
    route: "/(reminder)/reminder",
    icon: "bell",
    iconLibrary: "Feather",
  },
  {
    key: "home",
    label: "Home",
    route: "/(home)/postpartum",
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

export default function PostpartumFooter({ activeTab = "home" }: PostpartumFooterProps) {
  return <Footer tabs={TABS} activeTab={activeTab} />;
}
