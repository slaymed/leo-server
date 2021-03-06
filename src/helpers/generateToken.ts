import jwt from "jsonwebtoken";
import User from "../entities/User";

export default (user: Pick<User, "username">) =>
    jwt.sign(user, process.env.JWT_SECRET!);
