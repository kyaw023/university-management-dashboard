

import { Select, SelectItem } from "@nextui-org/react";
import FormComponent from "../Form.component";
import { Student } from "@/types/students.types";
import { Errors, Touched } from "@/types/Errors.types";
import { Course } from "@/types/classes.types";

interface FormFieldsProps {
  values: Student;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  errors: Errors;
  touched: Touched;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  classes?: Course[];
}

const studentStatus = ["active", "graduated", "dropped"];
const studentGender = ["male", "female", "other"];

const StudentFormFieldComponent = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  setFieldValue,
  classes,
}: FormFieldsProps) => {
  const classesList = classes || [];

  console.log(values.class, classesList);

  return (
    <>
      <FormComponent
        value={values.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="name"
        placeholder="Name"
        type="text"
        error={errors.name}
        touched={touched.name}
        className="h-12"
      />
      <FormComponent
        value={values.email}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="email"
        placeholder="Email"
        type="email"
        error={errors.email}
        touched={touched.email}
        className="h-12"
      />

      <FormComponent
        value={values.password}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="password"
        placeholder="Password"
        type="password"
        error={errors.password}
        touched={touched.password}
        className="h-12"
      />

      <FormComponent
        value={values.date_of_birth}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="date_of_birth"
        placeholder="Date of Birth"
        type="date"
        error={errors.date_of_birth}
        touched={touched.date_of_birth}
        className="h-12"
      />

      <Select
        label="Gender"
        placeholder="Select an gender"
        size="sm"
        selectedKeys={[values.gender]}
        value={values.gender}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFieldValue("gender", e.target.value)
        }
      >
        {studentGender.map((g) => (
          <SelectItem key={g} value={g}>
            {g}
          </SelectItem>
        ))}
      </Select>

      <FormComponent
        value={values.address}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="address"
        placeholder="Address"
        type="text"
        error={errors.address}
        touched={touched.address}
        className="h-12"
      />

      <FormComponent
        value={values.phone}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="phone"
        placeholder="Phone"
        type="text"
        error={errors.phone}
        touched={touched.phone}
        className="h-12"
      />

      <FormComponent
        value={values.roll_no}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="roll_no"
        placeholder="Roll No"
        type=" number"
        error={errors.roll_no}
        touched={touched.roll_no}
        className="h-12"
      />

      <FormComponent
        value={values.father_name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="father_name"
        placeholder="Father Name"
        type="text"
        error={errors.father_name}
        touched={touched.father_name}
        className="h-12"
      />

      <FormComponent
        value={values.mother_name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="mother_name"
        placeholder="Mother Name"
        type="text"
        error={errors.mother_name}
        touched={touched.mother_name}
        className="h-12"
      />

      <Select
        value={values.class}
        selectedKeys={[values.class]}
        onChange={(value: React.ChangeEvent<HTMLSelectElement>) => {
          setFieldValue("class", value.target.value);
        }}
        label="Class"
        placeholder="Select an class"
        size="sm"
      >
        {classesList.map((c) => {
          return (
            <SelectItem key={c._id} value={c._id}>
              {c.name}
            </SelectItem>
          );
        })}
      </Select>

      <FormComponent
        value={values.enrollment_date}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="enrollment_date"
        placeholder="Enrollment Date"
        type="date"
        error={errors.enrollment_date}
        touched={touched.enrollment_date}
        className="h-12"
      />

      <FormComponent
        value={values.grade}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="grade"
        placeholder="Grade"
        type="text"
        error={errors.grade}
        touched={touched.grade}
        className="h-12"
      />

      <FormComponent
        value={values.attendance}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="attendance"
        placeholder="Attendance"
        type="text"
        error={errors.attendance}
        touched={touched.attendance}
        className="h-12"
      />

      <FormComponent
        value={values.emergency_contact.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="emergency_contact.name"
        placeholder="Emergency Contact Name"
        type="text"
        error={errors.emergency_contact?.name}
        touched={touched.emergency_contact?.name}
        className="h-12"
      />

      <FormComponent
        value={values.emergency_contact.phone}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="emergency_contact.phone"
        placeholder="Emergency Contact Phone"
        type="text"
        error={errors.emergency_contact?.phone}
        touched={touched.emergency_contact?.phone}
        className="h-12"
      />

      <FormComponent
        value={values.medical_conditions}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="medical_conditions"
        placeholder="Medical Conditions"
        type="text"
        error={errors.medical_conditions}
        touched={touched.medical_conditions}
        className="h-12"
      />

      <FormComponent
        value={values.notes}
        handleChange={handleChange}
        handleBlur={handleBlur}
        name="notes"
        placeholder="Notes"
        type="text"
        error={errors.notes}
        touched={touched.notes}
        className="h-12"
      />

      <Select
        selectedKeys={[values.status]}
        label="Status"
        placeholder="Select an status"
        size="sm"
        value={values.status}
        onChange={(value: React.ChangeEvent<HTMLSelectElement>) =>
          setFieldValue("status", value.target.value)
        }
      >
        {studentStatus.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </Select>
    </>
  );
};

export default StudentFormFieldComponent;
