import React from "react";
import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout
      title="About Us"
      description="Learn about Industrial Solutions - our mission, values, and commitment to excellence"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a4d7a] via-[#0d2d47] to-[#3d4a54] py-20 md:py-24">
        <div className="container text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              About Industrial Solutions
            </h1>
            <p className="text-xl text-[#f5f5f5] mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Leading the industry with innovative solutions and uncompromising quality since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a4d7a] mb-6">Our Mission</h2>
              <p className="text-lg text-[#4b5563] mb-6 leading-relaxed">
                To deliver exceptional industrial solutions that drive innovation, efficiency, and success for our clients worldwide. We are committed to excellence in every product we manufacture and every service we provide.
              </p>
              <p className="text-lg text-[#4b5563] mb-6 leading-relaxed">
                Through cutting-edge technology, rigorous quality control, and customer-centric approach, we strive to be the trusted partner for industries seeking reliable and high-performance solutions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#d1d5db] to-[#4b5563] rounded-lg h-96 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">Mission Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            The principles that guide everything we do
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Quality First",
                description: "Uncompromising commitment to excellence in every product and service",
                icon: "🏆"
              },
              {
                title: "Innovation",
                description: "Continuously pushing boundaries and embracing new technologies",
                icon: "💡"
              },
              {
                title: "Integrity",
                description: "Building trust through transparency, honesty, and ethical practices",
                icon: "🤝"
              },
              {
                title: "Customer Focus",
                description: "Putting our clients' needs at the center of every decision we make",
                icon: "👥"
              }
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#1a4d7a] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#4b5563]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#1a4d7a] text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "1000+", label: "Projects Completed" },
              { number: "15+", label: "Years Experience" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, idx) => (
              <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-[#f5f5f5]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="container">
          <h2 className="section-title">Our Leadership Team</h2>
          <p className="section-subtitle">
            Meet the experts driving our success
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Anderson",
                position: "CEO & Founder",
                description: "Visionary leader with 20+ years in industrial manufacturing"
              },
              {
                name: "Sarah Mitchell",
                position: "CTO",
                description: "Technology expert driving innovation and R&D initiatives"
              },
              {
                name: "Michael Chen",
                position: "Operations Director",
                description: "Ensuring operational excellence and customer satisfaction"
              }
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-[#d1d5db] to-[#4b5563] rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg">Photo</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a4d7a] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#c97c4a] font-semibold mb-3">{member.position}</p>
                <p className="text-[#4b5563]">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#c97c4a] text-white py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Success Story</h2>
          <p className="text-xl text-[#f5f5f5] mb-8 max-w-2xl mx-auto">
            Discover how Industrial Solutions can transform your business with our premium products and exceptional service.
          </p>
          <a
            href="/contact"
            className="bg-[#1a4d7a] hover:bg-[#0d2d47] text-white px-8 py-3 rounded-lg font-semibold transition inline-block"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </Layout>
  );
}
