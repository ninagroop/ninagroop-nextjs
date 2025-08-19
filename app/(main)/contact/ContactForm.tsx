'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    isSubmitting: false,
    isSubmitted: false,
    error: null as string | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          name: '',
          email: '',
          message: '',
        }));
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'There was an error sending your message. Please try again.',
      }));
    }
  };

  if (formState.isSubmitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-green-800">Thanks!</h3>
        <p className="text-green-700">
          Thanks for reaching out, I'll get back to you soon!
        </p>
      </div>
    );
  }

  return (
    <section className="section mt-8">
      <div className="container">
        <form
          name="contact"
          method="post"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="max-w-lg"
        >
          <input type="hidden" name="form-name" value="contact" />
          <div hidden>
            <label>
              Don't fill this out:{' '}
              <input name="bot-field" onChange={handleChange} />
            </label>
          </div>

          {formState.error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">{formState.error}</p>
            </div>
          )}

          <div className="field mb-4">
            <label
              className="label mb-2 block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Your name
            </label>
            <div className="control">
              <input
                className="input w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                id="name"
                required
              />
            </div>
          </div>

          <div className="field mb-4">
            <label
              className="label mb-2 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <div className="control">
              <input
                className="input w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                id="email"
                required
              />
            </div>
          </div>

          <div className="field mb-6">
            <label
              className="label mb-2 block text-sm font-medium text-gray-700"
              htmlFor="message"
            >
              Message
            </label>
            <div className="control">
              <textarea
                className="textarea w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="message"
                value={formState.message}
                onChange={handleChange}
                id="message"
                rows={5}
                required
              />
            </div>
          </div>

          <div className="field">
            <button
              className="button rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
