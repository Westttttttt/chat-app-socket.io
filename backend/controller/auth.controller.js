import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } =
      await req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password don't match",
      });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const avatar = `robohash.org/${username}`;

    const newUser = new User({
      fullName,
      username,
      gender,
      password: hashedPass,
      profilePic: avatar,
    });

    if (newUser) {
      await generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = await req.body;
    console.log(username, password);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        error: "User not found, please signup",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

