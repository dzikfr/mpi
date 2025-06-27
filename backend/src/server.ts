import { app } from "./app";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const PROTOCOL = process.env.PROTOCOL || "http";

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${PROTOCOL}://${HOST}:${PORT}`);
});
