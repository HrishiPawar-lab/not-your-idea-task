import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineAudit } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const icons = {
  MdOutlineSpaceDashboard: <MdOutlineSpaceDashboard size={20} />,
  IoSettingsOutline: <IoSettingsOutline size={20} />,
  FaTasks: <FaTasks size={20} />,
  AiOutlineAudit: <AiOutlineAudit size={20} />,
};

let sidebarItems = [
  {
    name: "Dashboard",
    icon: icons.MdOutlineSpaceDashboard,
    path: "/",
  },
  {
    name: "Create Tasks",
    icon: icons.FaTasks,
    path: "/create-tasks",
  },
  {
    name: "Audit Log",
    icon: icons.AiOutlineAudit,
    path: "/audit-log",
  },
  {
    name: "Settings",
    icon: icons.IoSettingsOutline,
    path: "/settings",
  },
];

// const getUser = localStorage.getItem("user") && localStorage.getItem("user")

// if (getUser === "admin") {
//   sidebarItems.push(
    
//   )
// }


const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen text-white border-r-2 border-gray-200 bg-orange-50 rounded-lg">
      <div className="border-b-2 border-gray-200">
        <h2 className="py-5 text-3xl font-bold text-center text-orange-600">
          Not Your Idea
        </h2>
      </div>
      <nav className="flex flex-col flex-grow mt-8 space-y-1">
        {sidebarItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              `flex items-center p-2   transition-all ${isActive
                ? "border-r-4 border-orange-600 bg-gray-100 text-black font-semibold hover:text-orange-400"
                : "border-r-4 border-transparent text-soft-black opacity-60 hover:opacity-100 hover:bg-orange-100 hover:text-orange-400"
              }`
            }
          >
            <span className="pl-2 mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;
