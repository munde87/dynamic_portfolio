export const projectCategories = [
  {
    id: "cat_01",
    categoryNumber: "01",
    categoryTitle: "FULL STACK WEB PLATFORMS",
    subtitle: "REACT, NODE.JS & MONGODB",
    description: "Production-ready full-stack applications engineered for community sharing, transactions, and healthcare management.",
    projects: [
      {
        id: "bookbuddy",
        number: "01",
        title: "BookBuddy",
        badge: "RENT, EXCHANGE & SELL BOOKS",
        category: "Full Stack Platform",
        summary: "An online platform designed for book lovers to rent, exchange, and sell books easily with sustainable book sharing.",
        description:
          "BookBuddy is an online platform designed for book lovers to rent, exchange, and sell books easily. The platform connects users who want to give their old books a new life with those who are looking for affordable books to read. Users can list their books for sale, offer them for rent, or exchange them with other users. BookBuddy aims to make books more accessible, affordable, and sustainable by encouraging the reuse and sharing of books with a simple, user-friendly interface.",
        tags: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
        liveUrl: "https://bookbuddy-app.vercel.app",
        githubUrl: "https://github.com/munde87/BookBuddy",
        image: "/assets/project-bookbuddy.jpg",
        highlights: [
          "Book rental, sale, and direct exchange transactional workflows",
          "User-to-user book discovery, listing management, and search indexing",
          "RESTful API backend with MongoDB document schemas and Express routing",
          "Sustainable book sharing UI designed for accessibility and seamless navigation"
        ],
        metrics: {
          platform: "Rent, Exchange, Sell",
          architecture: "MERN Stack",
          ui: "Responsive & Intuitive"
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
