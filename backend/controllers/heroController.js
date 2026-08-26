const Hero = require('../models/Hero');

exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({
        subRole: 'WEB DEVELOPER • REACT • NODE.JS • MONGODB'
      });
    } else if (hero.subRole !== 'WEB DEVELOPER • REACT • NODE.JS • MONGODB') {
      hero.subRole = 'WEB DEVELOPER • REACT • NODE.JS • MONGODB';
      await hero.save();
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      Object.assign(hero, req.body);
    }
    await hero.save();
    res.json({ success: true, data: hero, message: 'Hero section updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
