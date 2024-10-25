import jwt from "jsonwebtoken";
const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: "3d",
  });
};

export default createToken;
