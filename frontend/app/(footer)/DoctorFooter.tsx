import Footer, { FooterTab } from "./Footer";

type DoctorFooterProps = {
  activeTab?: "home" | "patients" | "messages" | "profile";
};

const TABS: FooterTab[] = [
  {
    key: "home",
    label: "Home",
    route: "/(home)/doctor",
    icon: "home",
    iconLibrary: "Feather",
  },
  {
    key: "patients",
    label: "Patients",
    route: "/(patients)",
    icon: "users",
    iconLibrary: "Feather",
  },
  {
    key: "messages",
    label: "Messages",
    route: "/(messages)",
    icon: "chatbubble-outline",
    iconLibrary: "Ionicons",
  },
  {
    key: "profile",
    label: "Profile",
    route: "/(profile)/doctorProfile",
    icon: "user",
    iconLibrary: "Feather",
  },
];

export default function DoctorFooter({ activeTab = "home" }: DoctorFooterProps) {
  return <Footer tabs={TABS} activeTab={activeTab} />;
}
