const Skill = require('../models/Skill')

const defaultSkills = [
  { number: "01", name: "HTML", category: "FRONTEND", badge: "WEB FOUNDATIONS", level: "Advanced", description: "Semantic web structure, accessibility standards, DOM markup, and SEO best practices.", tags: ["HTML5", "Semantic Markup", "Accessibility", "SEO"], order: 1 },
  { number: "02", name: "CSS", category: "FRONTEND", badge: "STYLING & LAYOUTS", level: "Advanced", description: "Modern CSS3 styling, Flexbox, Grid, animations, transitions, and responsive web design.", tags: ["CSS3", "Flexbox", "Grid", "Responsive"], order: 2 },
  { number: "03", name: "JavaScript", category: "FRONTEND", badge: "MODERN WEB CORE", level: "Advanced", description: "ES6+ syntax, asynchronous programming, DOM manipulation, promises, and event-driven logic.", tags: ["ES6+", "Async/Await", "DOM", "Promises"], order: 3 },
  { number: "04", name: "React.js", category: "FRONTEND", badge: "UI ARCHITECTURE", level: "Advanced", description: "Component architecture, hooks, state management, Virtual DOM, and dynamic web interfaces.", tags: ["React 18", "Hooks", "Component Design", "State"], order: 4 },
  { number: "05", name: "Node.js", category: "BACKEND", badge: "SERVER RUNTIME", level: "Proficient", description: "Event-driven asynchronous server-side development, file systems, and npm ecosystem.", tags: ["Event Loop", "Backend", "NPM", "V8 Engine"], order: 5 },
  { number: "06", name: "Express.js", category: "BACKEND", badge: "API FRAMEWORK", level: "Proficient", description: "RESTful API creation, middleware pipeline design, CORS configuration, and route handling.", tags: ["REST APIs", "Middleware", "Routing", "Express"], order: 6 },
  { number: "07", name: "JWT", category: "BACKEND", badge: "SECURITY PROTOCOL", level: "Proficient", description: "JSON Web Token authentication, secure session handling, header tokens, and authorization.", tags: ["Authentication", "Security", "Tokens", "Auth Flow"], order: 7 },
  { number: "08", name: "MongoDB", category: "DATABASE", badge: "NOSQL PERSISTENCE", level: "Proficient", description: "NoSQL document database management, schema modeling, Mongoose ODM, and queries.", tags: ["NoSQL", "Mongoose", "Database", "MongoDB Atlas"], order: 8 },
  { number: "09", name: "C", category: "PROGRAMMING LANGUAGES", badge: "SYSTEM PROGRAMMING", level: "Proficient", description: "Procedural programming, memory management, pointers, structures, and low-level logic.", tags: ["Low Level", "Pointers", "Memory", "Procedural"], order: 9 },
  { number: "10", name: "Java", category: "PROGRAMMING LANGUAGES", badge: "OBJECT-ORIENTED", level: "Advanced", description: "Object-oriented programming, classes, inheritance, polymorphism, and Java application development.", tags: ["OOP", "Classes", "Inheritance", "JVM"], order: 10 },
  { number: "11", name: "VS Code", category: "TOOLS & PLATFORMS", badge: "DEVELOPMENT ENVIRONMENT", level: "Advanced", description: "Code editing environment, extensions configuration, debugging tools, and integrated terminal.", tags: ["IDE", "Debugging", "Extensions", "Editor"], order: 11 },
  { number: "12", name: "Git", category: "TOOLS & PLATFORMS", badge: "VERSION CONTROL", level: "Advanced", description: "Distributed version control system, branching strategies, commit history, and code tracking.", tags: ["Version Control", "CLI", "Branching", "Commits"], order: 12 },
  { number: "13", name: "GitHub", category: "TOOLS & PLATFORMS", badge: "CODE COLLABORATION", level: "Advanced", description: "Remote code hosting, pull requests, repository management, and open-source contribution.", tags: ["Remote Repo", "Pull Requests", "Collaboration", "CI/CD"], order: 13 },
  { number: "14", name: "Canva", category: "TOOLS & PLATFORMS", badge: "VISUAL DESIGN", level: "Proficient", description: "UI/UX asset generation, graphic layout creation, branding, and visual content design.", tags: ["Design", "Graphics", "UI Assets", "Branding"], order: 14 },
  { number: "15", name: "Antigravity", category: "TOOLS & PLATFORMS", badge: "AI CODING AGENT", level: "Advanced", description: "Advanced agentic AI coding environment, automated workflows, and full-stack development tooling.", tags: ["AI Assistant", "Automation", "Agentic Coding", "Dev Tools"], order: 15 },
  { number: "16", name: "React Native", category: "MOBILE DEVELOPMENT", badge: "CROSS-PLATFORM MOBILE", level: "Intermediate", description: "Cross-platform mobile app development for iOS and Android using React components.", tags: ["Mobile", "iOS & Android", "Native UI", "Cross Platform"], order: 16 },
  { number: "17", name: "Expo", category: "MOBILE DEVELOPMENT", badge: "REACT NATIVE FRAMEWORK", level: "Intermediate", description: "Expo framework and toolchain for building, testing, and deploying React Native applications.", tags: ["Expo CLI", "Mobile Dev", "Rapid Build", "Tooling"], order: 17 }
]

const getAll = async (req, res) => {
  try {
    let skills = await Skill.find().sort({ order: 1 })
    const oldSkillNames = ['DATA STRUCTURES & ALGORITHMS', 'THREE.JS / REACT THREE FIBER', 'POSTMAN & API TESTING', 'SQL & RELATIONAL CONCEPTS', 'TAILWIND CSS', 'OBJECT-ORIENTED DESIGN']
    const hasOld = skills.some(s => oldSkillNames.includes(s.name))
    if (skills.length === 0 || hasOld) {
      await Skill.deleteMany({})
      skills = await Skill.insertMany(defaultSkills)
    }
    res.status(200).json({ success: true, data: skills })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { name, number, badge, level, category, description, tags, icon, order } = req.body
    const skill = await Skill.create({
      name,
      number:      number || '',
      badge:       badge || '',
      level:       level || 'Advanced',
      category:    category || 'FRONTEND',
      description: description || '',
      tags:        Array.isArray(tags) ? tags : [],
      icon:        icon || '',
      order:       order !== undefined ? Number(order) : 0,
    })
    res.status(201).json({ success: true, data: skill })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { name, number, badge, level, category, description, tags, icon, order } = req.body
    const updates = {}

    if (name        !== undefined) updates.name        = name
    if (number      !== undefined) updates.number      = number
    if (badge       !== undefined) updates.badge       = badge
    if (level       !== undefined) updates.level       = level
    if (category    !== undefined) updates.category    = category
    if (description !== undefined) updates.description = description
    if (tags        !== undefined) updates.tags        = tags
    if (icon        !== undefined) updates.icon        = icon
    if (order       !== undefined) updates.order       = Number(order)

    const skill = await Skill.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    )
    if (!skill)
      return res.status(404).json({ success: false, message: 'Skill not found.' })
    res.status(200).json({ success: true, data: skill })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill)
      return res.status(404).json({ success: false, message: 'Skill not found.' })
    res.status(200).json({ success: true, message: 'Skill deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAll, create, update, remove }