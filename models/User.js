const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    unique: true
  },
  email: { 
    type: String, 
    unique: true
  },
  password: String,
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  // Log the userName before password hashing
  console.log('User being saved with userName:', user.userName);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;

      // Log the userName after password hashing
      console.log('User saved with userName:', user.userName);

      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    // Log the userName during password comparison
    console.log('User being compared with userName:', this.userName);
    
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
