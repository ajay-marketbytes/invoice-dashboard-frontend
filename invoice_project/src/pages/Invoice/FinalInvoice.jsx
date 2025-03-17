import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient"; // Ensure this path is correct
import logo from "../../assets/images/logo.png";
 
const FinalInvoice = () => {
  const location = useLocation();
  const proformaInvoice = location.state?.invoice;
 
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
 
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
      }
    };
 
    fetchData();
  }, []);
 
  if (!proformaInvoice) {
    return <div>No invoice data available.</div>;
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
    gst_rate,
    subtotal,
    totalTax,
    shipping,
    discount,
    amount_paid,
  } = proformaInvoice;
 
  const clientDetails = clients.find(c => c.id === client);
  const branchDetails = branches.find(b => b.id === branch_address);
  const bankDetails = bankAccounts.find(ba => ba.id === bank_account);
 
  return (
    <div className="max-w-4xl mx-auto p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="w-1/4">
          <img src={logo} alt="Logo" className="max-w-full" />
        </div>
        <div className="w-3/4">
          <div className="flex justify-between mb-4">
            <div className="w-1/2">
              <h4 className="font-bold">Invoice to:</h4>
              <p className="font-semibold">{clientDetails?.client_name}</p>
              <p>{clientDetails?.address}</p>
              <p><b>GSTIN:</b> {clientDetails?.gst}</p>
              <p><b>P:</b> {clientDetails?.phone}</p>
              <p><b>W:</b> {clientDetails?.website}</p>
            </div>
            <div className="w-1/2">
              <h4 className="font-bold">Invoice from:</h4>
              <p className="font-semibold">{branchDetails?.branch_name}</p>
              <p>{branchDetails?.branch_address}</p>
              <p><b>GSTIN:</b> {branchDetails?.gstin}</p>
              <p><b>P:</b> {branchDetails?.phone}</p>
              <p><b>W:</b> {branchDetails?.website}</p>
            </div>
          </div>
        </div>
      </div>
 
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">INVOICE</h1>
      </div>
 
      <div className="flex justify-between mb-4">
        <div className="w-2/3">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white font-bold">
                <th className="p-2">ITEM DESCRIPTION</th>
                <th className="p-2">QUANTITY</th>
                <th className="p-2">PRICE</th>
                <th className="p-2">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-2 bg-gray-100">{item.name}</td>
                  <td className="p-2 bg-gray-100">{item.quantity}</td>
                  <td className="p-2 bg-gray-100">{item.unit_cost}</td>
                  <td className="p-2 bg-gray-100">{item.total}</td>
                </tr>
              ))}
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Subtotal</td>
                <td colSpan="2" className="p-2 text-right">{subtotal} {currency_type}</td>
              </tr>
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Shipping</td>
                <td colSpan="2" className="p-2 text-right">{shipping} {currency_type}</td>
              </tr>
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Discount</td>
                <td colSpan="2" className="p-2 text-right">-{discount} {currency_type}</td>
              </tr>
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Amount Paid</td>
                <td colSpan="2" className="p-2 text-right">-{amount_paid} {currency_type}</td>
              </tr>
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Grand Total</td>
                <td colSpan="2" className="p-2 text-right">{total_due} {currency_type}</td>
              </tr>
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan="2" className="p-2 text-right">Total in Words</td>
                <td colSpan="2" className="p-2 text-right">{/* Add total in words logic */}</td>
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
            <p><b>Account Name:</b> {bankDetails?.account_name}</p>
            <p><b>Bank Name:</b> {bankDetails?.bank_name}</p>
            <p><b>Account Number:</b> {bankDetails?.account_number}</p>
            <p><b>IFSC Code:</b> {bankDetails?.ifsc_code}</p>
            <p><b>SWIFT Code:</b> {bankDetails?.swift_code}</p>
            <p><b>MICR Code:</b> {bankDetails?.micr_code}</p>
            <h4 className="font-bold">Payment Terms</h4>
            <p>{payment_terms}</p>
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
          Please make the payment of {total_due} {currency_type} to the bank account details provided above. Upon receiving the payment, we will proceed with the services/products as agreed and provide a receipt for the payment received. Thank you for choosing {branchDetails?.branch_name}. If you have any questions or require further assistance, please don't hesitate to contact us at {branchDetails?.phone} or {branchDetails?.email}.
        </p>
      </div>
 
      <div className="text-center mb-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.print()}>Print</button>
      </div>
 
      <footer className="text-center text-sm">
        <p>{branchDetails?.branch_name}</p>
      </footer>
    </div>
  );
};
 
export default FinalInvoice;