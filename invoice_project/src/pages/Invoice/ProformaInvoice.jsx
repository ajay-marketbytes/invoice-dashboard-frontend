import React, { useState, useEffect } from "react";
import { FileText, Eye, Trash2, Pencil, Check } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const ProformaInvoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await apiClient.get("invoices/invoices/");
        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch invoices. Please try again later.");
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await apiClient.delete(`invoices/invoices/${invoiceId}/`);
        setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
        setIsModalOpen(false);
        alert("Invoice deleted successfully!");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };

  const handleEdit = (invoice) => {
    navigate("/invoice/edit", { state: { invoice } });
  };

  const handleMoveToFinal = (invoice) => {
    navigate("/invoice/final", { state: { invoice } });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  if (loading) return <p className="text-center text-gray-600">Loading invoices...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Proforma Invoices
      </h1>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-gray-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8 text-indigo-500" />
                <div>
                  <h5 className="text-lg font-semibold text-gray-800">
                    Invoice {invoice.invoice_number}
                  </h5>
                  <p className="text-sm text-gray-500">Client ID: {invoice.client}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {invoice.invoice_date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      invoice.invoice_type === "product"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {invoice.invoice_type}
                  </span>
                </p>
              </div>
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-800 transition-colors"
                  onClick={() => handleView(invoice)}
                >
                  <Eye size={16} /> View
                </button>
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition-colors"
                  onClick={() => handleDelete(invoice.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Invoice Details */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Invoice: {selectedInvoice.invoice_number}
            </h2>
            <div className="space-y-2">
              <p><strong>Client ID:</strong> {selectedInvoice.client}</p>
              <p><strong>Branch Address ID:</strong> {selectedInvoice.branch_address}</p>
              <p><strong>Bank Account ID:</strong> {selectedInvoice.bank_account}</p>
              <p><strong>Invoice Date:</strong> {selectedInvoice.invoice_date}</p>
              <p><strong>Due Date:</strong> {selectedInvoice.due_date}</p>
              <p><strong>Currency:</strong> {selectedInvoice.currency_type}</p>
              <p><strong>Payment Terms:</strong> {selectedInvoice.payment_terms}</p>
              <p><strong>Tax Option:</strong> {selectedInvoice.tax_option}</p>
              <p><strong>Tax Rate:</strong> {selectedInvoice.tax_rate ? `${selectedInvoice.tax_rate}%` : "N/A"}</p>
              <p><strong>Subtotal:</strong> {selectedInvoice.subtotal} {selectedInvoice.currency_type}</p>
              <p><strong>GST:</strong> {selectedInvoice.gst} {selectedInvoice.currency_type}</p>
              <p><strong>Discount:</strong> {selectedInvoice.discount} {selectedInvoice.currency_type}</p>
              <p><strong>Shipping:</strong> {selectedInvoice.shipping} {selectedInvoice.currency_type}</p>
              <p><strong>Amount Paid:</strong> {selectedInvoice.amount_paid} {selectedInvoice.currency_type}</p>
              <p><strong>Total Due:</strong> {selectedInvoice.total_due} {selectedInvoice.currency_type}</p>
            </div>

            {/* Items Table */}
            {selectedInvoice.items.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-2 text-sm font-bold">Name</th>
                      <th className="p-2 text-sm font-bold">Quantity</th>
                      <th className="p-2 text-sm font-bold">Unit Cost</th>
                      <th className="p-2 text-sm font-bold">Total</th>
                      <th className="p-2 text-sm font-bold">GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 text-sm">{item.name}</td>
                        <td className="p-2 text-sm">{item.quantity}</td>
                        <td className="p-2 text-sm">{item.unit_cost} {selectedInvoice.currency_type}</td>
                        <td className="p-2 text-sm">{item.total} {selectedInvoice.currency_type}</td>
                        <td className="p-2 text-sm">{item.total_gst} {selectedInvoice.currency_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors"
                onClick={() => handleEdit(selectedInvoice)}
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition-colors"
                onClick={() => handleDelete(selectedInvoice.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
              <button
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-600 transition-colors"
                onClick={() => handleMoveToFinal(selectedInvoice)}
              >
                <Check size={16} /> Move to Final
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-400 transition-colors"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProformaInvoice;