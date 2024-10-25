import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Zap, X } from "lucide-react";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
}) => (
  <Select
    label="Quantum State"
    value={value}
    placeholder="Select a status"
    selectedKeys={new Set([value])} // Ensure selectedKeys is in a Set
    
    onSelectionChange={(keys) => onChange(Array.from(keys)[0] as string)}
    classNames={{
      label: "text-gray-700 dark:text-gray-300",
      trigger:
        "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
      listbox: "bg-white dark:bg-gray-800",
    }}
  >
    <SelectItem key="active" value="active" textValue="active">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-green-500 dark:text-green-400" />
        <span className="text-gray-700 dark:text-gray-300">Active</span>
      </div>
    </SelectItem>
    <SelectItem key="completed" value="completed">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        <span className="text-gray-700 dark:text-gray-300">Completed</span>
      </div>
    </SelectItem>
    <SelectItem key="cancelled" value="cancelled">
      <div className="flex items-center gap-2">
        <X className="w-4 h-4 text-red-500 dark:text-red-400" />
        <span className="text-gray-700 dark:text-gray-300">Cancelled</span>
      </div>
    </SelectItem>
  </Select>
);
