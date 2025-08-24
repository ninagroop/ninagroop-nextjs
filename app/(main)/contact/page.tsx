import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact - Nina Groop',
  description:
    'Get in touch with Nina Groop for coaching inquiries, speaking engagements, or general questions.',
};

export default function ContactPage() {
  return (
    <>
      <h1 className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
        Contact
      </h1>

      <article className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]">
        <section>
          <div>
            <ContactForm />
          </div>
        </section>
      </article>
    </>
  );
}
