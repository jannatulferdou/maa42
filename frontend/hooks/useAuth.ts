import { AuthContext } from "@/shared/context/AuthProvider";
import { useContext } from "react";

export default function useAuth() {
  return useContext(AuthContext);
}