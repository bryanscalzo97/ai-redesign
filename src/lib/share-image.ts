import { File, Directory, Paths } from "expo-file-system";
import { shareAsync } from "expo-sharing";

/** Share a base64 image via the native share sheet. */
export async function shareBase64Image(
  base64: string,
  ext: "png" | "jpg" = "png"
) {
  const shareDir = new Directory(Paths.cache, "share");
  if (!shareDir.exists) {
    shareDir.create();
  }

  const fileName = `redesign-${Date.now()}.${ext}`;
  const file = new File(shareDir, fileName);
  file.create();
  file.write(base64, { encoding: "base64" });

  await shareAsync(file.uri, {
    mimeType: ext === "png" ? "image/png" : "image/jpeg",
    dialogTitle: "Share your redesign",
  });
}
