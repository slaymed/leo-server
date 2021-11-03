import jwt from "jsonwebtoken";

export default (token: string, secretCode: string) =>
    jwt.verify(token, secretCode);
