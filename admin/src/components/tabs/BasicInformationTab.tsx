import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input, Textarea } from "@nextui-org/react";
import ImageUploader from "@/components/ImageUploader";
import { uploadImage } from "@/helper/imageUploader";
import { FormikErrors, FormikTouched } from "formik";
import { SubjectType } from "@/types/subjects.types";

interface BasicInformationTabProps {
  values: SubjectType;
  errors: FormikErrors<SubjectType>;
  touched: FormikTouched<SubjectType>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mt-4"
    >
      <Input
        label="Subject Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={touched.name && !!errors.name}
        errorMessage={touched.name && errors.name}
        classNames={{
          input: "bg-transparent",
          inputWrapper:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
      />
      <Input
        label="Subject Code"
        name="code"
        value={values.code}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={touched.code && !!errors.code}
        errorMessage={touched.code && errors.code}
        classNames={{
          input: "bg-transparent",
          inputWrapper:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={touched.description && !!errors.description}
        errorMessage={touched.description && errors.description}
        classNames={{
          input: "bg-transparent",
          inputWrapper:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
      />
      <ImageUploader
        values={values}
        setProgress={setProgress}
        previewImg={previewImg}
        setPreviewImg={setPreviewImg}
        file={file}
        setFile={setFile}
        progress={progress}
        uploadImage={uploadImage}
        setFieldValue={setFieldValue}
        errors={errors}
        touched={touched}
        handleBlur={handleBlur}
      />
    </motion.div>
  );
};

export default BasicInformationTab;
