import userStore from "../model/user.model.js"
import { hashPassword, verifyPassword } from "../services/PasswordMgt.js";
import { generateResponse } from "../services/responseGenerator.js";
import { blacklistToken, generateToken } from "../services/tokenServices.js";
import { APIMessage } from "../utility/constant.js";
import { isValidPassword, isValidName, isValidEmail } from "../utility/regexValidation.js";


export const handleCreateUser = async (req, res) => {
    const authType = req?.body?.authType;

        const { name, email, password } = req.body
        if (!name || !email && !password) return res.status(400).send(generateResponse(400, "Please provide all required fields!", null))
        if(req.body.swipeCard && req.body.swipeCard == null) return res.status(400).send(generateResponse(400, "Swipe card is required for userPin authentication!", null));


        if (!isValidPassword(password)) return res.status(400).send(generateResponse(400, APIMessage?.passwordRegexNotMatched, null))
        if (!isValidName(name)) return res.status(400).send(generateResponse(400, APIMessage?.nameRegexNotMatched, null))
        if (!isValidEmail(email)) return res.status(400).send(generateResponse(400, APIMessage?.emailRegexNotMatched, null))

        // Check if user already exists
        let existingUser = await userStore.findOne({ email });
        if (existingUser) return res.status(400).send(generateResponse(400, "User already exists with this email!", null))

        // Hash password
        const hashedPassword = await hashPassword(password);

        let finalData = {};
        if (req.body.swipeCard) {
            finalData = {
                name: name,
                email: email,
                swipeCard: req.body.swipeCard,
                password: hashedPassword
            };
        } else {
            finalData = {
                name: name,
                email: email,
                password: hashedPassword
            };
        }

        // Create new user
        let newUser = await userStore.create(finalData);

        newUser.password = undefined; // Remove password from response
        return res.status(201).send(generateResponse(201, "User created successfully!", newUser));
}

export const handleGetUser = async (req, res) => {
    // Fetch user by ID
    const user = await userStore.findOne({ _id: req?.userId });
    if (!user) return res.status(404).send(generateResponse(404, "User not found!", null));

    // Return user data
    return res.status(200).send(generateResponse(200, "User retrieved successfully!", user));
}

export const handleLoginUser = async (req, res) => {
    const authType = req?.body?.authType;
    if (!authType) return res.status(400).send(generateResponse(400, "Please provide authType!", null));
    if (authType === "userPin") {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send(generateResponse(400, "Please provide both email and password!", null));

        // Check if user exists
        const user = await userStore.findOne({ email });
        if (!user) return res.status(404).send(generateResponse(404, "User not found!", null));

        // Check password
        let checkPassword = await verifyPassword(password, user.password);
        if (!checkPassword) return res.status(401).send(generateResponse(401, "Invalid password!", null));

        const token = await generateToken(user._id);
        if (!token) return res.status(500).send(generateResponse(500, "Failed to generate token!", null));

        user.password = undefined; // Remove password from response
        return res.status(200).send(generateResponse(200, "Login successful!", { user, token }));
    } else if (authType === "swipeCard") {
        const { swipeCard } = req.body;
        if (!swipeCard) return res.status(400).send(generateResponse(400, "Please provide swipe card!", null));

        // Check if user exists with swipe card
        const user = await userStore.findOne({ swipeCard });
        if (!user) return res.status(404).send(generateResponse(404, "User not found!", null));

        const token = await generateToken(user._id);
        if (!token) return res.status(500).send(generateResponse(500, "Failed to generate token!", null));

        user.password = undefined; // Remove password from response
        user.swipeCard = undefined; // Remove swipe card from response
        return res.status(200).send(generateResponse(200, "Login successful!", { user, token }));
    }
}

export const handleUpdateUser = async (req, res) => {

    const userId = req?.userId;
    const { name, email, password } = req.body;

    // Validate user ID
    if (!userId) return res.status(400).send(generateResponse(400, "User ID is required!", null));

    // Check if user exists
    const user = await userStore.findOne({ _id: userId });
    if (!user) return res.status(404).send(generateResponse(404, "User not found!", null));

    if (user.email !== email) return res.status(400).send(generateResponse(400, "Email cannot be changed!", null));

    // Update user data
    if (name) user.name = name;
    if (password) {
        if (!isValidPassword(password)) return res.status(400).send(generateResponse(400, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!", null));
        // Hash password
        let hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
    }

    await user.save();
    return res.status(200).send(generateResponse(200, "User updated successfully!", user));
}

export const handleLogoutUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const expiredToken = await blacklistToken(token, 3700); // Blacklist token for 1 hour (3600 seconds)
    if (!expiredToken) return res.status(500).send(generateResponse(500, "Failed to blacklist token!", null));

    // Invalidate the token by not returning it
    return res.status(200).send(generateResponse(200, "User logged out successfully!", null));
}