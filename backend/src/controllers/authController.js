import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const requireAuthFields = ({ name, email, password, phone, address }, res) => {
  if (!name || !email || !password || !phone || !address) {
    res.status(400);
    throw new Error("Name, email, password, phone, and address are required");
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  requireAuthFields({ name, email, password, phone, address }, res);

  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    phone: String(phone).trim(),
    address: String(address).trim(),
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    token: generateToken(user._id),
  });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
