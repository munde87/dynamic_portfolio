const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  eyebrow: { type: String, default: "HEY, I'M SHUBHAM MUNDE" },
  headline1: { type: String, default: "SHUBHAM" },
  headline2: { type: String, default: "MUNDE" },
  title: { type: String, default: "SOFTWARE ENGINEER" },
  subRole: { type: String, default: "WEB DEVELOPER • JAVA • DSA • MERN STACK" },
  description: { type: String, default: "I build interactive digital experiences, modern web applications, and scalable software with creativity, code, and continuous learning." },
  primaryCtaText: { type: String, default: "EXPLORE MY WORK" },
  primaryCtaLink: { type: String, default: "#projects" },
  secondaryCtaText: { type: String, default: "LET'S CONNECT" },
  secondaryCtaLink: { type: String, default: "#contact" },
  heroImage: { type: String, default: "/assets/spider-mask.png" },
  portraitImage: { type: String, default: "/assets/shubham-real.png" },
  modelUrl: { type: String, default: "/models/spiderman.glb" },
  socials: {
    github: { type: String, default: "https://github.com/munde87" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/shubham-munde-ba5ab4335" },
    instagram: { type: String, default: "https://www.instagram.com/smash_8767?igsi=bjVyNmgxNXVnaGd1" },
    email: { type: String, default: "shubhammunde8767@gmail.com" },
    firstPortfolio: { type: String, default: "https://jolly-naiad-d765aa.netlify.app" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
