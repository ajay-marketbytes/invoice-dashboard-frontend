import React from "react";
import { useLocation } from "react-router-dom";

const FinalInvoice = () => {
  const location = useLocation();
  const invoice = location.state?.invoice || null;

  if (!invoice) {
    return <p className="text-center text-red-600">No invoice data provided.</p>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Final Invoice #{invoice.invoice_number}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="space-y-2">
          <p><strong>Client ID:</strong> {invoice.client}</p>
          <p><strong>Branch Address ID:</strong> {invoice.branch_address}</p>
          <p><strong>Bank Account ID:</strong> {invoice.bank_account}</p>
          <p><strong>Invoice Date:</strong> {invoice.invoice_date}</p>
          <p><strong>Due Date:</strong> {invoice.due_date}</p>
          <p><strong>Currency:</strong> {invoice.currency_type}</p>
          <p><strong>Payment Terms:</strong> {invoice.payment_terms}</p>
          <p><strong>Tax Option:</strong> {invoice.tax_option}</p>
          <p><strong>Tax Rate:</strong> {invoice.tax_rate ? `${invoice.tax_rate}%` : "N/A"}</p>
          <p><strong>Subtotal:</strong> {invoice.subtotal} {invoice.currency_type}</p>
          <p><strong>GST:</strong> {invoice.gst} {invoice.currency_type}</p>
          <p><strong>Discount:</strong> {invoice.discount} {invoice.currency_type}</p>
          <p><strong>Shipping:</strong> {invoice.shipping} {invoice.currency_type}</p>
          <p><strong>Amount Paid:</strong> {invoice.amount_paid} {invoice.currency_type}</p>
          <p><strong>Total Due:</strong> {invoice.total_due} {invoice.currency_type}</p>
        </div>

        {invoice.items.length > 0 && (
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
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 text-sm">{item.name}</td>
                    <td className="p-2 text-sm">{item.quantity}</td>
                    <td className="p-2 text-sm">{item.unit_cost} {invoice.currency_type}</td>
                    <td className="p-2 text-sm">{item.total} {invoice.currency_type}</td>
                    <td className="p-2 text-sm">{item.total_gst} {invoice.currency_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalInvoice;