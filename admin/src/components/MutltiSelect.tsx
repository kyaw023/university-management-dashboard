import { Course } from "@/types/classes.types";
import { SubjectType } from "@/types/subjects.types";
import { TeacherType } from "@/types/teachers.type";
import { Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";

const MultiSelect: React.FC<{
  label: string;
  name: string;
  value: string[];
  options: SubjectType[] | TeacherType[] | Course[];
  icon: React.ReactNode;
  setFieldValue: (field: string, value: any) => void;
}> = ({ label, name, value, options, icon, setFieldValue }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <Select
      label={label}
      name={name}
      selectionMode="multiple"
      selectedKeys={value}
      onSelectionChange={(selectedKeys) => {
        const selectedArray = Array.from(selectedKeys); // Convert selectedKeys to an array
        setFieldValue(name, selectedArray); // Set the selected array in Formik
      }}
      classNames={{
        label: "text-gray-700 dark:text-gray-300",
        trigger:
          "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
        listbox: "bg-white dark:bg-gray-800",
      }}
    >
      {options.map((option) => (
        <SelectItem key={option._id as string} value={option._id}>
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-gray-700 dark:text-gray-300">
              {option.name}
            </span>
          </div>
        </SelectItem>
      ))}
    </Select>
  </motion.div>
);

export default MultiSelect;
