import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../FireBase/firebaseConfig";

/**
 * Handles the edit click to set the description as editable.
 */
export const handleEditClick = (e, desc, setEditingId, setNewName) => {
  e.stopPropagation();
  setEditingId(desc.id);
  setNewName(desc.id); // Set initial name as the description's id
};

/**
 * Saves the updated description name in Firebase and updates the state.
 */
export const handleSave = async (
  desc,
  newName,
  auth,
  setDescriptions,
  setEditingId
) => {
  if (!auth.currentUser || !newName.trim() || newName === desc.id) {
    setEditingId(null);
    return;
  }

  try {
    const userUid = auth.currentUser.uid;
    const userDocRef = doc(db, "chatHistories", userUid);
    const oldDocRef = doc(userDocRef, "chatHistory", desc.id);
    const newDocRef = doc(userDocRef, "chatHistory", newName);

    // Step 1: Fetch old data
    const oldDocSnap = await getDoc(oldDocRef);
    if (!oldDocSnap.exists()) throw new Error("Document not found!");

    const oldData = oldDocSnap.data();

    // Step 2: Create a new document with the new name
    await setDoc(newDocRef, oldData);

    // Step 3: Delete the old document
    await deleteDoc(oldDocRef);

    // Step 4: Update the state so the UI refreshes
    setDescriptions((prev) =>
      prev.map((item) =>
        item.id === desc.id ? { ...item, id: newName } : item
      )
    );

    setEditingId(null); // Hide input field after saving
  } catch (error) {
    console.error("Error renaming document:", error);
  }
};
