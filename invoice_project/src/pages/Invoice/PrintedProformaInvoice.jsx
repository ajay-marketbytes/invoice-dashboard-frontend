import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import logo from "../../assets/images/logo.png";
import stamp from "../../assets/images/stamp.png";
import jsPDF from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas

const numberToWords = (num) => {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  ];
  const teens = [
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  const convertMillions = (num) => {
    if (num < 100) return convertBelowHundred(num);
    else if (num < 1000) return convertBelowThousand(num);
    else if (num < 1000000) return convertBelowMillion(num);
    else {
      const millions = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      return `${convertBelowHundred(millions)} Million ${convertMillions(remainder)}`.trim();
    }
  };

  const convertBelowMillion = (num) => {
    if (num < 1000) return convertBelowThousand(num);
    else {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return `${convertBelowHundred(thousands)} Thousand ${convertBelowThousand(remainder)}`.trim();
    }
  };

  const convertBelowThousand = (num) => {
    if (num < 100) return convertBelowHundred(num);
    else {
      const hundreds = Math.floor(num / 100);
      const remainder = num % 100;
      return `${ones[hundreds]} Hundred ${convertBelowHundred(remainder)}`.trim();
    }
  };

  const convertBelowHundred = (num) => {
    if (num < 10) return ones[num];
    else if (num < 20) return teens[num - 10];
    else {
      const tensPlace = Math.floor(num / 10);
      const onesPlace = num % 10;
      return `${tens[tensPlace]} ${ones[onesPlace]}`.trim();
    }
  };

  return convertMillions(num);
};

