// ...existing imports...
import axios from "axios";
// ...existing code...

// Add this helper at the top (after imports)
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ...inside MemberDetail and ProjectDetailPopup, update all axios calls:

// Example for GET:
await axios.get(
  `https://new-backend-3jbn.onrender.com/member/${memberId}/piece-history?proj_id=${proj.proj_id}`,
  { headers: getAuthHeader() }
);

// Example for POST/PUT/DELETE:
await axios.post(
  `https://new-backend-3jbn.onrender.com/member/${memberId}/payments`,
  { proj_id: project.proj_id, amount: Number(amount), remarks: remarks || "" },
  { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
);

// ...repeat for ALL axios requests in this file...

// For example, update these blocks:

// 1. In ProjectDetailPopup (handleAddPayment, handleAddMorePiece, useEffect fetches)
await axios.post(
  `https://new-backend-3jbn.onrender.com/member/${memberId}/payments`,
  { proj_id: project.proj_id, amount: Number(amount), remarks: remarks || "" },
  { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
);

// 2. In MemberDetail (fetches, handleRemoveFromProject, handleAddToProject, handleDelete, etc.)
await axios.get(
  `https://new-backend-3jbn.onrender.com/member/${memberId}`,
  { headers: getAuthHeader() }
);

await axios.put(
  `https://new-backend-3jbn.onrender.com/member/${memberId}/remove-from-project`,
  { proj_id },
  { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
);

await axios.delete(
  `https://new-backend-3jbn.onrender.com/member/${memberId}`,
  { headers: getAuthHeader() }
);

await axios.post(
  `https://new-backend-3jbn.onrender.com/member/${memberId}/add-to-project`,
  { proj_id },
  { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
);

// ...and so on for every axios call in this file.
