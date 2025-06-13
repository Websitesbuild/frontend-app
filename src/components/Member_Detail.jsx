import React from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function MemberDetail({ memberId }) {
  const [member, setMember] = React.useState(null);
  const [enrolledProjects, setEnrolledProjects] = React.useState([]);
  const [availableProjects, setAvailableProjects] = React.useState([]);
  const [pieceTotals, setPieceTotals] = React.useState({});
  const [paymentTotals, setPaymentTotals] = React.useState({});
  const [editProject, setEditProject] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const navigate = useNavigate();

  // Fetch piece totals and payment totals for all projects
  React.useEffect(() => {
    async function fetchTotals() {
      const pieceTotalsObj = {};
      const paymentTotalsObj = {};
      await Promise.all(
        enrolledProjects.map(async (proj) => {
          // Piece total
          const pieceRes = await axios.get(
            `https://new-backend-3jbn.onrender.com/member/${memberId}/piece-history?proj_id=${proj.proj_id}`,
            { headers: getAuthHeader() }
          );
          pieceTotalsObj[proj.proj_id] = pieceRes.data.success
            ? pieceRes.data.history.reduce(
                (sum, entry) => sum + Number(entry.piece_count),
                0
              )
            : 0;
          // Payment total
          const payRes = await axios.get(
            `https://new-backend-3jbn.onrender.com/member/${memberId}/payments?proj_id=${proj.proj_id}`,
            { headers: getAuthHeader() }
          );
          paymentTotalsObj[proj.proj_id] = payRes.data.success
            ? payRes.data.payments.reduce(
                (sum, entry) => sum + Number(entry.amount),
                0
              )
            : 0;
        })
      );
      setPieceTotals(pieceTotalsObj);
      setPaymentTotals(paymentTotalsObj);
    }
    if (enrolledProjects.length > 0) fetchTotals();
  }, [enrolledProjects, memberId, refreshKey]);

  const refreshTotals = () => setRefreshKey((k) => k + 1);

  // Fetch member details
  React.useEffect(() => {
    async function fetchMember() {
      const res = await axios.get(
        `https://new-backend-3jbn.onrender.com/member/${memberId}`,
        { headers: getAuthHeader() }
      );
      if (res.data.success) setMember(res.data.member);
    }
    fetchMember();
  }, [memberId]);

  // Fetch projects the member is enrolled in
  React.useEffect(() => {
    async function fetchEnrolled() {
      const res = await axios.get(
        `https://new-backend-3jbn.onrender.com/member/${memberId}/projects`,
        { headers: getAuthHeader() }
      );
      if (res.data.success) setEnrolledProjects(res.data.projects);
    }
    fetchEnrolled();
  }, [memberId]);

  // Fetch available projects for this member
  React.useEffect(() => {
    async function fetchAvailable() {
      const res = await axios.get(
        `https://new-backend-3jbn.onrender.com/projects/available?mem_id=${memberId}`,
        { headers: getAuthHeader() }
      );
      if (res.data.success) setAvailableProjects(res.data.projects);
    }
    fetchAvailable();
  }, [memberId]);

  // Calculate total earning and balance left
  const totalEarning = enrolledProjects.reduce(
    (sum, proj) =>
      sum +
      (pieceTotals[proj.proj_id] || 0) * Number(proj.price),
    0
  );
  const totalPaid = enrolledProjects.reduce(
    (sum, proj) => sum + (paymentTotals[proj.proj_id] || 0),
    0
  );
  const balanceLeft = totalEarning - totalPaid;

  // Remove from project
  async function handleRemoveFromProject(proj_id) {
    if (!window.confirm("Remove member from this project?")) return;
    await axios.put(
      `https://new-backend-3jbn.onrender.com/member/${memberId}/remove-from-project`,
      { proj_id },
      { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
    );
    // Refresh lists
    const res = await axios.get(
      `https://new-backend-3jbn.onrender.com/member/${memberId}/projects`,
      { headers: getAuthHeader() }
    );
    if (res.data.success) setEnrolledProjects(res.data.projects);
    const availRes = await axios.get(
      `https://new-backend-3jbn.onrender.com/projects/available?mem_id=${memberId}`,
      { headers: getAuthHeader() }
    );
    if (availRes.data.success) setAvailableProjects(availRes.data.projects);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this member and all related data?")) return;
    try {
      await axios.delete(
        `https://new-backend-3jbn.onrender.com/member/${memberId}`,
        { headers: getAuthHeader() }
      );
      navigate("/homepage");
    } catch (err) {
      alert("Error deleting member: " + err.message);
    }
  }

  // Add to project
  async function handleAddToProject(proj_id) {
    await axios.post(
      `https://new-backend-3jbn.onrender.com/member/${memberId}/add-to-project`,
      { proj_id },
      { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
    );
    // Refresh lists
    const res = await axios.get(
      `https://new-backend-3jbn.onrender.com/member/${memberId}/projects`,
      { headers: getAuthHeader() }
    );
    if (res.data.success) setEnrolledProjects(res.data.projects);
    const availRes = await axios.get(
      `https://new-backend-3jbn.onrender.com/projects/available?mem_id=${memberId}`,
      { headers: getAuthHeader() }
    );
    if (availRes.data.success) setAvailableProjects(availRes.data.projects);
  }

  if (!member) return <div>Loading...</div>;

  return (
    <div className="member-detail-page project-detail container">
      <div className="project-head">
        <h2>{member.usr_name}</h2>
      </div>
      <hr />
      <div className="project-status member-status">
        <p>Member ID: {memberId}</p>
      </div>
      <div className="member-info project-info">
        <p><strong>Address:</strong> {member.address}</p>
        <p><strong>Contact:</strong> <a href={`tel:+91${member.phone}`}>{member.phone}</a></p>
        <p><strong>Total Completed Pieces:</strong> {Object.values(pieceTotals).reduce((sum, val) => sum + val, 0)}</p>
        <p><strong>Total Earning:</strong> ₹ {totalEarning}</p>
        <p><strong>Balance Left:</strong> ₹ {balanceLeft}</p>
      </div>
      <br />
      <hr />
      <div className="project-head">
        <h3>Enrolled Projects</h3>
      </div>
      
      <div className="project-list project-members">
        {enrolledProjects.length === 0 ? (
          <p>No enrolled projects.</p>
        ) : (
          enrolledProjects.map((proj) => (
            <div className="project-item member" key={proj.proj_id}>
                <div className="member-info" onClick={() => setEditProject(proj)}>
                    <p>{proj.proj_name}</p>
                    <p>{proj.proj_desc}</p>
                </div>
                <div className="project_member-action-btns action-btns">
                    <p>Piece Completed: {pieceTotals[proj.proj_id] || 0}</p>
                    <p>Paid: ₹ {paymentTotals[proj.proj_id] || 0}</p>
                    <Tooltip title="Edit Project Detail" arrow>
                <EditIcon
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Tooltip title="Remove this Project" arrow>
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveFromProject(proj.proj_id)}
                />
              </Tooltip>
                </div>
            </div>
          ))
        )}
      </div>
      <br />
      <hr />
      <div className="project-head">
        <h3>Available Projects</h3>
      </div>
      <div className="project-members">
        {availableProjects.length === 0 ? (
          <p>No available projects to add.</p>
        ) : (
          availableProjects.map((proj) => (
            <div className="project-item member" key={proj.proj_id}>
                <div className="memver-info">
                    <p>{proj.proj_name}</p>
                    <p>{proj.proj_desc}</p>
                </div>
                <div className="action-btns">
                    <button
                  onClick={() => handleAddToProject(proj.proj_id)}
                  style={{ cursor: "pointer" }}
                >
                  Add
                </button>
                </div>
            </div>
          ))
        )}
      </div>
        <div className="delete-btn">
        <button onClick={handleDelete}>Delete Member</button>
      </div>
      {editProject && (
    <ProjectDetailPopup
      project={editProject}
      memberId={memberId}
      onClose={() => setEditProject(null)}
      onDataChange={refreshTotals}
    />
  )}
    </div>
  );
}

export default MemberDetail;

// Place this component at the bottom of your file:
function ProjectDetailPopup({ project, memberId, onClose, onDataChange }) {
  const [activeTab, setActiveTab] = React.useState("details");
  const [pieceHistory, setPieceHistory] = React.useState([]);
  const [paymentHistory, setPaymentHistory] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);

  // Fetch piece history for this member in this project
  React.useEffect(() => {
    async function fetchPieces() {
      const res = await axios.get(
        `https://new-backend-3jbn.onrender.com/member/${memberId}/piece-history?proj_id=${project.proj_id}`,
        { headers: getAuthHeader() }
      );
      setPieceHistory(res.data.success ? res.data.history : []);
    }
    if (activeTab === "pieces" || activeTab === "details") fetchPieces();
  }, [activeTab, memberId, project.proj_id, refresh]);

  // Fetch payment history for this member in this project
  React.useEffect(() => {
    async function fetchPayments() {
      const res = await axios.get(
        `https://new-backend-3jbn.onrender.com/member/${memberId}/payments?proj_id=${project.proj_id}`,
        { headers: getAuthHeader() }
      );
      setPaymentHistory(res.data.success ? res.data.payments : []);
    }
    if (activeTab === "payments" || activeTab === "details") fetchPayments();
  }, [activeTab, memberId, project.proj_id, refresh]);

  // Add more pieces
  async function handleAddMorePiece() {
    const count = prompt("Enter number of pieces to add:");
    if (!count || isNaN(count) || Number(count) <= 0) {
      alert("Please enter a valid number.");
      return;
    }
    try {
      await axios.post(
        `https://new-backend-3jbn.onrender.com/member/${memberId}/piece-history`,
        { proj_id: project.proj_id, piece_count: Number(count) },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      setRefresh((r) => !r);
      if (onDataChange) onDataChange();
    } catch (err) {
      alert("Error adding piece: " + err.message);
    }
  }

  // Add payment
  async function handleAddPayment() {
    const amount = prompt("Enter payment amount:");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const remarks = prompt("Remarks (optional):");
    try {
      await axios.post(
        `https://new-backend-3jbn.onrender.com/member/${memberId}/payments`,
        { proj_id: project.proj_id, amount: Number(amount), remarks: remarks || "" },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      setRefresh((r) => !r);
      if (onDataChange) onDataChange();
    } catch (err) {
      alert("Error adding payment: " + err.message);
    }
  }

  // Helper
  function formatIndianTime(date) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Totals
  const totalPiece = pieceHistory.reduce((sum, entry) => sum + Number(entry.piece_count), 0);
  const totalPaid = paymentHistory.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const totalEarned = totalPiece * Number(project.price);

  return (
    <div className="pop-up-form">
      <h3>Project Details</h3>
      <Tooltip title="Close" arrow>
        <button
          className="close-btn"
          onClick={() => {
            if (onDataChange) onDataChange();
            onClose();
          }}
          style={{ cursor: "pointer" }}
        >
          X
        </button>
      </Tooltip>
      <div className="tabs">
        <button
          onClick={() => setActiveTab("details")}
          className={activeTab === "details" ? "active" : ""}
        >
          Project Detail
        </button>
        <button
          onClick={() => setActiveTab("pieces")}
          className={activeTab === "pieces" ? "active" : ""}
        >
          Piece Received History
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={activeTab === "payments" ? "active" : ""}
        >
          Payment Paid History
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "details" && (
          <div className="member-details">
            <p><strong>Project Name:</strong> {project.proj_name}</p>
            <p><strong>Description:</strong> {project.proj_desc}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Material:</strong> {project.material}</p>
            <p><strong>Price per Piece:</strong> ₹{project.price}</p>
            <p><strong>Total Piece Completed by Member:</strong> {totalPiece}</p>
            <p><strong>Total Earned:</strong> ₹{totalEarned}</p>
            <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
            <p><strong>Balance Left:</strong> ₹{totalEarned - totalPaid}</p>
          </div>
        )}
        {activeTab === "pieces" && (
          <div className="history">
            <div className="head d-flex justify-content-between align-items-center">
              <h4>Piece Received History</h4>
              <Tooltip title="Add More Pieces" arrow>
                <AddIcon
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                  onClick={handleAddMorePiece}
                />
              </Tooltip>
            </div>
            <hr />
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {pieceHistory.length === 0 ? (
                <p>No piece history found.</p>
              ) : (
                pieceHistory.map((entry) => (
                  <div
                    className="history-list d-flex justify-content-between align-items-center"
                    key={entry.id}
                  >
                    <p>Piece Received: {entry.piece_count}</p>
                    <p>{formatIndianTime(entry.completed_at)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === "payments" && (
          <div className="history">
            <div className="head d-flex justify-content-between align-items-center">
              <h4>Payment Paid History</h4>
              <Tooltip title="Add Payment" arrow>
                <AddIcon
                  fontSize="large"
                  style={{ cursor: "pointer" }}
                  onClick={handleAddPayment}
                />
              </Tooltip>
            </div>
            <hr />
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {paymentHistory.length === 0 ? (
                <p>No payment history found.</p>
              ) : (
                paymentHistory.map((entry) => (
                  <div
                    className="history-list d-flex justify-content-between align-items-center"
                    key={entry.id}
                  >
                    <p>Amount Paid: ₹{entry.amount}</p>
                    <p>{formatIndianTime(entry.paid_at)}</p>
                    {entry.remarks && <p>Remarks: {entry.remarks}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}