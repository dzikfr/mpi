import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Sidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? "bg-white text-black font-semibold" : ""
    }`;

  return (
    <aside className="w-64 bg-base-200 shadow h-full fixed top-0 left-0 z-10 pt-16 flex flex-col justify-between">
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/event" className={navLinkClass}>
          Event
        </NavLink>
        <NavLink to="/asset" className={navLinkClass}>
          Asset
        </NavLink>
        <NavLink to="/volunteer" className={navLinkClass}>
          Volunteer
        </NavLink>
      </nav>

      <div className="p-4">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
