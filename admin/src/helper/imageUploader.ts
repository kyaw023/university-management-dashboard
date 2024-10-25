import { app } from "@/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const uploadImage = async (
  image: File,
  setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<string | null> => {
  try {
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${image.name}`);

    // Upload the image
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Await the upload completion
    return await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress)); // Update progress
        },
        (error) => {
          console.error("Error uploading image:", error);
          reject(error); // Reject the promise on error
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL); // Resolve with the download URL
        }
      );
    });
  } catch (error) {
    console.error("Error during image upload:", error);
    return null; // Return null in case of an error
  }
};
