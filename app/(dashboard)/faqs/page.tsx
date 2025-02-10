
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FAQPage() {
  const faqs = [
    {
      question: "Visuals Status of Property through Photos",
      answer:
        "Detailed information about visual property status monitoring through photography.",
    },
    {
      question: "Visual Media Excellence",
      answer: "Information about our visual media standards and practices.",
    },
    {
      question: "Proactive Enforcement Against Illegal Possession and Construction",
      answer:
        "Details about our proactive measures against unauthorized possession and construction.",
    },
    {
      question: "Exclusive Client Name Display Board",
      answer:
        "Information about client name display board services and implementation.",
    },
    {
      question: "Comprehensive Property Protection",
      answer:
        "Overview of our complete property protection services and measures.",
    },
    {
      question: "Emergency Contact Support",
      answer:
        "Details about our emergency contact support system and response times.",
    },
    {
      question: "Pest and Infestation Management",
      answer:
        "Information about our pest control and infestation management services.",
    },
    {
      question: "Ongoing Maintenance of Security Systems",
      answer:
        "Details about our security system maintenance procedures and schedules.",
    },
    {
      question: "Responsible Hazardous Waste Disposal",
      answer:
        "Information about our hazardous waste disposal protocols and practices.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#521D5C] flex flex-col">
      
      <main className="flex-grow flex items-start justify-center px-4 pt-4 pb-16">
        <ScrollArea className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-4xl h-[600px]">
          <h2 className="text-3xl font-bold text-center mb-4">FAQ</h2>

          <Accordion type="single" collapsible className="space-y-1">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-2 py-0.5 border-gray-300 "
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-bold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </main>
    </div>
  );
}