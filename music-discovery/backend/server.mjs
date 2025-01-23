import express from "express";
import cors from "cors";
import "./loadEnviroment.mjs";
//import AccountView from "./routes/accountSettings.mjs";
import Signup from "./routes/signup.mjs";
import Login from "./routes/login.mjs";
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

//app.use("/account", AccountView);
app.use("/signup", Signup);
app.use("/login", Login);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
