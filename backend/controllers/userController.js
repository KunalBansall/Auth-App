const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username avatar");
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      username: user.username,
      avatar:
        user.avatar ||
        "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId, "username avatar");
    if (!user) return res.status(404).json({ message: "User not Found" });

    res.json({
      _id: user._id,
      username: user.username,
      avatar:
        user.avatar ||
        "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    });
  } catch (error) {
    console.error("Error fetching user :", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};
