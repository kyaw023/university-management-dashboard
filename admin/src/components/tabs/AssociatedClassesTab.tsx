import React from "react";
import { motion } from "framer-motion";
import { FieldArray } from "formik";
import { Select, SelectItem, Button } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import { SubjectType } from "@/types/subjects.types";
import { Course } from "@/types/classes.types";

interface AssociatedClassesTabProps {
  values: SubjectType;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  classes: Course[];
}

const AssociatedClassesTab: React.FC<AssociatedClassesTabProps> = ({
  values,
  setFieldValue,
  classes,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mt-4"
    >
      <FieldArray name="classes">
        {({ push, remove }) => (
          <div>
            {values.classes.map((_, index) => (
              <div key={index} className="flex gap-2 mb-4">
                <Select
                  label={`Class ${index + 1}`}
                  name={`classes.${index}`}
                  selectedKeys={
                    values.classes[index] ? [values.classes[index]] : []
                  }
                  onChange={(e) =>
                    setFieldValue(`classes.${index}`, e.target.value)
                  }
                  classNames={{
                    trigger:
                      "bg-default-100/50 dark:bg-default-50/50 backdrop-blur-md border-divider",
                  }}
                >
                  {classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </Select>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            <Button color="secondary" variant="flat" onClick={() => push("")}>
              <Plus size={18} /> Add Class
            </Button>
          </div>
        )}
      </FieldArray>
    </motion.div>
  );
};

export default AssociatedClassesTab;
