import React, { useState, useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/Invoice/CreateInvoice";
import EditInvoice from "./pages/Invoice/EditInvoice"; // Add this import
import ProformaInvoice from "./pages/Invoice/ProformaInvoice";
import FinalInvoice from "./pages/Invoice/FinalInvoice";
import InvoiceNote from "./pages/Invoice/InvoiceNote";
import AddTax from "./pages/Tax/AddTax";
import ViewTax from "./pages/Tax/ViewTax";
import AddProduct from "./pages/ProductServices/AddProduct";
import ViewProduct from "./pages/ProductServices/ViewProduct";
import AddService from "./pages/ProductServices/AddService";
import ViewService from "./pages/ProductServices/ViewService";
import AddClient from "./pages/Client/AddClient";
import ViewClient from "./pages/Client/ViewClient";
import AddAddress from "./pages/Address/AddAddress";
import ViewAddress from "./pages/Address/ViewAddress";
import AddBankAccount from "./pages/BankAccount/AddBankAccount";
import ViewBankAccount from "./pages/BankAccount/ViewBankAccount";
import Profile from "./pages/Profile";
import AdditionalSettings from "./pages/AdditionalSettings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const savedPath = localStorage.getItem("currentPath");

    setIsLoggedIn(!!accessToken);
    if (savedPath) {
      setCurrentPath(savedPath);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("accessToken", "your_token");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to={currentPath} replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={<ProtectedRoute element={<Layout onLogout={handleLogout} />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="/invoice/create" element={<CreateInvoice />} />
          <Route path="/invoice/edit" element={<EditInvoice />} />
          <Route path="/invoice/proforma" element={<ProformaInvoice />} />
          <Route path="/invoice/final" element={<FinalInvoice />} />
          <Route path="/invoice/invoice-note" element={<InvoiceNote />} />
          <Route path="/tax/add" element={<AddTax />} />
          <Route path="/tax/view" element={<ViewTax />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/view" element={<ViewProduct />} />
          <Route path="/services/add" element={<AddService />} />
          <Route path="/services/view" element={<ViewService />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/view" element={<ViewClient />} />
          <Route path="/address/add" element={<AddAddress />} />
          <Route path="/address/view" element={<ViewAddress />} />
          <Route path="/bank-account/add" element={<AddBankAccount />} />
          <Route path="/bank-account/view" element={<ViewBankAccount />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/additional-settings" element={<AdditionalSettings />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;