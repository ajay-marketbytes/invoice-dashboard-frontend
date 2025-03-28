import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AngleDown } from './../Icons';
import logo from "../../assets/images/MB.jpg";

const Sidebar = () => {
  const [dropdowns, setDropdowns] = useState({
    invoice: false,
    tax: false,
    productsAndServices: false,
    clients: false,
    address: false,
    bankAccount: false,
  });

  const location = useLocation();

  const sections = {
    invoice: [
      { name: "Create Invoice", path: "/invoice/create" },
      { name: "Proforma Invoice", path: "/invoice/proforma" },
      // { name: "Final Invoices", path: "/invoice/final" },
      // { name: "Invoice Note", path: "/invoice/invoice-note" },
    ],
    tax: [
      { name: "Add Tax", path: "/tax/add" },
      { name: "View Tax", path: "/tax/view" },
    ],
    productsAndServices: [
      { name: "Add Products", path: "/products/add" },
      { name: "View Products", path: "/products/view" },
      { name: "Add Service", path: "/services/add" },
      { name: "View Service", path: "/services/view" },
    ],
    clients: [
      { name: "Add Clients", path: "/clients/add" },
      { name: "View Clients", path: "/clients/view" },
    ],
    address: [
      { name: "Add Address", path: "/address/add" },
      { name: "View Address", path: "/address/view" },
    ],
    bankAccount: [
      { name: "Add Bank Account", path: "/bank-account/add" },
      { name: "View Bank Account", path: "/bank-account/view" },
    ],
  };

  const handleNavigation = (path) => {
    localStorage.setItem("currentPath", path);
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <div className="w-72 bg-gray-100 fixed h-screen z-50 p-4 shadow-xl">
      <div className="flex flex-col items-center justify-center py-4">
        <img src={logo} className="w-20 h-20 bg-contain object-cover rounded-full" alt="Invoice Dashboard" />
      </div>
      <div className="my-2 mx-4 pt-4">
        <p className="text-black text-xs font-extrabold uppercase">Menu</p>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block mb-2 px-4 py-2 text-sm font-medium rounded-sm ${isActive ? "bg-gray-400 text-black" : "text-black hover:bg-gray-400"
            } transition-colors duration-300`
          }
          onClick={() => handleNavigation("/")}
        >
          Dashboard
        </NavLink>
        {Object.keys(sections).map((key) => (
          <div key={key}>
            <button
              onClick={() => toggleDropdown(key)}
              className={`flex items-center justify-between gap-2 w-full px-4 py-2 text-sm font-medium rounded-sm ${sections[key].some((section) => location.pathname.startsWith(section.path))
                  ? "bg-gray-400 text-black"
                  : "text-black hover:bg-gray-400"
                } transition-colors duration-300`}
            >
              <div className="flex items-center gap-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </div>
              <AngleDown />
            </button>
            <motion.div
              animate={dropdowns[key] ? "open" : "closed"}
              variants={{
                open: { height: "auto", opacity: 1, scaleY: 1 },
                closed: { height: 0, opacity: 0, scaleY: 0 },
              }}
              transition={{ duration: 0.3 }}
              className="ml-6 mt-2 overflow-hidden"
            >
              {sections[key].map((section) => (
                <NavLink
                  key={section.name}
                  to={section.path}
                  onClick={() => handleNavigation(section.path)}
                  className={({ isActive }) =>
                    `block mb-2 px-4 py-2 rounded-sm text-sm font-medium ${isActive
                      ? "bg-gray-400 text-black"
                      : "text-black hover:bg-gray-400 transition-colors duration-300"
                    }`
                  }
                >
                  {section.name}
                </NavLink>
              ))}
            </motion.div>
          </div>
        ))}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `block mb-2 px-4 py-2 text-sm font-medium rounded-sm ${isActive ? "bg-gray-400 text-black" : "text-black hover:bg-gray-400"
            } transition-colors duration-300`
          }
          onClick={() => handleNavigation("/profile")}
        >
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
