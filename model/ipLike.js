const mongoose = require("mongoose");

const ipLikeSchema = new mongoose.Schema({
  ip: String,
  stock: String,
});

const IpLike =
  mongoose.models.IpLike || mongoose.model("IpLike", ipLikeSchema, "IpLikes");

module.exports = IpLike;
