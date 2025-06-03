import { useBack } from "~/hooks/useBack";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { faq } from "./faq";

export const FaqPage = () => {
  useBack("/profile");
  const { t } = useTranslation();

  return (
    <main className="space-y-6 pb-8">
      <section className="space-y-2">
        <h2 className="text-4xl font-semibold">{t('faq')}</h2>
        <Accordion type="single" defaultValue={`faq-0`} collapsible>
          {faq.map((article, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                {t(article.title)}
              </AccordionTrigger>
              <AccordionContent className="text-tertiary">
                {t(article.content)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};
