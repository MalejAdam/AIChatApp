import { Href, Redirect } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { urls } from "@/src/consts";

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href={urls.login as Href} />;
  }

  return <Redirect href={urls.chat as Href} />;
}
