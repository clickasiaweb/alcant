import React from "react";
import Layout from "../components/Layout";

export default function Industries() {
  return (
    <Layout
      title="Industries"
      description="Industrial Solutions serves diverse industries with specialized products and services"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a4d7a] via-[#0d2d47] to-[#3d4a54] py-20 md:py-24">
        <div className="container text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Industries We Serve
            </h1>
            <p className="text-xl text-[#f5f5f5] mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Providing specialized industrial solutions across multiple sectors with unmatched expertise
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container">
          <h2 className="section-title">Our Industry Expertise</h2>
          <p className="section-subtitle">
            Tailored solutions for your specific industry needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Manufacturing",
                description: "Comprehensive solutions for modern manufacturing facilities including automation equipment, precision tools, and production line optimization.",
                icon: "🏭",
                features: ["Automation Systems", "Precision Tools", "Quality Control", "Production Optimization"]
              },
              {
                title: "Construction",
                description: "Heavy-duty equipment and solutions for construction projects, from residential buildings to infrastructure development.",
                icon: "🏗️",
                features: ["Heavy Machinery", "Safety Equipment", "Project Management", "Site Optimization"]
              },
              {
                title: "Energy & Power",
                description: "Specialized equipment for power generation, renewable energy systems, and energy infrastructure maintenance.",
                icon: "⚡",
                features: ["Power Generation", "Renewable Energy", "Grid Systems", "Maintenance Tools"]
              },
              {
                title: "Oil & Gas",
                description: "Robust solutions for oil and gas exploration, drilling, refining, and transportation operations.",
                icon: "🛢️",
                features: ["Drilling Equipment", "Safety Systems", "Pipeline Solutions", "Refining Tools"]
              },
              {
                title: "Automotive",
                description: "Precision manufacturing solutions and equipment for automotive production and assembly lines.",
                icon: "🚗",
                features: ["Assembly Lines", "Quality Testing", "Robotics", "Paint Systems"]
              },
              {
                title: "Aerospace",
                description: "High-precision equipment and solutions for aerospace manufacturing and maintenance operations.",
                icon: "✈️",
                features: ["Precision Tools", "Testing Equipment", "Maintenance Systems", "Quality Control"]
              },
              {
                title: "Pharmaceutical",
                description: "Clean room solutions and specialized equipment for pharmaceutical manufacturing and research.",
                icon: "💊",
                features: ["Clean Room Systems", "Mixing Equipment", "Quality Assurance", "Packaging Solutions"]
              },
              {
                title: "Food & Beverage",
                description: "Hygienic processing equipment and solutions for food and beverage production facilities.",
                icon: "🍽️",
                features: ["Processing Equipment", "Packaging Systems", "Quality Control", "Sanitation Solutions"]
              },
              {
                title: "Mining",
                description: "Heavy-duty equipment and safety solutions for mining operations and mineral processing.",
                icon: "⛏️",
                features: ["Mining Equipment", "Safety Systems", "Processing Plants", "Environmental Solutions"]
              }
            ].map((industry, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-5xl mb-4">{industry.icon}</div>
                <h3 className="text-2xl font-bold text-[#1a4d7a] mb-4">
                  {industry.title}
                </h3>
                <p className="text-[#4b5563] mb-6 leading-relaxed">
                  {industry.description}
                </p>
                <div className="space-y-2">
                  {industry.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-center text-sm text-[#4b5563]">
                      <span className="text-[#c97c4a] mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a4d7a] mb-6">Our Industry Approach</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Deep Industry Knowledge",
                    description: "Our team understands the unique challenges and requirements of each industry we serve."
                  },
                  {
                    title: "Customized Solutions",
                    description: "We tailor our products and services to meet specific industry standards and regulations."
                  },
                  {
                    title: "Continuous Innovation",
                    description: "Staying ahead of industry trends and technological advancements to provide cutting-edge solutions."
                  },
                  {
                    title: "Regulatory Compliance",
                    description: "Ensuring all solutions meet industry-specific regulations and safety standards."
                  }
                ].map((approach, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="text-[#c97c4a] text-xl font-bold mt-1">•</div>
                    <div>
                      <h4 className="font-semibold text-[#1a4d7a] mb-1">{approach.title}</h4>
                      <p className="text-[#4b5563]">{approach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#d1d5db] to-[#4b5563] rounded-lg h-96 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">Industry Solutions Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-20">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">
            Real results from real industry partnerships
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                industry: "Manufacturing",
                client: "Global Auto Parts Inc.",
                result: "Increased production efficiency by 35%",
                description: "Implemented automated assembly line solutions that reduced production time and improved quality control."
              },
              {
                industry: "Energy",
                client: "Renewable Power Systems",
                result: "Reduced maintenance costs by 40%",
                description: "Provided specialized monitoring and maintenance equipment for wind turbine operations."
              },
              {
                industry: "Construction",
                client: "Metro Construction Group",
                result: "Completed project 2 weeks ahead of schedule",
                description: "Supplied advanced project management tools and equipment that streamlined workflow."
              }
            ].map((study, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-sm text-[#c97c4a] font-semibold mb-2">{study.industry}</div>
                <h3 className="text-xl font-bold text-[#1a4d7a] mb-3">{study.client}</h3>
                <div className="text-lg font-semibold text-green-600 mb-3">{study.result}</div>
                <p className="text-[#4b5563] mb-4">{study.description}</p>
                <a href="#" className="text-[#1a4d7a] hover:text-[#c97c4a] font-semibold">
                  Read Full Case Study →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a4d7a] text-white py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Industry-Specific Solutions</h2>
          <p className="text-xl text-[#f5f5f5] mb-8 max-w-2xl mx-auto">
            Let us help you find the perfect industrial solutions for your specific industry needs.
          </p>
          <a
            href="/contact"
            className="bg-[#c97c4a] hover:bg-[#a85e38] text-white px-8 py-3 rounded-lg font-semibold transition inline-block"
          >
            Discuss Your Industry Needs
          </a>
        </div>
      </section>
    </Layout>
  );
}
