import express from "express";
import cors from "cors";
import path  from "path";
import "./loadEnviroment.mjs";
import { fileURLToPath } from "url";

//import AccountView from "./routes/accountSettings.mjs";
import Signup from "./routes/signup.mjs";
import Login from "./routes/login.mjs";
import spotifyLogin from "./routes/spotifyLogin.mjs";
import uploadImage from "./routes/uploadImage.mjs";
import saveConnectedAccounts from "./routes/saveConnectedAccounts.mjs";
import accountRoutes from "./routes/account.mjs";

const PORT = 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//app.use("/account", AccountView);
app.use("/signup", Signup);
app.use("/login", Login);
app.use("/spotifyLogin", spotifyLogin);
app.use("/account", accountRoutes);
app.use("/uploadImage", uploadImage);
app.use("/saveConnectedAccounts", saveConnectedAccounts);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
