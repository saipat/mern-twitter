const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World!"));


// mongodb: //Admin:MT123456$$@ds113873.mlab.com:13873/mern-twitter
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));