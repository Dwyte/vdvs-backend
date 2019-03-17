// Routers
const candidates = require("./routers/candidates");
const voters = require("./routers/voters");
const election = require("./routers/election");
const receipt = require("./routers/receipt");
const admin = require("./routers/admin");
const upload = require("express-fileupload");
const cors = require("cors");

// Server
const config = require("config");
const express = require("express");
const path = require("path");
const app = express();

// Middlewares
app.use(upload());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Database
const mongoose = require("mongoose");
mongoose
  .connect(config.get("database"), { useNewUrlParser: true })
  .then(async () => {
    console.log("Connected to Mongo-Database...");

    const admin = await mongoose.model("Admin").findOne();

    if (admin == null) {
      const { Admin } = require("./models/admin");
      const bcrypt = require("bcrypt");

      const salt = await bcrypt.genSalt(10);
      const admin = new Admin({
        username: "admin",
        password: await bcrypt.hash("pass123", salt)
      });
      await admin.save();

      console.log("Admin account created.");
    }
  })
  .catch(error => console.log("Unable to connect to MongoDB.", error));

// Routes
app.use("/api/voters", voters);
app.use("/api/candidates", candidates);
app.use("/api/election", election);
app.use("/api/receipt", receipt);
app.use("/api/admin", admin);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
