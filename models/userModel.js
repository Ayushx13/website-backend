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
                const regex = /^(cs|ee|ec|mc|me|ce|ep|is|ch)(24|25)(bm|bt)(0[0-6][0-9]|070)@iitdh\.ac\.in$/i;
                const match = value.match(regex);
                if (!match) return false;

                const branch = match[1].toLowerCase();
                const course = match[3].toLowerCase();

                // Extra rule: only "is" can have "bm", others must have "bt"
                if (branch === "is" && course !== "bm") return false;
                if (branch !== "is" && course !== "bt") return false;

                return true;
            },
            message:
                "Only IIT Dharwad 1st & 2nd year students (batch 2024 & 2025) with valid branch/code (is+bm or others+bt, roll 001–070) can register",
        }

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
