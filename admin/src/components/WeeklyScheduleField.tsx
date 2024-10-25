import { Button, Divider, Select, SelectItem } from "@nextui-org/react";
import FormField from "./FormField";

import { FormikErrors } from "formik";
import React from "react";

interface Option {
  _id: string;
  name: string;
}

interface WeeklyScheduleFieldProps {
  values: any[];
  subjects: Option[];
  teachers: Option[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
  errors: any;
  touched: any;
  onBlur: (e: React.FocusEvent<any>) => void;
}

const dayOptions = [
  { _id: "Monday", name: "Monday" },
  { _id: "Tuesday", name: "Tuesday" },
  { _id: "Wednesday", name: "Wednesday" },
  { _id: "Thursday", name: "Thursday" },
  { _id: "Friday", name: "Friday" },
  { _id: "Saturday", name: "Saturday" },
  { _id: "Sunday", name: "Sunday" },
];

export const WeeklyScheduleField: React.FC<WeeklyScheduleFieldProps> = ({
  values,
  subjects,
  setFieldValue,
  errors,
  teachers,
  touched,
  onBlur,
}) => (
  <div>
    {values.map((schedule, index) => (
      <div key={index} className="space-y-4">
        <Select
          name={`weeklySchedule[${index}].day`}
          label={"Day"}
          value={schedule.day}
          selectedKeys={[schedule.day]}
          placeholder={`Select ${"Day".toLowerCase()}`}
          onChange={(e: React.ChangeEvent<any>) => {
            setFieldValue(`weeklySchedule[${index}].day`, e.target.value);
          }}
          onBlur={onBlur}
          errorMessage={errors.weeklySchedule?.[index]?.day} // Ensure this prop is correctly used
        >
          {dayOptions.map((option) => (
            <SelectItem key={option._id} value={option._id}>
              {option.name}
            </SelectItem>
          ))}
        </Select>

        <FormField
          label="Start Time"
          name={`weeklySchedule[${index}].start_time`}
          value={schedule.start_time}
          onChange={(e) =>
            setFieldValue(`weeklySchedule[${index}].start_time`, e.target.value)
          }
          onBlur={onBlur}
          error={
            touched.weeklySchedule?.[index]?.start_time &&
            errors.weeklySchedule?.[index]?.start_time
          }
          type="time"
        />
        <FormField
          onBlur={onBlur}
          label="End Time"
          name={`weeklySchedule[${index}].end_time`}
          value={schedule.end_time}
          onChange={(e) =>
            setFieldValue(`weeklySchedule[${index}].end_time`, e.target.value)
          }
          error={
            touched.weeklySchedule?.[index]?.end_time &&
            errors.weeklySchedule?.[index]?.end_time
          }
          type="time"
        />

        <Select
          name={`weeklySchedule[${index}].subject`}
          label={"Subject"}
          value={schedule.subject}
          selectedKeys={[schedule.subject]}
          placeholder={`Select ${"Subject".toLowerCase()}`}
          onChange={(e: React.ChangeEvent<any>) => {
            setFieldValue(`weeklySchedule[${index}].subject`, e.target.value);
          }}
          onBlur={onBlur}
          errorMessage={errors.weeklySchedule?.[index]?.subject} // Ensure this prop is correctly used
        >
          {subjects.map((option) => (
            <SelectItem key={option._id} value={option._id}>
              {option.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          name={`weeklySchedule[${index}].teacher`}
          label={"Teacher"}
          value={schedule.teacher}
          selectedKeys={[schedule.teacher]}
          placeholder={`Select ${"Teacher".toLowerCase()}`}
          onChange={(e: React.ChangeEvent<any>) => {
            setFieldValue(`weeklySchedule[${index}].teacher`, e.target.value);
          }}
          onBlur={onBlur}
          errorMessage={errors.weeklySchedule?.[index]?.teacher} // Ensure this prop is correctly used
        >
          {teachers.map((option) => (
            <SelectItem key={option._id} value={option._id}>
              {option.name}
            </SelectItem>
          ))}
        </Select>

        <Button
          color="warning"
          onClick={() => {
            const updatedSchedule = values.filter((_, i) => i !== index);
            setFieldValue("weeklySchedule", updatedSchedule);
          }}
        >
          Remove Schedule
        </Button>
        <Divider className="bg-gray-200 dark:bg-gray-700" />
      </div>
    ))}
    <Button
      color="success"
      onClick={() => {
        setFieldValue("weeklySchedule", [
          ...values,
          { day: "", start_time: "", end_time: "", subject: "" },
        ]);
      }}
    >
      Add New Schedule
    </Button>
  </div>
);
