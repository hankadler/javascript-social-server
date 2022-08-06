import mongoose from "mongoose";

const privateFileSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
}, {
  autoCreate: false,
  autoIndex: false
});

const PrivateFile = mongoose.model("PrivateFile", privateFileSchema);

export { privateFileSchema, PrivateFile };
