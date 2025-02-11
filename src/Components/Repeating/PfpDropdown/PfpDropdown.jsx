import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next"; // Importing i18next for translations
import { handleAuthStateChange, handleLogout, handleClickOutside } from "./pfpDropdownFunctions";
import user from "./img/user.png"; // Default user image
import logout from "./img/log-out.png";
import "./PfpDropdown.css";

function PfpDropdown() {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("The Kiet");
  const [profilePic, setProfilePic] = useState(user); // Default to user image
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    // Initialize auth state listener
    const unsubscribe = handleAuthStateChange(setDisplayName, setProfilePic, user);

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Event listener for clicks outside the dropdown
    const handler = (e) => handleClickOutside(e, menuRef, setOpen);

    document.addEventListener("mousedown", handler);

    // Cleanup on component unmount
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="App">
      <div className="menu-container" ref={menuRef}>
        <div
          className="menu-trigger"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <img
            src={profilePic}
            alt="User Profile"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
          <h3>{displayName}</h3>
          <ul>
            <DropdownItem
              img={logout}
              text={t("profile.logout")}
              onClick={() => handleLogout(navigate)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

function DropdownItem(props) {
  return (
    <li className="dropdownItem" onClick={props.onClick}>
      <img src={props.img} alt={props.text} referrerPolicy="no-referrer" />
      <a>{props.text}</a>
    </li>
  );
}

export default PfpDropdown;