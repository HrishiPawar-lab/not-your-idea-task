import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import User from "../schemas/users.js";

export const registerUser = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        if (await User.exists({ username })) {
            const resp = new ApiResponse(
                false,
                {},
                "username already in use"
            );
            return res.status(200).json(resp);
        }


        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, passwordHash: hash, role: role || 'user' });

        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        const resp = new ApiResponse(
            true,
            { token, role: user.role, user: { id: user._id, username: user.username } },
            "Registered successfully"
        );
        res.status(201).json(resp);

    } catch (err) {
        console.error(err);
        const resp = new ApiResponse(false, {}, "Internal Server Error");
        res.status(200).json(resp);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            const resp = new ApiResponse(false, {}, "Invalid credentials");
            return res.status(200).json(resp);


        }

        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) {
            const resp = new ApiResponse(false, {}, "Invalid credentials");
            return res.status(200).json(resp);
        }

        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        console.log(user)

        const resp = new ApiResponse(
            true,
            { token, role: user.role, id: user._id },
            "Logged in successfully"
        );
        res.json(resp);

    } catch (err) {
        console.error(err);
        const resp = new ApiResponse(false, {}, "Internal Server Error");
        res.status(200).json(resp);
    }
}