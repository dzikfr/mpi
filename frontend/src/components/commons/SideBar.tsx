import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? "bg-white text-black font-semibold" : ""
    }`;

  return (
    <aside className="w-64 bg-base-200 shadow h-full fixed top-0 left-0 z-10 pt-16">
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/product" className={navLinkClass}>
          Product
        </NavLink>
        <NavLink to="/company" className={navLinkClass}>
          Company
        </NavLink>
        <NavLink to="/customer" className={navLinkClass}>
          Customers
        </NavLink>
        <NavLink to="/invoice" className={navLinkClass}>
          Invoice
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
