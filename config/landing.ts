import { Icons } from "@/components/shared/icons";

export type InfoList = {
    icon: keyof typeof Icons;
    title: string;
    description: string;
  };
  
  export type InfoLdg = {
    title: string;
    images: string[];
    description: string;
    list: InfoList[];
  }

export const infos: InfoLdg[] = [
  {
    title: "People love our replies 😁",
    description:
      "User generated comments perform 10x better for generating organic leads than traditional ads.",
    images: ["/cases/1.png", "/cases/2.png", "/cases/3.png", "/cases/4.png"],
    list: [
      // {
      //   title: "Runs 24/7",
      //   description:
      //     "So you don't have to.",
      //   icon: "laptop",
      // },
      // {
      //   title: "Reminders",
      //   description: "Made for Solo Devs, Agencies, Creators & Startups.",
      //   icon: "search",
      // },
      // {
      //   title: "Analytics",
      //   description:
      //     "Measure and evaluate the effectiveness of AI-generated replies and posts.",
      //   icon: "settings",
      // },
    ],
  },
];

export const features = [
  {
    title: "Feature 1",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
  },
  {
    title: "Feature 2",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
  },
  {
    title: "Feature 3",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
  },
  {
    title: "Feature 4",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
  },
  {
    title: "Feature 5",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
  },
  {
    title: "Feature 6",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
  },
];

export const testimonials = [
  {
    name: "Aisha Patel",
    job: "Operations Manager",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    review:
      "Since integrating drivethru.ai into our drive-thru operations, we've seen a significant increase in efficiency and customer satisfaction. The AI handles orders quickly and accurately, reducing wait times and improving overall service.",
  },
  {
    name: "Mark Evans",
    job: "General Manager",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "drivethru.ai has revolutionized our drive-thru experience. Our customers appreciate the smooth, hassle-free ordering process, and our staff can now focus more on food preparation and quality. It's been a game-changer for us!",
  },
  {
    name: "Carlos Ramirez",
    job: "Shift Supervisor",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    review:
      "Using drivethru.ai has really streamlined our operations. Orders are taken accurately and quickly, and we've seen a noticeable drop in errors. Customers are happier, and so are we!",
  },
  {
    name: "Emily Carter",
    job: "Franchise Owner",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    review:
      "Implementing drivethru.ai was one of the best decisions we've made. The AI's accuracy in taking orders has drastically reduced errors and increased customer satisfaction. It's amazing how technology can transform a simple drive-thru experience!",
  },
  {
    name: "David Miller",
    job: "Director of Operations",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "Our drive-thru efficiency has improved remarkably since we started using drivethru.ai. The AI system is fast, reliable, and easy for customers to interact with. We've received numerous compliments on the enhanced service.",
  },
  {
    name: "Charles Dorsch",
    job: "CEO",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "drivethru.ai has exceeded our expectations. The transition to AI voice ordering was seamless, and our customers love the quick and accurate service. It has also helped reduce labor costs and improved our overall efficiency.",
  },
  {
    name: "Mei Lin",
    job: "Restaurant Owner",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    review:
      "I'm truly impressed by drivethru.ai. The AI is intuitive and easy for our customers to use. It has made a big difference in our drive-thru service, making it faster and more efficient. Highly recommended!",
  },
  {
    name: "Li Wei",
    job: "Business Owner",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    review:
      "We were thinking of opening up a drive thru but was intimated at the cost and training. But using AI voice ordering from inception was seamless, and our customers love the quick and accurate service. It has also helped reduce labor costs estimated and improved our overall efficiency.",
  }
];

