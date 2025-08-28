import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">Contact Us</h1>
      {sent ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-6">
          Thank you for reaching out to PurniaPulse! We have received your message and will reply soon.
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="message">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
