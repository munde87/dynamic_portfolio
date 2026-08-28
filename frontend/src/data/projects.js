export const projectCategories = [
  {
    id: "cat_01",
    categoryNumber: "01",
    categoryTitle: "FULL STACK WEB PLATFORMS",
    subtitle: "REACT, NODE.JS & MONGODB",
    description: "Production-ready full-stack applications engineered for community sharing, transactions, and healthcare management.",
    projects: [
      {
        id: "acadex",
        number: "01",
        title: "Acadex — Everything Students Need",
        badge: "STUDENT RESOURCE NETWORK",
        category: "Full Stack Academic Platform",
        summary: "A full-stack student-focused academic resource platform to buy, sell, rent, exchange books & share study materials.",
        description:
          "Acadex is a full-stack student-focused academic resource platform designed to bring everything students need into one connected ecosystem. The platform allows students to buy, sell, rent, and exchange books and college-related resources, while also discovering and sharing Notes, PYQs, assignments, practical files, and other study materials. Students can create their own profiles, manage listings, upload academic resources, search and filter materials based on categories and academic details, save useful resources, post requests, and connect directly with other students through a real-time in-app chat system.",
        tags: ["React", "Vite", "Node.js", "Express.js", "MongoDB", "Socket.IO", "Tailwind CSS", "JWT", "Cloudinary"],
        liveUrl: "https://acadex-amber.vercel.app/",
        githubUrl: "https://github.com/munde87/Acadex",
        image: "/assets/project-acadex.png",
        highlights: [
          "Buy, Sell, Rent & Exchange books and college academic resources",
          "Study Materials Hub for Notes, PYQs, Assignments & Practical Files",
          "Real-time student-to-student in-app messaging powered by Socket.IO",
          "Student profiles, listing management, resource bookmarks, and secure authentication"
        ],
        metrics: {
          network: "Resource Ecosystem",
          chat: "Real-time Socket.IO",
          stack: "MERN + Socket.IO"
        }
      },
      {
        id: "arogya",
        number: "02",
        title: "Tumhara Arogya",
        badge: "PANCHAKARMA MANAGEMENT",
        category: "Healthcare System",
        summary: "A comprehensive Panchakarma Healthcare Management System featuring patient analysis, treatment scheduling, and progress tracking.",
        description:
          "Tumhara Arogya is a specialized Panchakarma Management System engineered for Ayurvedic healthcare centers. It digitizes the complete patient journey including patient details & Dosha analysis (Vata, Pitta, Kapha), multi-day treatment planning & therapist scheduling, daily process logs & progress tracking, executive management insights, and therapist allocation dashboards.",
        tags: ["React", "Node.js", "Express.js", "MongoDB", "Cloud Sync", "Healthcare"],
        liveUrl: "https://arogya-health.vercel.app",
        githubUrl: "https://github.com/munde87/Arogya",
        image: "/assets/project-arogya.png",
        highlights: [
          "Patient details analysis & Ayurvedic Vata/Pitta/Kapha profile tracking",
          "Multi-day Panchakarma treatment program planning & therapist allocation grid",
          "Process logs, vital signs monitoring, and real-time treatment progress tracking",
          "Executive management dashboard with patient volume, inventory, and branch insights"
        ],
        metrics: {
          domain: "Ayurvedic Healthcare",
          scheduling: "7-Day Panchakarma",
          sync: "Cloud & Database Sync"
        }
      }
    ]
  }
];

// Flat list for easy search/filter
export const allProjects = projectCategories.flatMap(cat => 
  cat.projects.map(p => ({ ...p, categoryTitle: cat.categoryTitle, categoryNumber: cat.categoryNumber }))
);
