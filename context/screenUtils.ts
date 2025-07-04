// React Native / Expo Version
import * as ImagePicker from "expo-image-picker";

export const pickImageAndConvertToBase64 = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission to access media library was denied");
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduce quality to keep file size manageable
      base64: true, // This will include base64 in the result
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];

      // Return the base64 string with proper data URI format
      return {
        base64: `data:${asset.type || "image/jpeg"};base64,${asset.base64}`,
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      };
    }
    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    throw error;
  }
};
