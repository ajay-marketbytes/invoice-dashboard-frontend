import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import FormField from "../../components/FormField";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      taxable: "no",
      currencyType: "USD",
      paymentTerms: "Net 30",
      discount: 0,
      shipping: 0,
      amountPaid: 0,
    },
  });

  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [taxable, setTaxable] = useState("no");
  const [invoiceType, setInvoiceType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, branchesResponse, bankAccountsResponse, taxesResponse, productsResponse, servicesResponse] = await Promise.all([
          apiClient.get("clients/clients/"),
          apiClient.get("branch/branch_addresses/"),
          apiClient.get("bank/bank-accounts/"),
          apiClient.get("invoices/taxes/"),
          apiClient.get("products/products/"),
          apiClient.get("services/services/"),
        ]);
        setClients(clientsResponse.data);
        setBranches(branchesResponse.data);
        setBankAccounts(bankAccountsResponse.data);
        setTaxes(taxesResponse.data);
        setProducts(productsResponse.data);
        setServices(servicesResponse.data);
        console.log("Data loaded successfully");
      } catch (error) {
        console.error("Error initializing data", error);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemName: "", quantity: 1, unitCost: 0, itemGst: "0%", total: 0 },
    ]);
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field] = value;

    if (field === "itemName") {
      const selectedItem = (invoiceType === "product" ? products : services).find(
        (i) => i.name === value
      );
      if (invoiceType === "product") {
        updatedItems[index].unitCost = selectedItem?.unit_cost || selectedItem?.price || 0;
      } else {
        updatedItems[index].unitCost = updatedItems[index].unitCost || 0;
      }
    }

    const taxRate = parseFloat(updatedItems[index].itemGst) / 100;
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].unitCost * (1 + taxRate);
    setInvoiceItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    );
    const totalTax = invoiceItems.reduce((sum, item) => {
      const taxRate = parseFloat(item.itemGst) / 100;
      return sum + item.quantity * item.unitCost * taxRate;
    }, 0);
    const shipping = parseFloat(watch("shipping")) || 0;
    const discount = parseFloat(watch("discount")) || 0;
    const amountPaid = parseFloat(watch("amountPaid")) || 0;
    const totalDue = subtotal + totalTax + shipping - discount - amountPaid;

    setValue("subtotal", subtotal.toFixed(2));
    setValue("totalTax", totalTax.toFixed(2));
    setValue("totalDue", totalDue.toFixed(2));

    return { subtotal, totalTax, shipping, discount, amountPaid, totalDue };
  };

  useEffect(() => {
    calculateTotals();
  }, [invoiceItems, watch("shipping"), watch("discount"), watch("amountPaid")]);

  const onSubmit = async (data) => {
    try {
      const invoiceData = {
        ...data,
        items: invoiceItems,
        subtotal: parseFloat(data.subtotal),
        totalTax: parseFloat(data.totalTax),
        shipping: parseFloat(data.shipping),
        discount: parseFloat(data.discount),
        amountPaid: parseFloat(data.amountPaid),
        totalDue: parseFloat(data.totalDue),
        createdAt: new Date().toISOString(),
      };

      await apiClient.post("/add_createinvoice/", invoiceData);
      alert("Invoice created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  const selectedCurrency = watch("currencyType");
  const totalDue = parseFloat(watch("totalDue") || 0);
  const roundedTotalDue = Math.round(totalDue);
  const roundingDifference = (roundedTotalDue - totalDue).toFixed(2);
  const roundingDisplay = roundingDifference >= 0 ? `+${roundingDifference}` : roundingDifference;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full">
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">
          Create New Invoice
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-4">
            <FormField
              label="Invoice Number"
              name="invoiceNumber"
              register={register}
              error={errors.invoiceNumber}
              required
            />
            <FormField
              label="Invoice Type"
              name="invoiceType"
              register={register}
              type="select"
              options={[
                { value: "", label: "Select Type" },
                { value: "product", label: "Product" },
                { value: "service", label: "Service" },
              ]}
              onChange={(e) => setInvoiceType(e.target.value)}
              required
            />
            <FormField
              label="Taxable"
              name="taxable"
              register={register}
              type="radio"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              onChange={(e) => setTaxable(e.target.value)}
              required
            />
            {taxable === "yes" && (
              <FormField
                label="Tax Rate"
                name="taxRate"
                register={register}
                type="select"
                options={taxes.map((tax) => ({
                  value: tax.percentage,
                  label: `${tax.percentage}%`,
                }))}
              />
            )}
            <FormField
              label="Branch"
              name="branchAddress"
              type="select"
              options={branches.map((b) => ({
                value: b.id,
                label: `${b.branch_address} - ${b.city}`,
              }))}
              register={register}
              required
            />
            <FormField
              label="Client"
              name="clientName"
              type="select"
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.client_name}, ${c.country}, ${c.state}, ${c.city}, ${c.address}, ${c.phone}, ${c.tax_type}, ${c.gst}, ${c.vat}, ${c.website}, ${c.invoice_series}, ${c.status} `,
              }))}
              register={register}
              required
            />
            <div className="flex items-center justify-between gap-4">
              <FormField
                label="Invoice Date"
                placeholder="Invoice Date"
                type="date"
                name="invoiceDate"
                register={register}
                error={errors.invoiceDate}
                required
              />
              <FormField
                label="Due Date"
                placeholder="Due Date"
                type="date"
                name="dueDate"
                register={register}
                error={errors.dueDate}
                required
              />
            </div>
            <FormField
              label="Bank Account"
              name="bankAccount"
              type="select"
              options={bankAccounts.map((a) => ({
                value: a.id,
                label: `${a.bank_name} (${a.account_number})`,
              }))}
              register={register}
              required
            />
            <FormField
              label="Currency Type"
              name="currencyType"
              type="select"
              options={["USD", "EUR", "GBP", "INR"].map((c) => ({ value: c, label: c }))}
              register={register}
            />
          </div>

          <div className="space-y-4">
            <FormField
              label="Payment Terms"
              name="paymentTerms"
              type="select"
              options={["Credit", "Debit", "UPI", "Net Banking"].map((t) => ({ value: t, label: t }))}
              register={register}
            />

            {invoiceType && (
              <div>
                <h3 className="font-bold text-sm mb-2 text-gray-700">Invoice Items</h3>
                <div className="rounded-lg">
                  {/* Header Row */}
                  <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-gray-700 text-sm">
                    <div className="col-span-3">Item Name</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Cost</div>
                    <div className="col-span-2">Item GST</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Invoice Items */}
                  {invoiceItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 mb-4 items-center"
                    >
                      <select
                        className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 col-span-3"
                        value={item.itemName}
                        onChange={(e) => updateItem(index, "itemName", e.target.value)}
                      >
                        <option value="">Select Item</option>
                        {(invoiceType === "product" ? products : services).map((prod) => (
                          <option key={prod.id} value={prod.name}>
                            {prod.name} ({invoiceType === "product" ? prod.unit_cost || prod.price : prod.rate} {selectedCurrency})
                          </option>
                        ))}
                      </select>

                      <input
                        className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 col-span-2"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value) || 1)
                        }
                      />

                      <input
                        className={`w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 col-span-2 ${
                          invoiceType === "product" && item.itemName ? "bg-gray-200 cursor-not-allowed" : ""
                        }`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) =>
                          invoiceType === "service" && 
                          updateItem(index, "unitCost", parseFloat(e.target.value) || 0)
                        }
                        readOnly={invoiceType === "product" && item.itemName !== ""}
                      />

                      {/* Item GST as Input Field */}
                      <input
                        className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 col-span-2"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.itemGst}
                        onChange={(e) => updateItem(index, "itemGst", e.target.value)}
                        placeholder="Item GST %"
                      />

                      <input
                        className="w-full p-2 border rounded bg-gray-100 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 col-span-2"
                        type="number"
                        value={item.total.toFixed(2)}
                        readOnly
                      />

                      <button
                        type="button"
                        className="text-red-500 col-span-1 hover:text-red-700"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    onClick={addItem}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-700">Subtotal:</span>
                <span className="text-sm text-gray-800">
                  {watch("subtotal") || "0.00"} {selectedCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-700">Total GST:</span>
                <span className="text-sm text-gray-800">
                  {watch("totalTax") || "0.00"} {selectedCurrency}
                </span>
              </div>
              <FormField
                label="Shipping"
                name="shipping"
                type="number"
                register={register}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <FormField
                label="Discount"
                name="discount"
                type="number"
                register={register}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <FormField
                label="Amount Paid"
                name="amountPaid"
                type="number"
                register={register}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-bold text-gray-700">Total Due:</span>
                <span className="text-sm font-bold text-gray-800">
                  {watch("totalDue") || "0.00"} {selectedCurrency} (Rounded:{" "}
                  {roundedTotalDue} {selectedCurrency} {roundingDisplay})
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-black text-white px-6 py-3 rounded w-full col-span-2 hover:bg-gray-900 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </button>
        </form>
        <div className="mt-4 flex justify-start space-x-4">
          <button
            type="button"
            onClick={() => navigate("/address/add")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Add Branch
          </button>
          <button
            type="button"
            onClick={() => navigate("/clients/add")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Add Client
          </button>
          <button
            type="button"
            onClick={() => navigate("/bank-account/add")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Add Bank Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;