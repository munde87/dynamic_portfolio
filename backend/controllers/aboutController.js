const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        heading: "ABOUT ME",
        mainTitle: "THE PERSON BEHIND THE MASK",
        aboutBio: [
          "I am a Computer Engineering student and software developer passionate about building high-impact full-stack applications, interactive 3D web experiences, and scalable software architecture.",
          "Driven by the philosophy that with great power comes great responsibility in code — focusing on clean architectures, MERN stack development, building intuitive full-stack web applications with Java & JavaScript, and delivering vibrant user interfaces."
        ],
        stats: [
          { label: "COMPLETED & BUILT", value: "10+ Web Apps", code: "PROJECT_ENGINE" },
          { label: "FULL STACK WEB APPS", value: "Production Ready", code: "MERN_CORE" },
          { label: "INTERACTIVE 3D UI", value: "60 FPS WebGL", code: "WEB_GL_3D" },
          { label: "CORE FOCUS", value: "Java & JavaScript", code: "SYSTEM_CODE" }
        ],
        technologyLabels: ["React.js", "JavaScript", "Java", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Three.js"]
      });
    } else {
      let updated = false;
      if (about.stats) {
        about.stats = about.stats.map(s => {
          if (s.code === 'DSA_ENGINE' || s.value?.includes('DSA') || s.label?.includes('DSA')) {
            updated = true;
            return { label: "COMPLETED & BUILT", value: "10+ Web Apps", code: "PROJECT_ENGINE" };
          }
          return s;
        });
      }
      if (about.aboutBio) {
        about.aboutBio = about.aboutBio.map(b => {
          if (b.includes('Java & DSA')) {
            updated = true;
            return b.replace('solving complex algorithmic challenges with Java & DSA', 'building intuitive full-stack web applications with Java & JavaScript');
          }
          return b;
        });
      }
      if (updated) {
        await about.save();
      }
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    await about.save();
    res.json({ success: true, data: about, message: 'About section updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
