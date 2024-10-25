import { Input } from "@nextui-org/react";
import { motion } from "framer-motion";
const FormField: React.FC<{
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: string | undefined | false;
  type?: string;
}> = ({ label, name, value, onChange, onBlur, error, type = "text" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Input
      label={label}
      name={name}
      value={value as string}
      defaultValue={value as string}
      onChange={onChange}
      onBlur={onBlur}
      type={type}
      isInvalid={!!error}
      errorMessage={error}
      classNames={{
        label: "text-gray-700 dark:text-gray-300",
      }}
    />
  </motion.div>
);

export default FormField;
