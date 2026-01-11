"use client";

import React, { useState } from "react";
import Image from "next/image";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("guoyuhao4@gmail.com");
      setCopied(true);
      // delay and restore copy button
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll direction="down">
          <h1 className="text-4xl md:text-6xl text-center mb-8 font-medium">
            Contact Me
          </h1>
        </AnimateOnScroll>

        <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
          {/* Social Links & Email Section */}
          <AnimateOnScroll direction="left" className="w-full md:w-1/3">
            <div className="card bg-base-200 shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

              {/* Email Display */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="label-text font-semibold">guoyuhao4@gmail.com</span>
                  <button
                    onClick={handleCopyEmail}
                    className="btn btn-sm btn-ghost btn-circle"
                    aria-label="Copy email"
                    title={copied ? "Copied!" : "Copy email"}
                  >
                    <Image
                      src="/icons/copy.svg"
                      alt="Copy"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/in/guo-yuhao-kotrgyh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-outline hover:btn-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Image
                    src="/icons/linkedin_bnw.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://www.github.com/ringoftheking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-outline hover:btn-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Image
                    src="/icons/github-mark.svg"
                    alt="GitHub"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Contact Form */}
          <AnimateOnScroll direction="right" className="w-full md:w-2/3">
            <div className="card bg-base-200 shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Send a Message (Not Working Yet)</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Message</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="textarea textarea-bordered h-32 w-full"
                    required
                  ></textarea>
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
