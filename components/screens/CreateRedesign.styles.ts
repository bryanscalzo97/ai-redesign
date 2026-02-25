import {
  BORDER_RADIUS,
  FONT_SIZE,
  SPACING,
} from "@/constants/designTokens";
import { StyleSheet } from "react-native";

export const createRedesignStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  contentContainer: {
    paddingBottom: SPACING.XL,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    marginBottom: SPACING.SM,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  imagePlaceholderText: {
    fontSize: FONT_SIZE.MD,
    opacity: 0.6,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  chip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
  },
  chipSelected: {
    opacity: 1,
  },
  chipUnselected: {
    opacity: 0.6,
  },
  instructionsInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  generateButton: {
    marginTop: SPACING.MD,
  },
});
