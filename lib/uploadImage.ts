import { upload } from "@imagekit/next";

export const uploadImage = async (file: File): Promise<string> => {
  const authRes = await fetch("/api/upload-auth");
  if (!authRes.ok) {
    throw new Error("Failed to get upload authentication");
  }
  const { token, expire, signature, publicKey } = await authRes.json();

  const uploadResponse = await upload({
    file,
    fileName: file.name,
    token,
    expire,
    signature,
    publicKey,
  });

  return uploadResponse.url as string;
};