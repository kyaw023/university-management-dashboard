// ImageUploader.tsx
import React, { useRef } from "react";
import { Button, Progress } from "@nextui-org/react";
import { CameraIcon, TrashIcon } from "lucide-react";
import FormComponent from "./Form.component";

import { toast } from "sonner";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { Student } from "@/types/students.types";
import { TeacherType } from "@/types/teachers.type";
import { SubjectType } from "@/types/subjects.types";
import { Errors, Touched } from "@/types/Errors.types";

interface ImageUploaderProps {
  previewImg: string | null;
  setPreviewImg: React.Dispatch<React.SetStateAction<string | null>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  progress: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: Student | TeacherType | SubjectType;
  errors: Errors;
  touched: Touched;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  uploadImage: (image: File, setProgress: any) => Promise<string | null>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

// ImageUploader component for handling image uploads and previews
const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewImg,
  setPreviewImg,
  file,
  setFile,
  progress,
  setFieldValue,
  uploadImage,
  values,
  errors,
  touched,
  handleBlur,
  setProgress,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);

    // Check if file is defined
    if (file) {
      setFieldValue("image", file);
      setPreviewImg(URL.createObjectURL(file)); // Set the preview image
    } else {
      // Handle the case where no file is selected if needed
      setPreviewImg(null); // Or any default image URL you prefer
    } // Set the preview image
  };

  const handleRef = () => {
    console.log(imageInputRef.current);
    // You can access inputRef.current here if needed
    if (imageInputRef.current) {
      // Perform actions with the input reference
      imageInputRef.current.click(); // For example, triggering the input click
    }
  };

  // Define the function to upload the image

  //   Delete image from firebase storage
  const deleteImageFromFirebase = async (imagePath = "") => {
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className=" col-span-2">
      <div className="flex items-center gap-3">
        <FormComponent
          ref={imageInputRef}
          handleChange={handleImageChange}
          handleBlur={handleBlur}
          name="image"
          placeholder="Image"
          type="file"
          error={errors.image}
          touched={touched.image}
          className="hidden"
        />
        <Button onClick={handleRef} color="success" endContent={<CameraIcon />}>
          Take a image
        </Button>

        <Button
          disabled={(progress > 0 && progress < 100) || previewImg === null}
          onClick={async () => {
            const downloadURL = await uploadImage(
              values.image as File,
              setProgress
            );
            if (downloadURL) {
              setFieldValue("image", downloadURL);
              toast.success("Image uploaded successfully!");
            } else {
              toast.error("Failed to upload image. Please try again.");
            }
          }}
          variant="faded"
          color="secondary"
        >
          {progress > 1 && progress < 100 ? (
            <Progress
              aria-label="Downloading..."
              size="md"
              value={progress}
              color="success"
              showValueLabel={true}
              className="max-w-md"
            />
          ) : progress === 100 ? (
            "Uploaded"
          ) : (
            "Upload"
          )}
        </Button>
      </div>
      <div>
        {previewImg && (
          <div className="flex items-center gap-3">
            <img className="w-24 h-24 object-contain" src={previewImg} alt="" />
            <Button
              color="danger"
              variant="faded"
              size="md"
              isIconOnly
              onClick={() => {
                // Define the relative path for the image
                const relativePath = `images/${file?.name}`; // Make sure previewImg has the correct filename

                // Call the delete function with the relative path
                deleteImageFromFirebase(relativePath)
                  .then(() => {
                    // Clear the image field and preview
                    setFieldValue("image", null);
                    setPreviewImg(null);
                    toast.success("Image deleted successfully!");
                  })
                  .catch((error) => {
                    console.error("Error deleting image: ", error);
                    toast.error("Failed to delete image.");
                  });
              }}
              startContent={<TrashIcon size={16} />}
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
