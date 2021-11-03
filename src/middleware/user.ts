import { Request, Response, NextFunction } from "express";
import User from "../entities/User";

// import User from "../entities/User";
import verifyToken from "../helpers/verifyToken";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if token exist
        const token = req.cookies.token;

        // if no token run next middleware (auth.ts)
        if (!token) return next();
        // verify token
        const { username }: any = verifyToken(token, process.env.JWT_SECRET!);

        // find the user
        const user: User | undefined = await User.findOne({ username });

        // attach the user to locals
        res.locals.user = user;

        return next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ error: "Unathenticated" });
    }
};
