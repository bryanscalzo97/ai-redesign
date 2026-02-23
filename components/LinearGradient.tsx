import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, type ColorValue } from "react-native";

interface LinearGradientComponentProps {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  locations?: readonly [number, number, ...number[]];
}

export default function LinearGradientComponent({
  colors,
  locations,
}: LinearGradientComponentProps) {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      style={styles.background}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
});
