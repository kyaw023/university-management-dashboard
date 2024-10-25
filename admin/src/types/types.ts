export type UserType = {
  _id?: string;
  address: string;
  createdAt?: string;
  date_of_birth: string;
  email: string;
  gender: string;
  image: string;
  name: string;
  phone: string;
  role: string;
  bio?: string;
  updatedAt?: string;
  __v?: number;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: UserType;
};

import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
