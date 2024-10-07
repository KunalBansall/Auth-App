const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).send( {message:"User already exists"});
    // }
    console.log("Checking if user exists with email:", email); // Log the email being checked

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log("User already exists:", existingUser); // Log if a user is found
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("User does not exist, creating new user.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar:
        "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    });

    await User.updateMany({}, [{ $set: { email: { $toLower: "$email" } } }]);

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
  res.json({ token });
};
