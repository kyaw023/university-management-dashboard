export interface Schedule {
  day: string;
  start_time: string;
  end_time: string;
  class: {
    _id: string;
    name: string;
  };
  subject: {
    _id: string;
    name: string;
  };
}

export interface UserType {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other";
  address: string;
  image: string;
  qualifications: string[];
  subjects: string[]; // Reference to Subject model
  classes: string[]; // Reference to Class model
  employment_status: "active" | "on_leave" | "retired";
  hire_date: Date;
  salary: number;
  schedule?: {
    day: string;
    start_time: string;
    end_time: string;
    class: string;
    subject: string;
  }[];
}

export interface LoginResponse {
  user: UserType;
  token: string;
  message: string;
  success: boolean;
}
