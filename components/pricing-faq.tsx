import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const pricingFaqData = [
  // {
  //   "id": "item-2",
  //   "question": "How does BuzzDaddy know what to search for and post?",
  //   "answer": "BuzzDaddy operates an AI agent that scrapes social media posts based on dynamically generated keywords. It then uses dedicated profiles to mention your business in response to these posts, operating 24/7 to generate leads."
  // },
  // {
  //   "id": "item-3",
  //   "question": "What social networks does BuzzDaddy support?",
  //   "answer": "BuzzDaddy currently supports Twitter, LinkedIn, and Reddit. It can scrape and comment on posts, and with autopilot enabled, it comments automatically."
  // },
  {
    "id": "item-1",
    "question": "Is BuzzDaddy easy to set up?",
    "answer": "Yes, BuzzDaddy is designed for ease of use. You can get started quickly with our step-by-step setup guide, and our support team is available to assist you at any time."
  },
  {
    "id": "item-11",
    "question": "How secure is BuzzDaddy?",
    "answer": "BuzzDaddy prioritizes your security. We use advanced encryption and follow best practices to ensure your data and interactions are protected."
  },
  {
    "id": "item-4",
    "question": "Can I customize the tone and voice of my AI agent?",
    "answer": "Yes, BuzzDaddy allows you to tweak the tone and voice of your AI agent to better fit your brand."
  },
  {
    "id": "item-6",
    "question": "How does BuzzDaddy avoid redundancy in its posts?",
    "answer": "BuzzDaddy remembers which posts it has interacted with, allowing it to boost these posts further with more dedicated profiles and avoiding redundancy."
  },
  // {
  //   "id": "item-7",
  //   "question": "What is the autopilot function?",
  //   "answer": "The autopilot function allows BuzzDaddy to continuously operate, automatically replying to and posting on social networks to generate organic buzz for your business."
  // },
  {
    "id": "item-12",
    "question": "How can BuzzDaddy help my business grow?",
    "answer": "BuzzDaddy enhances your online presence by actively engaging with potential customers on social media, driving organic traffic, and increasing brand visibility. This targeted interaction can lead to more leads and sales."
  },
  {
    "id": "item-14",
    "question": "Can I see results quickly with BuzzDaddy?",
    "answer": "Many users start seeing increased engagement within a few days. The AI's continuous operation ensures consistent interactions, which can lead to faster results."
  },
  {
    "id": "item-15",
    "question": "How do I know if BuzzDaddy is right for my business?",
    "answer": "BuzzDaddy is ideal for any business looking to increase its social media presence and drive organic sales. Our customizable settings ensure it fits your brand's unique voice and goals."
  },
  {
    "id": "item-18",
    "question": "What makes BuzzDaddy different from other social media automation tools?",
    "answer": "Unlike other tools, BuzzDaddy offers continuous operation, customizable AI responses, and robust link tracking. Its ability to remember and boost previous interactions ensures maximum engagement without redundancy."
  },
  {
    "id": "item-19",
    "question": "Can I control which posts BuzzDaddy interacts with?",
    "answer": "Yes, you have full control over the keywords and types of posts BuzzDaddy targets, ensuring it interacts with the most relevant content for your business."
  },
  {
    "id": "item-11",
    "question": "Can my account get banned?",
    "answer": "BuzzDaddy prioritizes your security. We use advanced encryption and follow best practices to ensure your data and interactions are protected."
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-3xl py-2">
      <div className="mb-14 space-y-6 text-center">
        <h1 className="text-balance text-center font-heading text-3xl md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-md text-balance text-muted-foreground">
          Explore our comprehensive FAQ to find quick answers to common inquiries.
          If you need further assistance, don&apos;t hesitate to contact us for personalized help.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent>{faqItem.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}