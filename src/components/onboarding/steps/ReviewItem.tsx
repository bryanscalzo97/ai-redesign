import { Colors } from "@/theme/colors";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "@/components/ui/Text";

export type Review = {
  stars: number;
  title: string;
  review: string;
  createdAt: Date;
  author: string;
};

const REVIEW_ANIMATION_CONFIG = {
  initialDelay: 200,
  staggerDelay: 100,
  fadeDuration: 350,
};

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

interface ReviewItemProps {
  review: Review;
  index: number;
}

export function ReviewItem({ review, index }: ReviewItemProps) {
  const enteringDelay =
    REVIEW_ANIMATION_CONFIG.initialDelay +
    index * REVIEW_ANIMATION_CONFIG.staggerDelay;

  return (
    <Animated.View
      entering={FadeIn.duration(REVIEW_ANIMATION_CONFIG.fadeDuration).delay(enteringDelay)}
      exiting={FadeOut.duration(200)}
      style={{
        borderRadius: 16,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginRight: 12,
        width: 280,
        height: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Stars */}
      <View style={{ flexDirection: "row", gap: 3, marginBottom: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Text
            key={i}
            style={{
              color: i < review.stars ? Colors.amber[400] : "rgba(0,0,0,0.12)",
              fontSize: 18,
            }}
          >
            ★
          </Text>
        ))}
      </View>

      {/* Title */}
      <Text weight="bold" style={{ marginBottom: 4, fontSize: 15, color: "#1a1a1a" }}>
        {review.title}
      </Text>

      {/* Review text */}
      <Text
        style={{
          color: "rgba(0,0,0,0.5)",
          marginBottom: 10,
          lineHeight: 19,
          fontSize: 14,
          flex: 1,
        }}
        numberOfLines={3}
      >
        {review.review}
      </Text>

      {/* Author + Date */}
      <View>
        <Text style={{ color: "rgba(0,0,0,0.6)", fontSize: 13, fontWeight: "500" }}>
          {review.author}
        </Text>
        <Text style={{ color: "rgba(0,0,0,0.3)", fontSize: 12, marginTop: 2 }}>
          {formatDate(review.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
}
