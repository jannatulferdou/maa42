import app from "./app";
import config from "./config";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Maa42 backend running on port ${PORT}`);
});