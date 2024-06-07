import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hasedPassword = await bcrypt.hash(password, 10);
    //CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hasedPassword,
      },
    });
    res.status(201).json({ message: "User created sucessfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create a user." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user)
      return res.status(401).json({ message: "User does not exists." });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "The password is incorrect." });

    const age = 1000 * 60 * 60 * 24 * 7;
    //GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const {password: userPassword, ...userInfo} = user

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        // secure: true,
      })
      .status(200)
      .json(userInfo);
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Sucessfully." });
};
