import React from "react";
import { FileText, Eye, Trash2 } from "lucide-react";

const invoices = [
  { id: 106, date: "19/02/2025", type: "Domestic" },
  { id: 105, date: "20/02/2025", type: "International" },
  { id: 104, date: "20/02/2025", type: "International" },
  { id: 103, date: "20/02/2025", type: "International" },
  { id: 102, date: "20/02/2025", type: "International" },
  { id: 101, date: "21/02/2025", type: "Domestic" },
];

const ProformaInvoice = () => {
  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Proforma Invoices
      </h1>
      <div className="p-6">
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
                    Invoice {invoice.id}
                  </h5>
                  <p className="text-sm text-gray-500">NAME</p> 
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {invoice.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      invoice.type === "Domestic"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {invoice.type}
                  </span>
                </p>
              </div>
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-800 transition-colors"
                  onClick={() => console.log(`View invoice ${invoice.id}`)} 
                >
                  <Eye size={16} /> View
                </button>
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition-colors"
                  onClick={() => console.log(`Delete invoice ${invoice.id}`)} 
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoice;