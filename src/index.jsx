import { useState, useEffect } from "react";
import { BsPencilFill, BsList } from "react-icons/bs";
import { handleEditClick, handleSave } from "./sidenavFunctions";
import { auth } from "../../../FireBase/firebaseConfig";
import "./Sidenav.css";

const Sidebar = ({
  descriptions,
  selectedDescription,
  setSelectedDescription,
  handleStartNewCampaign,
  setDescriptions,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1200);

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsCollapsed(true); // Auto-hide sidebar when width < 1200px
      } 
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on screen width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state manually
  };

  return (
    <>
      {/* Sidebar only renders if not collapsed */}
      <div className={`sidebar ${isCollapsed ? "hidden" : ""}`}>
        <h2>My Campaigns</h2>
        <ul className="menu-list">
          <li
            className={`menu-item-wrap-new ${!selectedDescription ? "active-item" : ""}`}
            onClick={handleStartNewCampaign}
          >
            <a>Start New Campaign</a>
          </li>

          {descriptions.map((desc) => (
            <li
              key={desc.id}
              className={`menu-item-wrap ${selectedDescription?.id === desc.id ? "active-item" : ""}`}
              onClick={() => (editingId ? null : setSelectedDescription(desc))}
            >
              {editingId === desc.id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleSave(desc, newName, auth, setDescriptions, setEditingId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSave(desc, newName, auth, setDescriptions, setEditingId);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <a>{desc.id}</a>
              )}

              <div className="icon-wrap">
                <BsPencilFill
                  size={18}
                  color="#28a745"
                  className="item-icon"
                  onClick={(e) => handleEditClick(e, desc, setEditingId, setNewName)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Show the toggle button always */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <BsList />
      </button>
    </>
  );
};

export default Sidebar;
