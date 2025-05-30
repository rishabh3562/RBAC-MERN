import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js"; // Import DB Connection

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

//health
app.get("/health",(req,res)=>{
    res.status(200).send({message:"hello world"})
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
