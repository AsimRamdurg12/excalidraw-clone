import jwt from "jsonwebtoken";

function checkUser(token: string): string | null {
  const decode = jwt.verify(token!, process.env.JWT_SECRET as string) as string;

  if (!decode) {
    return null;
  }

  return decode;
}

export default checkUser;
