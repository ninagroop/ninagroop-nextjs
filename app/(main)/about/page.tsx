export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-8">About</h1>
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Learn more about Nina Groop, her journey as a life coach, author, and speaker.
          </p>
          <div className="border-l-4 border-gray-300 pl-4">
            <p className="text-gray-600 italic">
              This page will be populated with content from the markdown files in the content directory.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
