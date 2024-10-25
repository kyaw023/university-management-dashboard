import { Input } from "@/components/ui/input";
import { ErrorMessage } from "formik";
import React, { forwardRef } from "react";

interface Props {
  value?: string | number | undefined | File;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void; // Simplified type
  name: string;
  placeholder: string;
  type: string;
  error?: string | undefined;
  touched?: boolean;
  className?: string;
}

// Use forwardRef to allow parent components to pass a ref
const FormComponent = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      handleChange,
      handleBlur,
      name,
      placeholder,
      type,
      error,
      touched,
      className = "",
    }: Props,
    ref // Receive the ref as a second parameter
  ) => {
    const valueAsString = value !== undefined ? value.toString() : "";

    return (
      <div>
        <Input
          ref={ref} // Pass the ref to the Input component
          value={valueAsString}
          onChange={handleChange}
          onBlur={handleBlur}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error && touched}
          aria-describedby={`${name}-error`}
          className={className}
        />
        <ErrorMessage
          className="text-red-600 text-xs mt-1"
          component="p"
          id={`${name}-error`}
          name={name}
        />
      </div>
    );
  }
);

export default FormComponent;
