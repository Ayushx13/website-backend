import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
    },

    email: {
        type: String,
        required: [true, "Please provide your college email"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Example: is24bm003@iitdh.ac.in
                const match = value.match(
                    /^([a-z]{2})(\d{2})([a-z]{2})(\d{3})@iitdh\.ac\.in$/i
                );

                if (!match) return false; // wrong format

                // Extract admission year
                const year = parseInt(match[2], 10);
                return year === 24 || year === 25;
            },
            message:
                "Only IIT Dharwad 1st and 2nd year students (batch 2024 & 2025) can register",
        },
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },

    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },

    otp: {
        type: String
    },

    otpExpiry: {
        type: Date
    },

    isVerified: {
        type: Boolean,
        default: false
    }
    
});



// Mongoose Middleware (Hooks)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //hashing the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});




//Schema Methods (Instance methods)

// to check password is correct or not 
userSchema.methods.correctPassword = async function (candidatePasswords, userPassword) {
    return await bcrypt.compare(candidatePasswords, userPassword);
}



const User = mongoose.model("User", userSchema);
export default User;
