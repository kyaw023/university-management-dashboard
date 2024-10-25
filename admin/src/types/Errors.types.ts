export interface Errors {
  name?: string;
  email?: string;
  password?: string;
  date_of_birth?: string;
  gender?: string;
  roll_no?: string;
  address?: string;
  phone?: string;
  image?: string;
  father_name?: string;
  mother_name?: string;
  class?: string;
  enrollment_date?: string;
  grade?: string;
  attendance?: string;
  emergency_contact?: {
    name?: string;
    phone?: string;
  };
  medical_conditions?: string;
  notes?: string;
  status?: string;
}

export interface Touched {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  date_of_birth?: boolean;
  gender?: boolean;
  roll_no?: boolean;
  address?: boolean;
  phone?: boolean;
  image?: boolean;
  father_name?: boolean;
  mother_name?: boolean;
  class?: boolean;
  enrollment_date?: boolean;
  grade?: boolean;
  attendance?: boolean;
  emergency_contact?: {
    name?: boolean;
    phone?: boolean;
  };
  medical_conditions?: boolean;
  notes?: boolean;
  status?: boolean;
}

export type ErrorResponse = {
  status: number;
  data: {
    message: string;
  };
};
