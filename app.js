const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, MOGOURI } = require("./config/keys");
const Customer = require("./models/customer");
const Order = require("./models/order");
const Product = require("./models/product");

mongoose.connect(MOGOURI, {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
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

  // const customer = await Customer.find({ _id: req.body.customerId });

  const order = await new Order({
    customerId: req.body.customerId,
    total: req.body.total,
    discount: req.body.discount,
    due: req.body.due,
    advance: req.body.advance,
    orderDetailList: req.body.orderDetailList,
    // name: customer.name || "Not Found",
    // age: customer.age || 0,
    // gender: customer.gender || "Not Found",
    // contactNumber: customer.contactNumber || "Not Found",
  }).save();
  res.status(200).json({ data: order });
});

//

if (process.env.NODE_ENV == "production") {
  const path = require("path");

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server running on ", PORT);
});
