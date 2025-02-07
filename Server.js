const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const morgan = require("morgan");
const bp = require("body-parser");
const PORT = process.env.PORT || 5000;

// databases connections
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();
// middleware
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cookieParser());
app.use(bp.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads/"));

// user routes defined
const userrouter = require("./Routes/UserRoutes");
app.use("/api", userrouter);

// firebaseAuthentication  routes defined
const firebaseAuthrouter = require("./Routes/authRoute");
app.use("/api", firebaseAuthrouter);
// students  routes defined
const studentRoutes = require("./Routes/studentRoutes");
app.use("/api", studentRoutes);

// books  routes defined
const bookRoutes = require("./Routes/bookRoute");
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
