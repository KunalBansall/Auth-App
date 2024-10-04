const User = require("../models/userModel");

const updateAvatars = async () => {
  try {
    const result = await User.updateMany(
      { avatar: { $exists: false } }, // Find users without an avatar
      {
        avatar:
          "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
      }
    );
    console.log(`Updated ${result.nModified} users with default avatars`);
  } catch (error) {
    console.error("Error updating avatars:", error);
  }
};

module.exports = updateAvatars;
