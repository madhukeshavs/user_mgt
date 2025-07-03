import userStore from "../model/user.model.js"
import { hashPassword, verifyPassword } from "../services/passwordservices.js";
import { generateResponse } from "../services/responseGenerator.js";
import { blacklistToken, generateToken, verifyToken } from "../services/tokenServices.js";


export const handleCreateUser = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email && !password) return res.status(400).send(generateResponse(400, "Please provide all required fields!", null))
    if (password.length < 6) return res.status(400).send(generateResponse(400, "Password must be at least 6 characters long!", null))
    if (!email.includes("@")) return res.status(400).send(generateResponse(400, "Please provide a valid email address!", null))

    // Check if user already exists
    let existingUser = await userStore.findOne({ email });
    if (existingUser) return res.status(400).send(generateResponse(400, "User already exists with this email!", null))

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    let newUser = await userStore.create({ name, email, password: hashedPassword });

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
}

export const handleUpdateUser = async (req, res) => {

    const userId = req?.userId;
    const { name, email, password } = req.body;

    // Validate user ID
    if (!userId) return res.status(400).send(generateResponse(400, "User ID is required!", null));

    // Check if user exists
    const user = await userStore.findOne({ _id: userId });
    if (!user) return res.status(404).send(generateResponse(404, "User not found!", null));

    if(user.email !== email) return res.status(400).send(generateResponse(400, "Email cannot be changed!", null));

    // Update user data
    if (name) user.name = name;
    if (password) {
        if (password.length < 6) return res.status(400).send(generateResponse(400, "Password must be at least 6 characters long!", null));
        user.password = password;
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
    return res.status(200).send(generateResponse(200, "User logged out successfully!", expiredToken));
}