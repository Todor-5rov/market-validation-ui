import React, { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { handleEditClick, handleSave } from "./sidenavFunctions"; // Import helper functions
import "./Sidenav.css";
import { auth } from "../../../FireBase/firebaseConfig";

const Sidebar = ({
  descriptions,
  selectedDescription,
  setSelectedDescription,
  handleStartNewCampaign,
  setDescriptions, // Ensure this function updates state
}) => {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  return (
    <div className="sidebar">
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
              <a>{desc.id}</a> // Instantly updates!
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
  );
};

export default Sidebar;