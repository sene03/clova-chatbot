// express server
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
