import React from "react";
import { Select, SelectItem } from "@nextui-org/react";


import FormComponent from "../Form.component";
import { TeacherType } from "@/types/teachers.type";

interface EmploymentDetailsProps {
  values: TeacherType;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  classLists: Array<{ _id: string; name: string }>;
  setFieldValue: (field: string, value: any) => void;
}

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  classLists,
  setFieldValue,
}) => {
  const qualificationOptions = [
    "SSC",
    "HSC",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "PhD",
    "Other",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <FormComponent
        name="salary"
        handleBlur={handleBlur}
        handleChange={handleChange}
        placeholder="Enter salary"
        type="number"
        value={values.salary}
        error={errors.salary}
        touched={touched.salary}
        className="h-12"
      />

      <FormComponent
        name="hire_date"
        handleBlur={handleBlur}
        handleChange={handleChange}
        placeholder="Enter hire date"
        type="date"
        value={values.hire_date}
        error={errors.hire_date}
        touched={touched.hire_date}
        className="h-12"
      />

      <Select
        name="classes"
        label="Classes"
        variant="bordered"
        selectedKeys={values.classes}
        placeholder="Select classes"
        value={values.classes}
        selectionMode="multiple"
        onSelectionChange={(selectedKeys) => {
          const selectedArray = Array.from(selectedKeys); // Convert selectedKeys to an array
          console.log("Selected array: classes->", selectedArray);
          setFieldValue("classes", selectedArray); // Set the selected array in Formik
        }}
        onBlur={handleBlur}
        errorMessage={touched.subjects && errors.subjects}
      >
        {classLists.map((option) => (
          <SelectItem key={option._id} value={option._id}>
            {option.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        name="qualifications"
        label="Qualifications"
        variant="bordered"
        placeholder="Select qualifications"
        selectionMode="multiple"
        selectedKeys={values.qualifications}
        value={values.qualifications}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedArray =
            typeof e.target.value === "string"
              ? e.target.value.split(",")
              : e.target.value;
          // Now you can set the field value
          console.log(selectedArray);
          setFieldValue("qualifications", selectedArray);
        }} // Ensuring array
        errorMessage={touched.qualifications && errors.qualifications}
      >
        {qualificationOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default EmploymentDetails;
