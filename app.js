const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const { "abc 123", "mongodb+srv://affan:affan@cluster0.bwphjz4.mongodb.net/?retryWrites=true&w=majority" } = require("./config/keys");
const Customer = require("./models/customer");
const Order = require("./models/order");
const Product = require("./models/product");

mongoose.connect("mongodb+srv://affan:affan@cluster0.bwphjz4.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeahhh");
});
mongoose.connection.on("error", (err) => {
  console.log("error", err);
});
app.use(cors());

app.use(express.json());

const requireLogin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, "abc 123");

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "plase add all the fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: "user already exists with that email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new User({
      email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ message: "signup success you can login now" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "plase add all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "user dosent exist with that email" });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, "abc 123");
      res.status(201).json({ token });
    } else {
      return res.status(401).json({ error: "email or password is invalid" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/customers", requireLogin, async (req, res) => {
  const data = await new Customer({
    id: req.body.id,
    user: req.user.id,
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    contactNumber: req.body.contactNumber,
  }).save();
  res.status(201).json({ data: data });
});

app.get("/api/customers", requireLogin, async (req, res) => {
  const data = await Customer.find({
    user: "63787c9908b16374bc255dca",
  });
  res.status(200).json({ data: data });
});

app.delete("/api/customers/:id", requireLogin, async (req, res) => {
  const removedCustomer = await Customer.findOneAndRemove({
    _id: req.params.id,
  });
  res.status(200).json({ message: removedCustomer });
});

// Products
app.post("/api/products", requireLogin, async (req, res) => {
  const data = await new Product({
    id: req.body.id,
    user: req.user.id,
    serviceName: req.body.serviceName,
    basePrice: req.body.basePrice,
    discountPerUnit: req.body.discountPerUnit,
    expiryDate: req.body.expiryDate,
    vatPerUnit: req.body.vatPerUnit,
  }).save();
  res.status(201).json({ data: data });
});

app.get("/api/products", requireLogin, async (req, res) => {
  const data = await Product.find({
    user: "63787c9908b16374bc255dca",
  });
  res.status(200).json({ data: data });
});
// Order Routes

app.get("/api/orders", requireLogin, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({ data: orders });
});
app.post("/api/orders", requireLogin, async (req, res) => {
  if (!req.body.customerId) {
    res.status(400);
    throw new Error("Please add a name field");
  }
  const total = req.body.orderDetailList.reduce(
    (a, b) => a + b.basePrice * b.quantityOrdered,
    0
  );

  // const customer = await Customer.find({ _id: req.body.customerId });

  const order = await Order.create({
    customerId: req.body.customerId,
    discount: req.body.discount,
    advance: req.body.advance,
    total: total,
    due: total - req.body.discount - req.body.advance,
    orderDetailList: req.body.orderDetailList,
    // name: customer[0].name || "not Found",
    // age: customer[0].age || 0,
    // gender: customer[0].gender || 0,
    // contactNumber: customer[0].contactNumber || 0,
  });
  res.status(200).json({ data: order });
});

//



app.listen(PORT, () => {
  console.log("server running on ", PORT);
});
