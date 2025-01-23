import express from "express";
import cors from "cors";
import "./loadEnviroment.mjs";
import AccountView from "./routes/accountSettings.mjs";
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/account", AccountView);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
