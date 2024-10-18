const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar:
        "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    });

    await user.save();
    console.log("User created successfully");

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error during user creation:", error); // Log the error

    return res.status(500).json({ message: "Error creating user" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).send({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Wrong credentials");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const { password: pass, ...rest } = user._doc;
  res.json({ token, user: rest });
};

exports.googleSignIn = async (req, res) => {
  const { email, avatar, username } = req.body;
  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password: pass, ...rest } = user._doc;
      return res.status(200).json({ token, user: rest });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatePassword, 10);
      const newUser = new User({
        username,
        email,
        avatar,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: pass, ...rest } = newUser._doc;
      return res.status(200).json({ token, user: rest });
    }
  } catch (error) {
    console.error("Error during Google Sign-in", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
