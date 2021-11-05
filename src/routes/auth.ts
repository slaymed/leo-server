import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User";
import generateToken from "../helpers/generateToken";
import mapErrors from "../helpers/mapErrors";
import transporter from "../helpers/transport";
import cookie from "cookie";
import user from "../middleware/user";
import auth from "../middleware/auth";
import verifyToken from "../helpers/verifyToken";

const register = async (req: Request, res: Response) => {
    const { email, username, postCode } = req.body;

    try {
        let errors: any = {};

        // Validate Fields
        if (isEmpty(email)) errors.email = "Email must not be empty";
        if (isEmpty(username)) errors.username = "Username must not be empty";
        if (isEmpty(postCode)) errors.postCode = "Post Code must not be empty";

        if (Object.keys(errors).length > 0) return res.status(500).json(errors);

        // Check if the user existe in DB
        const emailUser = await User.findOne({ email });
        const usernameUser = await User.findOne({ username });

        if (emailUser)
            return res.status(400).json({ email: "Email already taken" });
        if (usernameUser)
            return res.status(400).json({ username: "Username already taken" });

        // Create the user
        const newUser = new User({
            email,
            username,
            postCode,
        });

        // Validate syntax errors
        errors = await validate(newUser);

        if (errors.length > 0) return res.status(400).json(mapErrors(errors));

        // save the user in the database
        await newUser.save();

        // return the User
        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Somthing went wrong");
    }
};

const login = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        let errors: any = {};

        // Validate Fields
        if (isEmpty(email)) errors.email = "Email must not be empty";

        if (Object.keys(errors).length > 0) return res.status(500).json(errors);

        // Find the user if exist
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ general: "User not Found" });

        const token = generateToken({
            username: user.username,
        });

        transporter.sendMail(
            {
                from: process.env.MAILER_USER,
                to: user.email,
                subject: "Continue Sign in",
                text: `https://www.leowireless.co.uk/verify-token/${token}`,
            },
            (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );

        // return the user
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: err });
    }
};

const finishLogin = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const { username }: any = verifyToken(token, process.env.JWT_SECRET!);

        const syncedUser = await User.findOne({ username });

        if (!syncedUser)
            return res.status(400).json({ general: "Invalid or Expired Link" });

        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60,
                path: "/",
            })
        );

        return res.json(syncedUser);
    } catch (error) {
        return res.status(500).json({ general: "Invalid or Expired Link" });
    }
};

const me = (_: Request, res: Response) => {
    return res.json(res.locals.user);
};

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/me", user, auth, me);

router.get("/verify-token/:token", finishLogin);

export default router;
