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
import VerificationCode from "../entities/VerificationCode";

const register = async (req: Request, res: Response) => {
    const { email, username, ...rest } = req.body;

    try {
        let errors: any = {};

        // Validate Fields
        if (isEmpty(email)) errors.email = "Email must not be empty";
        if (isEmpty(username)) errors.username = "Username must not be empty";

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
            ...rest,
        });

        // Validate syntax errors
        errors = await validate(newUser);

        if (errors.length > 0) return res.status(400).json(mapErrors(errors));

        // save the user in the database
        await newUser.save();

        const verificationCode = new VerificationCode({
            user: newUser,
        });

        await verificationCode.save();

        transporter.sendMail(
            {
                from: process.env.MAILER_USER,
                to: newUser.email,
                subject: "Verify Your Account",
                text: `Verification Code ${verificationCode.getCode()}`,
            },
            (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );

        // return the User
        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const verifyAccount = async (req: Request, res: Response) => {
    const { verificationCode, username } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ user: "User Not Found" });

        if (user.checkVerification())
            return res
                .status(500)
                .json({ general: "Your Account is Already Verified" });

        const syncedVerificationCode = await VerificationCode.findOne({ user });

        if (!syncedVerificationCode)
            return res
                .status(404)
                .json({ verificationCode: "Verification Code Not Found" });

        if (verificationCode !== syncedVerificationCode.getCode())
            return res
                .status(401)
                .json({ verificationCode: "Verification Code Not Valid" });

        user.verifyAccount();

        await user.save();

        await syncedVerificationCode.remove();

        const token = generateToken({
            username: user.username,
        });

        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24,
                path: "/",
            })
        );

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const resendVerificationCode = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ user: "User Not Found" });

        if (user.checkVerification())
            return res
                .status(500)
                .json({ general: "Your Account is Already Verified" });

        const syncedVerificationCode = await VerificationCode.findOne({ user });

        if (!syncedVerificationCode)
            return res
                .status(404)
                .json({ verificationCode: "Verification Code Not Found" });

        transporter.sendMail(
            {
                from: process.env.MAILER_USER,
                to: user.email,
                subject: "Verify Your Account",
                text: `Verification Code ${syncedVerificationCode.getCode()}`,
            },
            (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req: Request, res: Response) => {
    const { email, link } = req.body;
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
                text: `${
                    link || "http://localhost:5000/api/auth"
                }/verify-token/${token}`,
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
        return res.json({ success: true, user });
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
                maxAge: 60 * 60 * 24,
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
router.post("/verifyAccount", verifyAccount);

router.get("/me", user, auth, me);

router.get("/verify-token/:token", finishLogin);

router.post("/resendVerificationCode", resendVerificationCode);

export default router;
