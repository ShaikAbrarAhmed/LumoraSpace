export type ServiceCategory = {
  id: string
  title: string
  summary: string
  services: string[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "ai-data",
    title: "AI & data science",
    summary: "Put AI to work inside real products and turn raw data into decisions.",
    services: [
      "AI Integration & Strategy",
      "AI Agents Development",
      "Natural Language Processing",
      "Data Analytics",
    ],
  },
  {
    id: "custom-development",
    title: "Custom development",
    summary: "Software, web apps and platforms built around the way your business works.",
    services: [
      "Software Development",
      "Web Application Development",
      "Full-Stack Development",
      "Custom Website & CMS",
      "Enterprise Portals & Dashboards",
      "eCommerce Website Development",
    ],
  },
  {
    id: "mobile",
    title: "Mobile app development",
    summary: "Native and cross-platform apps for iOS and Android.",
    services: ["Native Mobile App", "Hybrid Mobile App"],
  },
  {
    id: "cloud-engineering",
    title: "Cloud & digital engineering",
    summary: "Cloud infrastructure and engineering, plus research and development for new product ideas.",
    services: ["Cloud Infrastructure", "Digital Engineering", "Research & Development"],
  },
  {
    id: "it-solutions",
    title: "IT solutions",
    summary: "Strategy, extra engineering capacity and long-term support for the technology you run.",
    services: [
      "Digital Transformation",
      "IT Staff Augmentation",
      "Technology Consulting",
      "Maintenance & Support",
    ],
  },
  {
    id: "no-code",
    title: "No-code development",
    summary: "Sites and stores launched quickly on the platform that suits your team.",
    services: [
      "WordPress Development",
      "Webflow Development",
      "Wix Development",
      "Shopify Development",
      "Magento Development",
      "Bubble.io Development",
      "Framer Development",
      "Dora Development",
      "Studio AI Development",
    ],
  },
  {
    id: "design",
    title: "Design services",
    summary: "Product interfaces, brand identities and graphics that are clear and consistent.",
    services: ["UI/UX & Product Design", "Branding & Visual Identity", "Graphic Design"],
  },
  {
    id: "marketing",
    title: "Marketing services",
    summary: "Search, inbound and paid campaigns that bring the right people to your product.",
    services: ["Inbound Marketing", "SEO Services", "Social Media & Paid Ads"],
  },
  {
    id: "zero-to-one",
    title: "Zero to one",
    summary: "Go from idea to a working product you can put in front of users.",
    services: ["MVP Development", "Rapid Prototyping"],
  },
  {
    id: "edtech",
    title: "EdTech",
    summary: "Mentor-led learning that takes students from confused to confident, built around real projects.",
    services: [
      "Mentor-Led Programs",
      "Capstone Projects",
      "Hackathons & Global Challenges",
      "1:1 Mentorship & Code Review",
      "Verifiable Certificates",
    ],
  },
  {
    id: "college-collaborations",
    title: "College collaborations",
    summary: "Partner with us to bring programs, hackathons and events to your campus.",
    services: [
      "Campus Hackathons on Lumora Arena",
      "Event Ticketing & QR Check-in",
      "Mentor-Led Programs for Students",
      "Student Community Access",
    ],
  },
]
