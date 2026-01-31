import React, { useState } from "react";
import Layout from "../components/Layout";
import { submitInquiry } from "../lib/services";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitInquiry(formData);
      setMessage("Thank you! Your inquiry has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("Error submitting inquiry. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Contact Us"
      description="Get in touch with our team for inquiries and support"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a4d7a] via-[#0d2d47] to-[#3d4a54] py-16">
        <div className="container text-white">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Contact Us
          </h1>
          <p
            className="text-xl text-[#f5f5f5] animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            We're here to help. Get in touch with our team today.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#1a4d7a] mb-8 animate-fade-in-up">
                Get In Touch
              </h2>

              <div className="space-y-8">
                {/* Address */}
                <div
                  className="flex gap-4 animate-slide-in-left"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="text-[#c97c4a] text-2xl mt-1 flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                    <p className="text-[#4b5563]">
                      123 Industrial Avenue
                      <br />
                      Manufacturing District
                      <br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div
                  className="flex gap-4 animate-slide-in-left"
                  style={{ animationDelay: "150ms" }}
                >
                  <div className="text-[#c97c4a] text-2xl mt-1 flex-shrink-0">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                    <p className="text-[#4b5563]">
                      Main: +1 (555) 123-4567
                      <br />
                      Sales: +1 (555) 123-4568
                      <br />
                      Support: +1 (555) 123-4569
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div
                  className="flex gap-4 animate-slide-in-left"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="text-[#c97c4a] text-2xl mt-1 flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                    <p className="text-[#4b5563]">
                      info@industrialsolutions.com
                      <br />
                      sales@industrialsolutions.com
                      <br />
                      support@industrialsolutions.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-3xl font-bold text-primary mb-8">
                Send us a Message
              </h2>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg animate-fade-in-up ${message.includes("successfully") ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#1a4d7a] focus:ring-2 focus:ring-[#1a4d7a] focus:ring-opacity-20 transition-all resize-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full hover:scale-105 transform transition-transform"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gradient-to-br from-[#d1d5db] to-[#4b5563] rounded-lg h-96 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up">
            <p className="text-[#f5f5f5]">
              Google Map embed would go here (configure with your location)
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