const PrintedProformaInvoice = () => {
  const location = useLocation();
  const proformaInvoice = location.state?.invoice;
  const contentRef = useRef(); 
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, branchesResponse, bankAccountsResponse] = await Promise.all([
          apiClient.get("clients/clients/"),
          apiClient.get("branch/branch_addresses/"),
          apiClient.get("bank/bank-accounts/"),
        ]);
        setClients(clientsResponse.data);
        setBranches(branchesResponse.data);
        setBankAccounts(bankAccountsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePDF = () => {
    const input = contentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => { // Increase scale for better quality
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Proforma_Invoice_${proformaInvoice.invoice_number}.pdf`);
    });
  };

  if (!proformaInvoice) {
    return <div>No invoice data available.</div>;
  }

  if (loading) {
    return <div>Loading invoice data...</div>;
  }

  const {
    invoice_number,
    invoice_date,
    due_date,
    client,
    branch_address,
    bank_account,
    items,
    total_due,
    currency_type,
    payment_terms,
    subtotal,
    gst,
    shipping,
    discount,
    amount_paid,
  } = proformaInvoice;

  const clientDetails = clients.find((c) => c.id === client);
  const branchDetails = branches.find((b) => b.id === branch_address);
  const bankDetails = bankAccounts.find((ba) => ba.id === bank_account);

  const totalInWords = numberToWords(Math.round(total_due));

  return (
    <div className="flex flex-col items-center">
      <div
        ref={contentRef}
        className="w-[21cm] h-[29.7cm] p-5 box-border font-sans bg-white"
        style={{ width: "21cm", height: "29.7cm" }}
      >
        <div className="flex justify-between mb-5">
          <div className="w-1/4">
            <img src={logo} alt="Logo" className="w-24 h-24" />
          </div>
          <div className="w-3/4 flex justify-between">
            <div className="w-1/2">
              <h4 className="font-bold">Invoice to:</h4>
              <p>{clientDetails?.client_name || "Unknown Client"}</p>
              <p>{clientDetails?.address || "N/A"}</p>
              <p><b>GSTIN:</b> {clientDetails?.gst || "N/A"}</p>
              <p><b>P:</b> {clientDetails?.phone || "N/A"}</p>
              <p><b>W:</b> {clientDetails?.website || "N/A"}</p>
            </div>
            <div className="w-1/2">
              <h4 className="font-bold">Invoice from:</h4>
              <p>{branchDetails?.branch_name || "Unknown Branch"}</p>
              <p>{branchDetails?.branch_address || "N/A"}</p>
              <p><b>GSTIN:</b> {branchDetails?.gstin || "N/A"}</p>
              <p><b>P:</b> {branchDetails?.phone || "N/A"}</p>
              <p><b>W:</b> {branchDetails?.website || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">PROFORMA INVOICE</h1>
        </div>

        <div className="flex justify-between mb-5">
          <div className="w-2/3">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-black text-white font-bold">
                  <th className="p-2">ITEM DESCRIPTION</th>
                  <th className="p-2">QUANTITY</th>
                  <th className="p-2">GST</th>
                  <th className="p-2">PRICE</th>
                  <th className="p-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="p-2 bg-gray-100">{item.name || "N/A"}</td>
                    <td className="p-2 bg-gray-100">{item.quantity}</td>
                    <td className="p-2 bg-gray-100">{item.total_gst || "0.00"}</td>
                    <td className="p-2 bg-gray-100">{item.unit_cost}</td>
                    <td className="p-2 bg-gray-100">{item.total}</td>
                  </tr>
                ))}
                <tr className="border-b border-gray-300">
                  <td colSpan="2" className="text-right font-bold p-2 bg-gray-200">Subtotal</td>
                  <td colSpan="3" className="text-right font-bold p-2 bg-gray-200">{subtotal} {currency_type}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td colSpan="2" className="text-right font-bold p-2 bg-gray-200">GST</td>
                  <td colSpan="3" className="text-right font-bold p-2 bg-gray-200">{gst} {currency_type}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td colSpan="2" className="text-right font-bold p-2 bg-gray-200">Shipping</td>
                  <td colSpan="3" className="text-right font-bold p-2 bg-gray-200">{shipping} {currency_type}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td colSpan="2" className="text-right font-bold p-2 bg-gray-200">Discount</td>
                  <td colSpan="3" className="text-right font-bold p-2 bg-gray-200">-{discount} {currency_type}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td colSpan="2" className="text-right font-bold p-2 bg-gray-200">Amount Paid</td>
                  <td colSpan="3" className="text-right font-bold p-2 bg-gray-200">-{amount_paid} {currency_type}</td>
                </tr>
                <tr className="bg-black text-white font-bold">
                  <td colSpan="2" className="text-right p-2">Grand Total</td>
                  <td colSpan="3" className="text-right p-2">{total_due} {currency_type}</td>
                </tr>
                <tr className="bg-black text-white font-bold">
                  <td colSpan="2" className="text-right p-2">Total in Words</td>
                  <td colSpan="3" className="text-right p-2">{totalInWords} {currency_type}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-1/3 text-right ml-4">
            <div className="mb-4">
              <p><b>Invoice No:</b> {invoice_number}</p>
              <p><b>Invoice Date:</b> {invoice_date}</p>
              <p><b>Due Date:</b> {due_date}</p>
            </div>
            <div>
              <h4 className="font-bold">Payment Information</h4>
              <p><b>Bank Name:</b> {bankDetails?.bank_name || "N/A"}</p>
              <p><b>Account Number:</b> {bankDetails?.account_number || "N/A"}</p>
              <p><b>IFSC Code:</b> {bankDetails?.ifsc_code || "N/A"}</p>
              <p><b>SWIFT Code:</b> {bankDetails?.swift_code || "N/A"}</p>
              <p><b>MICR Code:</b> {bankDetails?.micr_code || "N/A"}</p>
              <h4 className="font-bold">Payment Terms</h4>
              <p>{payment_terms || "N/A"}</p>
              <h4 className="font-bold">Currency</h4>
              <p>{currency_type}</p>
              <h4 className="font-bold">Total Due</h4>
              <p>{total_due} {currency_type}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-bold">Note:</h4>
          <p>
            Please make the payment of {total_due} {currency_type} to the bank account details provided above. Upon receiving the payment, we will proceed with the services/products as agreed and provide a receipt for the payment received. Thank you for choosing {branchDetails?.branch_address || "our company"}. If you have any questions or require further assistance, please don’t hesitate to contact us at {branchDetails?.phone || "N/A"} or {branchDetails?.email || "N/A"}.
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <img src={stamp} alt="Stamp" className="w-24 h-24" />
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          className="bg-black text-white hover:bg-white hover:text-black border text-sm font-bold px-3 py-3 rounded w-full transition-colors duration-300"
          onClick={generatePDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PrintedProformaInvoice;