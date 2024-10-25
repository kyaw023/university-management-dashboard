import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Adjust the path as necessary

// Define the function to upload the image
 export const uploadImage = async (file: File | null): Promise<string | null> => {
  if (!file) return null; // Check if a file is provided

  const storageRef = ref(storage, `images/${file.name}`); // Customize the path
  await uploadBytes(storageRef, file); // Upload the file

  // Get the download URL
  const url = await getDownloadURL(storageRef);
  return url; // Return the download URL
};
