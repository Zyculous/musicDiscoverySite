import express from "express";
import cors from "cors";
import "./loadEnviroment.mjs";
//import AccountView from "./routes/accountSettings.mjs";
import Signup from "./routes/signup.mjs";
import Login from "./routes/login.mjs";
import accountSettings from "./routes/accountSettings.mjs";
const PORT = 5000;
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//app.use("/account", AccountView);
app.use("/signup", Signup);
app.use("/login", Login);
app.use("/accountSettings", accountSettings);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
