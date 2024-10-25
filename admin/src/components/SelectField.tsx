import { Select, SelectItem } from "@nextui-org/react";

interface Option {
  _id: string;
  name: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  value: string | string[];
  onChange: (field: string, value: any) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: string | undefined;
  multiple?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
  multiple = false,
}) => {
  return (
    <Select
      name={name}
      label={label}
      value={value} // should be an array for multiple selection
      selectedKeys={Array.isArray(value) ? value : [value]} // ensure value is an array for selectedKeys
      placeholder={`Select ${label.toLowerCase()}`}
      selectionMode={multiple ? "multiple" : "single"}
      onSelectionChange={(selectedKeys) => {
        const selectedArray = Array.from(selectedKeys);
        // Call onChange with correct value based on selection mode
        onChange(name, multiple ? selectedArray : selectedArray[0]);
      }}
      onBlur={onBlur}
      errorMessage={error} // Ensure this prop is correctly used
    >
      {options &&
        options.map((option) => (
          <SelectItem key={option._id} value={option._id}>
            {option.name}
          </SelectItem>
        ))}
    </Select>
  );
};
