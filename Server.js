const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;

// databases connections
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();
// middleware
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cookieParser());
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
app.use("/api/v1", userrouter);


// firebaseuser routes defined
const firebaseuserrouter = require("./Routes/firebaseUserRoute");
app.use("/api/v1", firebaseuserrouter);
// students  routes defined
const studentRoutes = require("./Routes/studentRoutes");
app.use("/api", studentRoutes);

app.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
