const express = require("express");
const { movieEdit, movieAll, movieDelete } = require("../controller/movieController");
const { movieAdd } = require("../controller/movieAddController");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");

router.get("/all", authenticate, movieAll);
router.post("/add", authenticate, movieAdd);
router.put("/edit", authenticate, movieEdit);
router.get("/info", authenticate, movieAll);
router.delete("/delete", authenticate, movieDelete);

module.exports = router;
