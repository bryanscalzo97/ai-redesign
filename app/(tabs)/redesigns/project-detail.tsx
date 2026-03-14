import { ProjectDetail } from "@/components/screens/ProjectDetail";
import { Stack } from "expo-router";

export default function ProjectDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Property", headerBackTitle: "Back" }} />
      <ProjectDetail />
    </>
  );
}
