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
            path: `/invoice/view/${item.id}`,
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

  const getActiveLocationName = () => {
    const path = location.pathname;
    if (path === "/") return { name: "Dashboard", nested: null };
    if (path.startsWith("/invoice")) return { name: "Invoice", nested: "Create Invoice" };
    if (path.startsWith("/tax")) return { name: "Tax", nested: null };
    if (path.startsWith("/products") || path.startsWith("/services"))
      return { name: "Products & Services", nested: null };
    if (path.startsWith("/clients")) return { name: "Clients", nested: null };
    if (path.startsWith("/address")) return { name: "Address", nested: null };
    if (path.startsWith("/bank-account")) return { name: "Bank Account", nested: null };
    if (path.startsWith("/profile")) return { name: "Profile", nested: null };
    return { name: "Unknown", nested: null };
  };

  const activeLocation = getActiveLocationName();

  return (
    <div className="bg-gray-100 shadow flex items-center justify-between px-4 h-20 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-10 flex justify-between items-center">
        <div className="relative left-64 flex items-center space-x-2">
          <div className="ml-6 flex items-center space-x-1 text-xs text-gray-600 font-extrabold">
            <span>{activeLocation.name}</span>
            {activeLocation.nested && (
              <>
                <span className="font-extrabold">:</span>
                <span className="font-medium">{activeLocation.nested}</span>
              </>
            )}
          </div>
          <div className="flex items-center relative" aria-label="Search Bar">
            <div className="relative left-8 text-md text-indigo-500">
              <Search />
            </div>
            <input
              type="search"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => debouncedSearchTerm && setIsSearchDropdownOpen(true)}
              className="py-2 pl-10 pr-2 rounded-md focus:outline-none w-full text-xs bg-transparent"
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

        <div className="flex items-center space-x-4 relative">
          <div className="grid text-right">
            <span className="text-sm font-normal">Invoice Dashboard</span>
            <span className="text-xs font-light text-indigo-500">Admin</span>
          </div>
          <img
            src={profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full ml-4"
          />
          <div
            className="text-indigo-500 hover:text-indigo-500 cursor-pointer relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            aria-label="Dropdown Icon"
          >
            <UserCog />
            {isDropdownOpen && (
              <div className="absolute right-0 top-4 bg-white shadow-lg rounded-sm overflow-hidden z-50 w-[150px] h-[70px]">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;