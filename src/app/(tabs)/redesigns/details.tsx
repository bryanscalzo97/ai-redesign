import { RedesignDetail } from "@/components/screens/RedesignDetail";
import { Stack } from "expo-router";

export default function RedesignDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Redesign", headerBackTitle: "Back" }} />
      <RedesignDetail />
    </>
  );
}
