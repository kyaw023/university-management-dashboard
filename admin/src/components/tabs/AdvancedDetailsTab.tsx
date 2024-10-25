import React from "react";
import { motion } from "framer-motion";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { FormikErrors, FormikTouched } from "formik";
import { TeacherType } from "@/types/teachers.type";
import { SubjectType } from "@/types/subjects.types";

interface AdvancedDetailsTabProps {
  values: SubjectType;
  errors: FormikErrors<SubjectType>;
  touched: FormikTouched<SubjectType>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  teachers: TeacherType[];
}

const AdvancedDetailsTab: React.FC<AdvancedDetailsTabProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  teachers,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mt-4"
    >
      <Input
        label="Credits"
        name="credits"
        type="number"
        value={values.credits.toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={touched.credits && !!errors.credits}
        errorMessage={touched.credits && errors.credits}
        classNames={{
          input: "bg-transparent",
          inputWrapper:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
      />
      <Select
        label="Teachers"
        name="teacher"
        placeholder="Select a teacher"
        classNames={{
          trigger:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
        selectedKeys={values.teacher ? [values.teacher] : []}
        onChange={(e) => setFieldValue("teacher", e.target.value)}
      >
        {teachers.map((teacher) => (
          <SelectItem
            className="capitalize"
            key={teacher._id as string}
            value={teacher._id}
          >
            {teacher.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Department"
        name="department"
        selectedKeys={values.department ? [values.department] : []}
        onChange={(e) => setFieldValue("department", e.target.value)}
        classNames={{
          trigger:
            "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
        }}
      >
        <SelectItem key="science" value="science">
          Quantum Science
        </SelectItem>
        <SelectItem key="math" value="math">
          Astro-Mathematics
        </SelectItem>
        <SelectItem key="tech" value="tech">
          Nano-Technology
        </SelectItem>
      </Select>
    </motion.div>
  );
};

export default AdvancedDetailsTab;
