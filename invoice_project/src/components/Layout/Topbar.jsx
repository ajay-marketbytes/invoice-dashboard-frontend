import React, { useState, useEffect } from "react";
import { UserCog, Search } from "./../Icons";
import profilePicture from "../../assets/images/profile-icon.jpg";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import apiClient from "../../api/apiClient";

const Topbar = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        setIsSearchDropdownOpen(false);
        return;
      }
      setIsLoading(true);
      setIsSearchDropdownOpen(true);
      try {
        const [
          invoicesResponse,
          productsResponse,
          servicesResponse,
          clientsResponse,
          bankAccountsResponse,
          addressesResponse,
          taxesResponse,
        ] = await Promise.all([
          apiClient.get("invoices/invoices/"),
          apiClient.get("products/products/"),
          apiClient.get("services/services/"),
          apiClient.get("clients/clients/"),
          apiClient.get("bank/bank-accounts/"),
          apiClient.get("branch/branch_addresses/"),
          apiClient.get("invoices/taxes/"),
        ]);
        const results = [
          ...invoicesResponse.data.map((item) => ({
            type: "Invoice",
            id: item.id,
            name: item.invoice_number || `Invoice ${item.id}`,
            path: `/invoice/proforma`, 
          })),
          ...productsResponse.data.map((item) => ({
            type: "Product",
            id: item.id,
            name: item.name,
            path: "/products/view",
          })),
          ...servicesResponse.data.map((item) => ({
            type: "Service",
            id: item.id,
            name: item.name,
            path: "/services/view",
          })),
          ...clientsResponse.data.map((item) => ({
            type: "Client",
            id: item.id,
            name: item.client_name,
            path: "/clients/view",
          })),
          ...bankAccountsResponse.data.map((item) => ({
            type: "Bank Account",
            id: item.id,
            name: item.bank_name,
            path: "/bank-account/view",
          })),
          ...addressesResponse.data.map((item) => ({
            type: "Address",
            id: item.id,
            name: item.branch_address,
            path: "/address/view",
          })),
          ...taxesResponse.data.map((item) => ({
            type: "Tax",
            id: item.id,
            name: item.name,
            path: "/tax/view",
          })),
        ].filter((item) =>
          item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );

        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  const handleResultClick = (path) => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearchDropdownOpen(false);
    navigate(path);
  };

  const getActiveLocationName = () => {
    const path = location.pathname;
    if (path === "/") return { name: "Dashboard", nested: null };
    if (path === "/invoice/create") return { name: "Invoices", nested: "Create Invoice" };
    if (path === "/invoice/proforma") return { name: "Invoices", nested: "Proforma Invoice" };
    if (path === "/invoice/edit") return { name: "Invoices", nested: "Edit Invoice" };
    if (path === "/invoice/invoice-note") return { name: "Invoices", nested: "Invoice Note" };
    if (path === "/tax/add") return { name: "Tax", nested: "Add Tax" };
    if (path === "/tax/view") return { name: "Tax", nested: "View Tax" };
    if (path === "/products/add") return { name: "Products & Services", nested: "Add Products" };
    if (path === "/products/view") return { name: "Products & Services", nested: "View Products" };
    if (path === "/services/add") return { name: "Products & Services", nested: "Add Service" };
    if (path === "/services/view") return { name: "Products & Services", nested: "View Service" };
    if (path === "/clients/add") return { name: "Clients", nested: "Add Clients" };
    if (path === "/clients/view") return { name: "Clients", nested: "View Clients" };
    if (path === "/address/add") return { name: "Address", nested: "Add Address" };
    if (path === "/address/view") return { name: "Address", nested: "View Address" };
    if (path === "/bank-account/add") return { name: "Bank Account", nested: "Add Bank Account" };
    if (path === "/bank-account/view") return { name: "Bank Account", nested: "View Bank Account" };
    if (path === "/profile") return { name: "Profile", nested: null };
    return { name: "Location?", nested: null };
  };

  const activeLocation = getActiveLocationName();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.error("No refresh token found");
      navigate("/login");
      return;
    }

    try {
      const response = await apiClient.post("logout/", {
        refresh: refreshToken,
      });
      console.log("Logout successful", response);
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error
      );
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      onLogout();
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-100 shadow flex items-center justify-between px-4 h-20 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="relative left-72 flex items-center space-x-4">
          <div className="text-xs font-extrabold text-gray-600">
            <span>{activeLocation.name}</span>
            {activeLocation.nested && (
              <span className="ml-1 font-medium">: {activeLocation.nested}</span>
            )}
          </div>
          <div className="relative hidden md:flex items-center w-64">
            <Search className="absolute left-3 text-gray-500" />
            <input
              type="search"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => debouncedSearchTerm && setIsSearchDropdownOpen(true)}
              className="py-2 pl-2 pr-2 rounded-md focus:outline-none w-full text-xs bg-transparent"
              disabled={isLoading}
              aria-label="Search Input"
            />
            {isLoading && (
              <span className="ml-4 text-xs font-medium text-indigo-500">
                Searching...
              </span>
            )}
            {isSearchDropdownOpen && (
              <div
                className="absolute top-12 left-0 bg-white shadow-lg rounded-md w-[300px] max-h-[400px] overflow-y-auto z-50"
                onMouseLeave={() => setIsSearchDropdownOpen(false)}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(result.path)}
                    >
                      <span className="font-bold">{result.type}:</span> {result.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <span className="text-xs font-extrabold text-gray-600">Invoice Dashboard</span>
            <span className="text-xs font-light text-indigo-500 block">Admin</span>
          </div>
          <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-indigo-500 hover:text-indigo-500">
              <UserCog />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 bg-white shadow-lg rounded-md w-36">
                <Link to="/profile" className="block  px-4 py-2 text-sm hover:bg-gray-200">Profile</Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm hover:bg-gray-200 w-full text-left">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
