import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"
import User from "../models/user.model.js"

export const signup = async (req, res) => {
    try {
        console.log("Signup body:", req.body); // Debug

        const { username, fullName, email, password, address } = req.body;

        if (!username || !fullName || !email || !password || !address) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
            address,
        });

        await newUser.save(); // ✅ save first
        generateToken(newUser._id, res); // ✅ then generate token

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                address: newUser.address,
            },
        });
    } catch (error) {
        console.error("Signup controller error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
  
export const login = async(req,res)=>{
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.status(401).json({error : "Invalid username and password"})
        }
        generateToken(user._id, res)
        res.status(200).json({
            message: "Login successful", 
            user: {
                id: user._id, 
                username: user.username, 
                fullName: user.fullName, 
                email: user.email, 
                role: user.role, 
                address: user.address
            }
        })
    } catch (error) {
        console.error(`Login controler error, ${error}`)
        res.status(500).json({ message: "Internal server" })
    }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",   // MUST match your generateToken setting
      secure: true,       // MUST match your generateToken setting
    });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.error(`Logout controller error, ${error}`);
    res.status(500).json({ message: "Internal server" });
  }
};

export const getMe = async (req, res )=>{
    try {
        const user = await User.findOne({_id:req.user._id}).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.error(`getMe controler error, ${error}`)
        res.status(500).json({ message: "Internal server" })
    }
}
