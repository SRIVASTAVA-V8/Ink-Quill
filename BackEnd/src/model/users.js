const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const users= mongoose.Schema({
    name: String,                // Full name of the user
    email: {                     // User's email (unique)
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
        type: String,  
        required: true,
        minlength: 8
    },
    role: {                      // User role (customer/admin)
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },            // Profile picture URL
    address: {                   // Shipping address
    fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      isDefault: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },       
    createdAt: {                 // Account creation date
      type: Date,
      default: Date.now
    },
    updatedAt: Date              // Last profile update timestamp
  }
);

// Hash password before saving
users.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password during login
users.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", users);
module.exports = User;