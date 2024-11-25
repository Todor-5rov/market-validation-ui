import user from "./img/user.png"; // Default user image
import settings from "./img/settings.png";
import help from "./img/question.png";
import logout from "./img/log-out.png";
import "./PfpDropdown.css";
import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../FireBase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { t } from "i18next"; // Importing i18next for translations

function PfpDropdown() {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("The Kiet");
  const [profilePic, setProfilePic] = useState(user); // Default to user image
  const navigate = useNavigate();
  let menuRef = useRef();

  useEffect(() => {
    // Listener to get the current user on auth state change
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || "User"); // Fallback if no display name
        setProfilePic(currentUser.photoURL); // Fallback if no profile pic
        console.log(profilePic);
      } else {
        setDisplayName("User");
        setProfilePic(user); // Reset to default if no user
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/home"); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
              onClick={handleLogout}
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
