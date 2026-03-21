import { File, Directory, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export const ALBUM_NAME = "AI Redesign";

async function ensureWritePermission() {
  const p = await MediaLibrary.getPermissionsAsync();
  if (!p.granted) {
    const r = await MediaLibrary.requestPermissionsAsync();
    if (!r.granted) throw new Error("Photos permission denied.");
  }
}

async function getOrCreateAlbumWith(asset: MediaLibrary.Asset) {
  let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  if (!album) {
    album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, true);
  } else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  }
  return album;
}

/** Save a base64 image into Photos (and into the app's album). */
export async function saveBase64ToAlbum(
  base64: string,
  ext: "png" | "jpg" = "png"
) {
  await ensureWritePermission();

  const cacheDir = new Directory(Paths.cache, "generated");
  if (!cacheDir.exists) {
    cacheDir.create();
  }

  const fileName = `${Date.now()}.${ext}`;
  const file = new File(cacheDir, fileName);
  file.create();
  file.write(base64, { encoding: "base64" });

  const asset = await MediaLibrary.createAssetAsync(file.uri);
  const album = await getOrCreateAlbumWith(asset);

  return { assetId: asset.id, albumId: album.id, uri: asset.uri };
}
