import React from "react";
import { Select, SelectItem, Textarea } from "@nextui-org/react";

import FormComponent from "../Form.component";
import ImageUploader from "../ImageUploader";
import {
  useGetSubjectListsQuery,
} from "@/store/endpoints/subjectEndpoints";
import { TeacherType } from "@/types/teachers.type";

interface PersonalInformationProps {
  values: TeacherType;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any) => void;
  previewImg: string | null;
  setPreviewImg: React.Dispatch<React.SetStateAction<string | null>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadImage: (image: File, setProgress: any) => Promise<string | null>;
}

const PersonalInformationComponent: React.FC<PersonalInformationProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  previewImg,
  setPreviewImg,
  setProgress,
  progress,
  file,
  setFile,
  uploadImage,
}) => {
  const { data: subjects } = useGetSubjectListsQuery();

  const subjectLists = subjects || [];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <FormComponent
        value={values.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="name"
        placeholder="Name"
        type="text"
        error={errors.name}
        touched={touched.name}
        className="h-12"
      />
      <FormComponent
        name="email"
        handleBlur={handleBlur}
        handleChange={handleChange}
        value={values.email}
        placeholder="Email"
        type="email"
        error={errors.email}
        touched={touched.email}
        className="h-12"
      />
      <FormComponent
        name="password"
        handleBlur={handleBlur}
        handleChange={handleChange}
        value={values.password}
        placeholder="Password"
        type="password"
        error={errors.password}
        touched={touched.password}
        className="h-12"
      />
      <FormComponent
        name="phone"
        handleBlur={handleBlur}
        handleChange={handleChange}
        value={values.phone}
        placeholder="Phone"
        type="text"
        error={errors.phone}
        touched={touched.phone}
        className="h-12"
      />
      <FormComponent
        name="date_of_birth"
        handleBlur={handleBlur}
        handleChange={handleChange}
        value={values.date_of_birth}
        placeholder="Date of Birth"
        type="date"
        error={errors.date_of_birth}
        touched={touched.date_of_birth}
        className="h-12"
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
        errors={errors} // Pass the errors
        touched={touched} // Pass the touched
        handleBlur={handleBlur}
      />

      <Select
        name="gender"
        label="Gender"
        variant="bordered"
        placeholder="Select gender"
        selectedKeys={[values.gender]}
        value={values.gender}
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={touched.gender && errors.gender}
      >
        {genderOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        name="subjects"
        label="Subjects"
        variant="bordered"
        selectedKeys={values.subjects}
        placeholder="Select subjects"
        value={values.subjects}
        selectionMode="multiple"
        onSelectionChange={(selectedKeys) => {
          console.log("selectedKeys", selectedKeys);
          const selectedArray = Array.from(selectedKeys); // Convert selectedKeys to an array

          setFieldValue("subjects", selectedArray); // Set the selected array in Formik
        }}
        onBlur={handleBlur}
        errorMessage={touched.subjects && errors.subjects}
      >
        {subjectLists.map((option) => (
          <SelectItem key={option._id as string} value={option._id}>
            {option.name}
          </SelectItem>
        ))}
      </Select>

      <Textarea
        name="address"
        variant="bordered"
        label="Address"
        placeholder="Enter address"
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={touched.address && errors.address}
      />
    </div>
  );
};

export default PersonalInformationComponent;
