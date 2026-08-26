const mongoose = require('mongoose');

const codeExampleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  language: { type: String, required: true },
  code: { type: String, required: true },
  output: { type: String, required: true },
  runEnabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CodeExample', codeExampleSchema);
