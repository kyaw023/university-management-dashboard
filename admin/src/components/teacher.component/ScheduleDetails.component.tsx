import React from "react";
import { FieldArray } from "formik";
import { Button, Select, SelectItem } from "@nextui-org/react";

import { Plus, Trash2 } from "lucide-react";
import FormComponent from "../Form.component";
import { TeacherType } from "@/types/teachers.type";
import { SubjectType } from "@/types/subjects.types";

interface ScheduleDetailsProps {
  values: TeacherType;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  classLists: Array<{ _id: string; name: string }>;
  subjectLists: SubjectType[];
  setFieldValue: (field: string, value: any) => void;
}

const ScheduleDetailsComponent: React.FC<ScheduleDetailsProps> = ({
  values,
  errors,
  touched,
  handleBlur,
  classLists,
  subjectLists,
  setFieldValue,
}) => {
  return (
    <div className="mt-4">
      <FieldArray name="schedule">
        {({ push, remove }) => (
          <div className="space-y-4">
            {values.schedule.map((scheduleItem: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 items-center gap-4  p-4 rounded-lg"
              >
                <Select
                  selectedKeys={[scheduleItem.day]}
                  variant="bordered"
                  name={`schedule.${index}.day`}
                  label="Day"
                  value={scheduleItem.day}
                  onChange={(e) => {
                    setFieldValue(`schedule.${index}.day`, e.target.value);
                  }}
                >
                  {/* Add your day options here */}
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Start Time</label>
                    <FormComponent
                      name={`schedule.${index}.start_time`}
                      handleBlur={handleBlur}
                      handleChange={(e) => {
                        setFieldValue(
                          `schedule.${index}.start_time`,
                          e.target.value
                        );
                      }}
                      placeholder="Time"
                      type="time"
                      value={scheduleItem.start_time}
                      touched={touched.schedule?.[index]?.start_time}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label>End Time</label>
                    <FormComponent
                      name={`schedule.${index}.end_time`}
                      handleBlur={handleBlur}
                      handleChange={(e) => {
                        setFieldValue(
                          `schedule.${index}.end_time`,
                          e.target.value
                        );
                      }}
                      placeholder="Time"
                      type="time"
                      value={scheduleItem.end_time}
                      touched={touched.schedule?.[index]?.end_time}
                      className="h-12"
                    />
                  </div>
                </div>

                <Select
                  name="classes"
                  variant="bordered"
                  label="Classes"
                  placeholder="Select classes"
                  selectedKeys={[values.schedule[index].class]}
                  value={values.schedule[index].class}
                  onChange={(e) =>
                    setFieldValue(`schedule.${index}.class`, e.target.value)
                  }
                  errorMessage={touched.classes && errors.classes}
                >
                  {classLists.map((option) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  name="subjects"
                  label="Subjects"
                  variant="bordered"
                  placeholder="Select subjects"
                  selectedKeys={[values.schedule[index].subject]}
                  value={values.schedule[index].subject}
                  onChange={(e) =>
                    setFieldValue(`schedule.${index}.subject`, e.target.value)
                  }
                  errorMessage={touched.schedule && errors.classes}
                >
                  {subjectLists.map((option) => (
                    <SelectItem key={option._id as string} value={option._id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>

                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  aria-label="Delete schedule item"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            ))}
            <Button
              startContent={<Plus size={20} />}
              color="primary"
              variant="flat"
              onPress={() => push({ day: "", time: "", class: "" })}
            >
              Add Schedule Item
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default ScheduleDetailsComponent;
