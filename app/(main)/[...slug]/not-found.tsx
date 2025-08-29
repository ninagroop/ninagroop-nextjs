import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1 className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
        Page Not Found
      </h1>

      <article className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]">
        <div className="prose prose-lg prose-headings:font-normal prose-headings:text-text-bold prose-p:text-body-text prose-p:leading-relaxed max-w-none">
          <p>
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <p>
            <Link
              href="/"
              className="text-brand-orange border-text-light hover:text-text-bold border-b border-dotted no-underline hover:border-transparent"
            >
              Return to the home page
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
