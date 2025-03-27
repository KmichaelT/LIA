'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gallery4 } from '../gallery4';

// Define the CauseCardProps interface
interface CauseCardProps {
  image: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  progress: number;
}

// Updated gallery items with numeric IDs to match Gallery4Item type
const galleryItems = [
  {
    id: 1,  // Changed from string to number
    title: "Electricity and Water Installation",
    description: "Enhances quality of life by improving access to clean water, lighting, and technology, which support health and education.",
    image: "/images/causes/electricityInstallation.webp",
    href: "/causes/electricity-water",
    progress: 65,
    amountRaised: 65000,
    goalAmount: 100000,
    category: "Infrastructure",
    createdAt: "Dec 18, 2024",
    goal: "Install electric and water lines to provide essential infrastructure for schools and households."
  },
  {
    id: 2,  // Changed from string to number
    title: "Education and Mentorship",
    description: "Equips children with the tools and guidance they need to achieve their dreams and break the cycle of poverty.",
    image: "/images/causes/education.webp",
    href: "/causes/education-mentorship",
    progress: 80,
    amountRaised: 80000,
    goalAmount: 100000,
    category: "Education",
    createdAt: "Dec 18, 2024",
    goal: "Offer tutoring, mentoring programs, and school supplies to enhance academic and personal success."
  },
  {
    id: 3,  // Changed from string to number
    title: "Feeding Program",
    description: "Ensures children remain healthy, energized, and focused on their education.",
    image: "/images/causes/feeding.webp",
    href: "/causes/feeding-program",
    progress: 75,
    amountRaised: 75000,
    goalAmount: 100000,
    category: "Nutrition",
    createdAt: "Dec 18, 2024",
    goal: "Provide nutritious meals to combat malnutrition and support children's physical and mental growth."
  },
  {
    id: 4,  // Changed from string to number
    title: "Building a Children and Youth Center",
    description: "Empowers youth by offering opportunities for learning, mentorship, and recreation.",
    image: "/images/causes/youth_center.webp",
    href: "/causes/youth-center",
    progress: 40,
    amountRaised: 40000,
    goalAmount: 100000,
    category: "Infrastructure",
    createdAt: "Dec 18, 2024",
    goal: "Establish a safe and enriching space equipped with a library, classrooms, and sports facilities to foster education and talents."
  },
  {
    id: 5,  // Changed from string to number
    title: "Cloth Donation Program",
    description: "By donating clothing to children in Ethiopia, we create a lasting impact by improving their well-being, boosting self-confidence, and fostering opportunities for a brighter future.",
    image: "/images/causes/cloth_donation.webp",
    href: "/causes/clothing-donation",
    progress: 55,
    amountRaised: 55000,
    goalAmount: 100000,
    category: "Other",
    createdAt: "Dec 20, 2024",
    goal: "To provide children in Southern Ethiopia with essential clothing, ensuring comfort, dignity, and improved quality of life while supporting their educational and social development."
  }
];


export default function CausesSection() {
 
  return (
    <> 

        <section className="py-2 bg-slate-50 relative overflow-hidden">
      <div className="container">
      <Gallery4 
  title="Small gifts can have a big influence." 
  description="Even modest contributions can lead to substantial and meaningful societal change."
  items={galleryItems}
/>

 
      </div>
    </section></>

  );
}
