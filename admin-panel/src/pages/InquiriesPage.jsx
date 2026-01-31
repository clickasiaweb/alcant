import React, { useState, useEffect } from "react";
import { FiMail, FiUser, FiCalendar, FiMessageSquare, FiCheck, FiClock, FiX, FiEye } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import { getAdminInquiries, updateInquiryStatus } from "../services/api-services";
import { toast } from "react-toastify";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, [filter]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const data = await getAdminInquiries(params);
      setInquiries(data.inquiries || []);
    } catch (error) {
      toast.error("Error loading inquiries");
      console.error("Error loading inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, response = "") => {
    try {
      await updateInquiryStatus(id, newStatus, response);
      toast.success("Inquiry updated!");
      loadInquiries();
      setShowModal(false);
      setSelectedInquiry(null);
    } catch (error) {
      toast.error("Error updating inquiry");
      console.error("Error updating inquiry:", error);
    }
  };

  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: "bg-yellow-100 text-yellow-800", icon: FiClock, label: "New" },
      read: { color: "bg-blue-100 text-blue-800", icon: FiEye, label: "Read" },
      responded: { color: "bg-green-100 text-green-800", icon: FiCheck, label: "Responded" },
      closed: { color: "bg-gray-100 text-gray-800", icon: FiX, label: "Closed" }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries Management</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and responses</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg shadow p-1">
            {["all", "new", "read", "responded", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr key={inquiry._id || inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.name}
                            </div>
                            {inquiry.company && (
                              <div className="text-sm text-gray-500">
                                {inquiry.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="text-sm text-gray-500">
                            {inquiry.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {inquiry.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openInquiryModal(inquiry)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        {inquiry.status === "new" && (
                          <button
                            onClick={() => handleStatusChange(inquiry._id, "read")}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark Read
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inquiry Detail Modal */}
        {showModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                  )}
                  {selectedInquiry.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <p className="text-sm text-gray-900">{selectedInquiry.company}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-sm text-gray-900">{selectedInquiry.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Status</label>
                  {getStatusBadge(selectedInquiry.status)}
                </div>

                {selectedInquiry.productId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Related Product</label>
                    <p className="text-sm text-gray-900">
                      {selectedInquiry.productId?.name || "Product ID: " + selectedInquiry.productId}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex space-x-2">
                    {selectedInquiry.status !== "read" && (
                      <button
                        onClick={() => handleStatusChange(selectedInquiry._id, "read")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Mark as Read
                      </button>
                    )}
                    {selectedInquiry.status !== "responded" && (
                      <button
                        onClick={() => handleStatusChange(selectedInquiry._id, "responded")}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Mark as Responded
                      </button>
                    )}
                    {selectedInquiry.status !== "closed" && (
                      <button
                        onClick={() => handleStatusChange(selectedInquiry._id, "closed")}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Close Inquiry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
