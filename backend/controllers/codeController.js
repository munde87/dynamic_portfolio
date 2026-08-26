const CodeExample = require('../models/CodeExample');

const DEFAULT_EXAMPLES = [
  {
    title: 'web-developer.config.js',
    language: 'JavaScript',
    code: `const developer = {\n  name: "Shubham Munde",\n  role: "Software Engineer",\n  skills: ["Web Development", "Java", "DSA", "MERN Stack"],\n  mission: "Build. Learn. Improve.",\n  quote: "With great power comes great responsibility in code."\n};`,
    output: `Developer Profile Loaded Successfully\nName: Shubham Munde\nRole: Software Engineer\nSkills: Web Development, Java, DSA, MERN Stack\nMission: Build. Learn. Improve.`,
    order: 1
  },
  {
    title: 'power-up.java',
    language: 'Java',
    code: `class PowerUp {\n    public static void main(String[] args) {\n        String name = "Shubham";\n        int level = 1;\n\n        for (int i = 1; i <= 5; i++) {\n            level++;\n        }\n\n        System.out.println(name + " reached level " + level);\n        System.out.println("Keep learning. Keep building.");\n    }\n}`,
    output: `Shubham reached level 6\nKeep learning. Keep building.`,
    order: 2
  },
  {
    title: 'skill-scanner.js',
    language: 'JavaScript',
    code: `const skills = ["React", "Java", "Node.js", "MongoDB"];\n\nconsole.log("Scanning developer skills...");\n\nskills.forEach((skill, index) => {\n  console.log(\`\${index + 1}. \${skill} detected\`);\n});\n\nconsole.log("Scan complete.");`,
    output: `Scanning developer skills...\n1. React detected\n2. Java detected\n3. Node.js detected\n4. MongoDB detected\nScan complete.`,
    order: 3
  },
  {
    title: 'find-max.java',
    language: 'Java',
    code: `public class FindMax {\n    public static void main(String[] args) {\n        int[] numbers = {12, 45, 7, 89, 34};\n        int max = numbers[0];\n\n        for (int number : numbers) {\n            if (number > max) {\n                max = number;\n            }\n        }\n\n        System.out.println("Maximum value: " + max);\n    }\n}`,
    output: `Maximum value: 89`,
    order: 4
  },
  {
    title: 'api-response.js',
    language: 'JavaScript',
    code: `const response = {\n  success: true,\n  message: "Portfolio data loaded",\n  projects: 4\n};\n\nif (response.success) {\n  console.log(response.message);\n  console.log(\`Projects available: \${response.projects}\`);\n}`,
    output: `Portfolio data loaded\nProjects available: 4`,
    order: 5
  }
];

exports.getCodeExamples = async (req, res) => {
  try {
    let examples = await CodeExample.find().sort({ order: 1 });
    if (!examples || examples.length === 0) {
      examples = await CodeExample.insertMany(DEFAULT_EXAMPLES);
    }
    res.json({ success: true, data: examples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCodeExample = async (req, res) => {
  try {
    const example = await CodeExample.create(req.body);
    res.status(201).json({ success: true, data: example, message: 'Code example created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCodeExample = async (req, res) => {
  try {
    const example = await CodeExample.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!example) return res.status(404).json({ success: false, message: 'Code example not found.' });
    res.json({ success: true, data: example, message: 'Code example updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCodeExample = async (req, res) => {
  try {
    await CodeExample.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Code example deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
