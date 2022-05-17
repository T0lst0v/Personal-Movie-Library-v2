const jwt = require("jsonwebtoken");
const DB = require("../utils/db");

async function authenticate(req, res, next) {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      //getting token from header:
      token = req.headers.authorization.split(" ")[1];
      console.log("MW --> Token Found and Splitted ");

      //verify token
      jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        console.log("MW --> verifying token");
        // err
        if (err) {
          res.json({ message: "Unable to authenticate!" });
          console.log("MW --> Token Auth Error");
        } else {
          //get user from token

          req.user = await DB.one("SELECT name, email, user_id  FROM users WHERE user_id=($1)", [decoded.id]);
          // req.user = await User.findById(decoded.id).select("-password");
          console.log("MW --> Token decoded and passed info(id): " + decoded.id);

          next();
        }
      });
    } else {
      console.log("MW --> no Token in a Header or not starting with Bearer");
      res.json({ message: "Not Authorized" });
    }
  } catch (error) {
    res.status(401).json({ error });
  }
}

module.exports = { authenticate };
