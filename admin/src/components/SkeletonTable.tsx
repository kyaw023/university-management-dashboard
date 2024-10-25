import { Course } from "@/types/classes.types";
import { Student } from "@/types/students.types";
import React from "react";

// Common styles
const commonStyles = {
  bgColor: "bg-default-200",
  animationClass: "animate-pulse",
  roundedFull: "rounded-full",
  rounded: "rounded",
};

// Generic type for the entity (Course, Student, etc.)
type Entity = {
  [key: string]: any;
};

// Generic render skeleton cell function
function renderSkeletonCell<T extends Entity>(columnKey: React.Key) {
  switch (columnKey) {
    case "name":
      return (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${commonStyles.rounded} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
          ></div>
          <div className="flex flex-col space-y-1">
            <div
              className={`w-24 h-4 ${commonStyles.rounded} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
            ></div>
            <div
              className={`w-32 h-3 ${commonStyles.rounded} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
            ></div>
          </div>
        </div>
      );
    case "status":
      return (
        <div
          className={`w-16 h-6 ${commonStyles.roundedFull} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
        ></div>
      );
    case "actions":
      return (
        <div className="flex justify-end space-x-2">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 ${commonStyles.roundedFull} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
            ></div>
          ))}
        </div>
      );
    default:
      return (
        <div
          className={`w-full h-4 ${commonStyles.rounded} ${commonStyles.bgColor} ${commonStyles.animationClass}`}
        ></div>
      );
  }
}

type ExampleEntity = {
  name: string;
  status: string;
  active?: boolean;
};

export default function SkeletonTable() {
  const columns: React.Key[] = ["name", "status", "someOtherColumn", "actions"];

  return (
    <div className="w-full">
      {[1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          className="flex justify-between items-center py-4 border-b border-default-200"
        >
          {columns.map((column) => (
            <div key={column} className="px-4">
              {renderSkeletonCell<ExampleEntity>(column)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Helper function to create a skeleton for a specific entity type
export function createEntitySkeletonRenderer<T extends Entity>() {
  return (columnKey: React.Key) => renderSkeletonCell<T>(columnKey);
}

// Usage in Course component
export const renderClassSkeletonCell = createEntitySkeletonRenderer<Course>();

// Usage in Student component
export const renderStudentSkeletonCell =
  createEntitySkeletonRenderer<Student>();
