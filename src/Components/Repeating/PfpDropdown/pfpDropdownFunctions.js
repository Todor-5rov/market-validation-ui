import { signOut } from "firebase/auth";
import { auth } from "../../../FireBase/firebaseConfig";

/**
 * Handles user authentication state changes.
 */
export const handleAuthStateChange = (setDisplayName, setProfilePic, defaultProfilePic) => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "User"); // Fallback to 'User' if no display name
      setProfilePic(currentUser.photoURL || defaultProfilePic); // Fallback to default image if no profile pic
    } else {
      setDisplayName("User");
      setProfilePic(defaultProfilePic); // Reset to default profile pic if no user
    }
  });

  // Clean up listener when component unmounts
  return () => unsubscribe();
};

/**
 * Handles logout functionality.
 */
export const handleLogout = async (navigate) => {
  try {
    await signOut(auth);
    navigate("/home"); // Redirect to home after logout
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

/**
 * Handles closing the dropdown when clicking outside.
 */
export const handleClickOutside = (e, menuRef, setOpen) => {
  if (menuRef.current && !menuRef.current.contains(e.target)) {
    setOpen(false);
  }
};