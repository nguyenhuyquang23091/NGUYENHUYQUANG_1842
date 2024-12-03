const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema  = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
        },
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase: true,
        },
        passwordHash: {  
            type: String,
            required: true,
        },
    },
    { timestamps : true }
);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
    if (this.isModified('passwordHash')) {  // Only hash if password is modified or new
        const salt = await bcrypt.genSalt(12);  // Salt rounds
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);  // Hash the password
    }
    next();
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);  // Compare with hashed password in DB
};

const User = mongoose.model('User', userSchema);
module.exports = User;
