import {app, router} from "./app";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use("/api", router);
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/not_found.html"));
});


const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const PROTOCOL = process.env.PROTOCOL || "http";

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${PROTOCOL}://${HOST}:${PORT}`);
});
