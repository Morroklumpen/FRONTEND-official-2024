const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const todos = new mongoose.Schema({});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    minlength: 5,
    required: true,
  },
});

userSchema.pre("save", hashpassword);

async function hashpassword() {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}

async function login(username, password) {
  let loginresult = null;
  try {
    const user = await this.findOne({ username });
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      loginresult = user;
    }
  } catch (error) {
    console.log(error);
  }
  return loginresult;

  //   const user = mongoose.model("user", userSchema);
  //   module.exports = user;
}

const User = mongoose.model("user", userSchema);
module.exports = User;

//hehseifswgaswrgtwarty
