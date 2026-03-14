import { AuthContent } from "@/components/auth/AuthContent";
import { useRouter } from "expo-router";

export default function AuthSheet() {
  const router = useRouter();

  const handleSuccess = () => {
    router.dismiss();
  };

  return (
    <AuthContent
      title="Welcome!"
      description="Please sign in to continue."
      onSuccess={handleSuccess}
    />
  );
}
