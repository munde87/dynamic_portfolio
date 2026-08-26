const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  heading: { type: String, default: "ABOUT ME" },
  mainTitle: { type: String, default: "THE PERSON BEHIND THE MASK" },
  aboutBio: [{ type: String }],
  stats: [{
    label: { type: String },
    value: { type: String },
    code: { type: String }
  }],
  technologyLabels: [{ type: String }],
  portraitImage: { type: String, default: "/assets/shubham-crouch.png" }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
