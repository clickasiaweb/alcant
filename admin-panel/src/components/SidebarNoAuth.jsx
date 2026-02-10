import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTag,
  FaEnvelope,
  FaFileAlt,
  FaLayerGroup,
  FaSitemap,
} from "react-icons/fa";

export default function SidebarNoAuth() {
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: "250px",
        background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
        color: "white",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>IS Admin</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaHome style={{ marginRight: "0.5rem" }} /> Dashboard
        </button>

        <button
          onClick={() => navigate("/products")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaBox style={{ marginRight: "0.5rem" }} /> Products
        </button>

        <button
          onClick={() => navigate("/categories")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaTag style={{ marginRight: "0.5rem" }} /> Categories
        </button>

        <button
          onClick={() => navigate("/subcategories")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaSitemap style={{ marginRight: "0.5rem" }} /> Subcategories
        </button>

        <button
          onClick={() => navigate("/sub-subcategories")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaLayerGroup style={{ marginRight: "0.5rem" }} /> Sub-Subcategories
        </button>

        <button
          onClick={() => navigate("/inquiries")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaEnvelope style={{ marginRight: "0.5rem" }} /> Inquiries
        </button>

        <button
          onClick={() => navigate("/content")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
          className="sidebar-btn"
        >
          <FaFileAlt style={{ marginRight: "0.5rem" }} /> Content
        </button>
      </nav>

      <div
        style={{
          background: "#e94560",
          border: "none",
          color: "white",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          width: "100%",
          marginTop: "2rem",
          fontSize: "1rem",
          textAlign: "center",
        }}
      >
        Demo Mode (No Auth)
      </div>
    </aside>
  );
}
