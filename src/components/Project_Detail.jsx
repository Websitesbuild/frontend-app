import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Detail({ data }) {
  const [form, setForm] = React.useState(false);
  const [editPiece, setEditPiece] = React.useState(false);
  const [memberDetail, setMemberDetail] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [memberData, setMemberData] = React.useState(null);
  const navigate = useNavigate();
  const [pieceHistory, setPieceHistory] = React.useState([]);
  const [memberPieceTotals, setMemberPieceTotals] = React.useState({});
  const [availableMembers, setAvailableMembers] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("details");
  const [paymentHistory, setPaymentHistory] = React.useState([]);

  // Helper to get JWT token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  React.useEffect(() => {
    async function fetchPayments() {
      if (activeTab === "payments" && memberDetail && memberData) {
        try {
          const res = await axios.get(
            `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/payments?proj_id=${data.project.proj_id}`,
            { headers: getAuthHeader() }
          );
          if (res.data.success) setPaymentHistory(res.data.payments);
          else setPaymentHistory([]);
        } catch {
          setPaymentHistory([]);
        }
      }
    }
    fetchPayments();
  }, [activeTab, memberDetail, memberData, data.project.proj_id]);

  React.useEffect(() => {
    async function fetchAvailableMembers() {
      try {
        const res = await axios.get(
          `https://new-backend-3jbn.onrender.com/members/available?exclude_proj_id=${data.project.proj_id}`,
          { headers: getAuthHeader() }
        );
        if (res.data.success) setAvailableMembers(res.data.members);
        else setAvailableMembers([]);
      } catch {
        setAvailableMembers([]);
      }
    }
    if (data && data.project) {
      fetchAvailableMembers();
    }
  }, [data && data.project ? data.project.proj_id : null, members]);

  // Fetch total pieces for all members
  async function fetchAllMemberPieceTotals(members) {
    const totals = {};
    await Promise.all(
      members.map(async (member) => {
        try {
          const res = await axios.get(
            `https://new-backend-3jbn.onrender.com/member/${member.mem_id}/piece-history?proj_id=${data.project.proj_id}`,
            { headers: getAuthHeader() }
          );
          if (res.data.success) {
            const total = res.data.history.reduce(
              (sum, entry) => sum + Number(entry.piece_count),
              0
            );
            totals[member.mem_id] = total;
          } else {
            totals[member.mem_id] = 0;
          }
        } catch {
          totals[member.mem_id] = 0;
        }
      })
    );
    setMemberPieceTotals(totals);
  }

  // Update useEffect for members
  React.useEffect(() => {
    async function fetchMembersAndTotals() {
      try {
        const res = await axios.get(
          `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
          { headers: getAuthHeader() }
        );
        if (res.data.success) {
          setMembers(res.data.members);
          await fetchAllMemberPieceTotals(res.data.members);
        }
      } catch (err) {
        setMembers([]);
        setMemberPieceTotals({});
      }
    }
    if (data && data.project) {
      fetchMembersAndTotals();
    }
  }, [data && data.project ? data.project.proj_id : null]);

  // Fetch piece history when member detail is opened
  React.useEffect(() => {
    async function fetchPieceHistory() {
      if (memberDetail && memberData) {
        try {
          const res = await axios.get(
            `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/piece-history?proj_id=${data.project.proj_id}`,
            { headers: getAuthHeader() }
          );
          if (res.data.success) setPieceHistory(res.data.history);
          else setPieceHistory([]);
        } catch (err) {
          setPieceHistory([]);
        }
      }
    }
    fetchPieceHistory();
  }, [memberDetail, memberData, data.project.proj_id]);

  // Handler to add more pieces for a member
  async function handleAddMorePiece() {
    const piece_count = prompt("Enter number of pieces completed:");
    if (!piece_count || isNaN(piece_count) || piece_count <= 0) {
      alert("Please enter a valid piece count.");
      return;
    }
    try {
      const payload = {
        proj_id: data.project.proj_id,
        piece_count: Number(piece_count),
      };
      const res = await axios.post(
        `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/piece-history`,
        payload,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      if (res.data.success) {
        alert("Piece record added!");
        const historyRes = await axios.get(
          `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/piece-history?proj_id=${data.project.proj_id}`,
          { headers: getAuthHeader() }
        );
        if (historyRes.data.success) setPieceHistory(historyRes.data.history);
        await fetchAllMemberPieceTotals(members);
        setMemberDetail(false);
      } else {
        alert("Error adding piece record: " + res.data.message);
      }
    } catch (err) {
      alert("Error adding piece record: " + err.message);
    }
  }

  // Always call hooks at the top, then guard clause
  React.useEffect(() => {
    if (!data || !data.project) return;
    async function fetchMembers() {
      try {
        const res = await axios.get(
          `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
          { headers: getAuthHeader() }
        );
        if (res.data.success) setMembers(res.data.members);
      } catch (err) {
        setMembers([]);
      }
    }
    fetchMembers();
  }, [data && data.project ? data.project.proj_id : null]);

  // Guard clause AFTER hooks
  if (!data || !data.project) {
    return <div>Loading...</div>;
  }

  // Add new member handler
  async function addProjectMember(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData.entries());
    const payload = {
      usr_name: formObj.name,
      address: formObj.address,
      phone: formObj.phone,
      proj_id: data.project.proj_id,
    };
    try {
      const response = await axios.post(
        "https://new-backend-3jbn.onrender.com/add/member",
        payload,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      if (response.data.success) {
        alert("Member added successfully!");
        setForm(false);
        const res = await axios.get(
          `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
          { headers: getAuthHeader() }
        );
        if (res.data.success) setMembers(res.data.members);
      } else {
        alert("Error adding member: " + response.data.message);
      }
    } catch (error) {
      alert("Error adding member: " + error.message);
    }
  }

  // Delete project handler
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const response = await axios.delete(
        `https://new-backend-3jbn.onrender.com/delete/project/${data.project.proj_id}`,
        { headers: getAuthHeader() }
      );
      if (response.data.success) {
        alert("Project deleted successfully!");
        navigate("/homepage");
      } else {
        alert("Error deleting project: " + response.data.message);
      }
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  }

  // Member detail popup
  function handleMemberDetail(member) {
    setMemberData(member);
    setMemberDetail(true);
  }

  // Format date/time for display
  function formatIndianTime(input) {
    const date = new Date(input);
    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(date).replace(",", ",");
  }

  function handleEditMember() {
    setMemberDetail(false);
    setEditPiece(!editPiece);
    // Here you can implement the logic to edit the member's details
  }

  async function handleAddExistingMember(mem_id) {
    try {
      const payload = { proj_id: data.project.proj_id };
      const res = await axios.post(
        `https://new-backend-3jbn.onrender.com/member/${mem_id}/add-to-project`,
        payload,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      if (res.data.success) {
        alert("Member added to project!");
        const membersRes = await axios.get(
          `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
          { headers: getAuthHeader() }
        );
        if (membersRes.data.success) setMembers(membersRes.data.members);
        setAvailableMembers((prev) => prev.filter((m) => m.mem_id !== mem_id));
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function handleMemberDelete(id) {
    if (
      !window.confirm(
        "Are you sure you want to remove this member from the project?"
      )
    )
      return;
    try {
      const res = await axios.put(
        `https://new-backend-3jbn.onrender.com/member/${id}/remove-from-project`,
        { proj_id: data.project.proj_id },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      if (res.data.success) {
        alert("Member removed from project!");
        const membersRes = await axios.get(
          `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
          { headers: getAuthHeader() }
        );
        if (membersRes.data.success) setMembers(membersRes.data.members);
        const availRes = await axios.get(
          `https://new-backend-3jbn.onrender.com/members/available?exclude_proj_id=${data.project.proj_id}`,
          { headers: getAuthHeader() }
        );
        if (availRes.data.success) setAvailableMembers(availRes.data.members);
      } else {
        alert("Error removing member: " + res.data.message);
      }
    } catch (err) {
      alert("Error removing member: " + err.message);
    }
  }

  return (
    <div className="project-detail container">
      <div className="project-head">
        <h2>{data.project.proj_name}</h2>
        <p>Last Updated: {formatIndianTime(data.project.date)}</p>
      </div>
      <hr />
      <div className="project-status">
        <p>Project ID: {data.project.proj_id}</p>
        <p>Project Status: {data.project.status}</p>
      </div>
      <div className="project-info">
        <p>Description: {data.project.proj_desc}</p>
        <p>Material used : {data.project.material}</p>
        <p>Total Members: {members.length}</p>
        <p>
          Total Piece:{" "}
          {Object.values(memberPieceTotals).reduce((sum, val) => sum + val, 0)}
        </p>
        <p>Price: ₹ {data.project.price}/- per piece</p>
        <h4>
          Total Earning: ₹{" "}
          {Object.values(memberPieceTotals).reduce((sum, val) => sum + val, 0) *
            Number(data.project.price)}
        </h4>
      </div>
      <br />
      <hr />
      <div className="project-head">
        <h2>Enrolled Members</h2>
        <Tooltip title="Add New Member" arrow>
          <AddIcon
            fontSize="large"
            onClick={() => setForm(true)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </div>
      <div className="project-members">
        {members.length === 0 ? (
          <p>No members enrolled.</p>
        ) : (
          members.map((member) => (
            <div className="member" key={member.mem_id}>
              <div
                className="member-info"
                onClick={() => handleMemberDetail(member)}
                style={{ cursor: "pointer" }}
              >
                <p>{member.usr_name}</p>
                <p>
                  {member.address} , {member.phone}
                </p>
              </div>
              <div className="action-btns">
                <p>{memberPieceTotals[member.mem_id] || 0} Piece</p>
                <Tooltip title="Edit Member" arrow>
                  <EditIcon
                    fontSize="small"
                    onClick={() => {
                      setMemberData(member); // set the selected member's data
                      setEditPiece(true); // open the edit form
                      setMemberDetail(false); // close detail popup if open
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip title="Remove Member from this Project" arrow>
                  <DeleteIcon
                    fontSize="small"
                    onClick={() => {
                      handleMemberDelete(member.mem_id);
                    }}
                    style={{ cursor: "pointer" }}
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
        <h2>Add Existing Members</h2>
      </div>
      <div className="project-members">
        {availableMembers && availableMembers.length === 0 ? (
          <p>No available members to add.</p>
        ) : (
          availableMembers &&
          availableMembers.map((member) => (
            <div className="member" key={member.mem_id}>
              <div className="member-info">
                <p>{member.usr_name}</p>
                <p>
                  {member.address} , {member.phone}
                </p>
              </div>
              <div className="action-btns">
                <button
                  onClick={() => handleAddExistingMember(member.mem_id)}
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
        <button onClick={handleDelete}>Delete Project</button>
      </div>
      {form && (
        <div className="pop-up-form">
          <h3>Add New Member</h3>
          <Tooltip title="Close Form" arrow>
            <button
              className="close-btn"
              onClick={() => setForm(false)}
              style={{ cursor: "pointer" }}
            >
              X
            </button>
          </Tooltip>
          <form onSubmit={addProjectMember}>
            <div className="form-group">
              <label htmlFor="project_id">Project ID:</label>
              <input
                type="text"
                id="project_id"
                name="project_id"
                value={data.project.proj_id}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="project_Name">Project Name:</label>
              <input
                type="text"
                id="project_Name"
                name="project_Name"
                value={data.project.proj_name}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Contact:</label>
              <input type="text" id="phone" name="phone" required />
            </div>
            <button type="submit">Add Member</button>
          </form>
        </div>
      )}
      {memberDetail && memberData && (
        <div className="pop-up-form">
          <h3>Member Details</h3>
          <Tooltip title="Close" arrow>
            <button
              className="close-btn"
              onClick={() => setMemberDetail(false)}
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
              Personal Detail
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
                <p>
                  <strong>Name:</strong> {memberData.usr_name}
                </p>
                <p>
                  <strong>Address:</strong> {memberData.address}
                </p>
                <p>
                  <strong>Contact: </strong>
                  <a href={`tel:+91${memberData.phone}`}>{memberData.phone}</a>
                </p>
                <p>
                  <strong>Total Earned:</strong> ₹{" "}
                  {pieceHistory.reduce(
                    (sum, entry) => sum + Number(entry.piece_count),
                    0
                  ) * Number(data.project.price)}
                </p>
                <p>
                  <strong>Balance Left:</strong> ₹{" "}
                  {pieceHistory.reduce(
                    (sum, entry) => sum + Number(entry.piece_count),
                    0
                  ) *
                    Number(data.project.price) -
                    paymentHistory.reduce(
                      (sum, entry) => sum + Number(entry.amount),
                      0
                    )}
                </p>
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
            )}
            {activeTab === "payments" && (
              <div className="history">
                <div className="head d-flex justify-content-between align-items-center">
                  <h4>Payment Paid History</h4>
                  <Tooltip title="Add Payment" arrow>
                    <AddIcon
                      fontSize="large"
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        const amount = prompt("Enter payment amount:");
                        if (!amount || isNaN(amount) || Number(amount) <= 0) {
                          alert("Please enter a valid amount.");
                          return;
                        }
                        const remarks = prompt("Remarks (optional):");
                        try {
                          const payload = {
                            proj_id: data.project.proj_id,
                            amount: Number(amount),
                            remarks: remarks || "",
                          };
                          const res = await axios.post(
                            `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/payments`,
                            payload,
                            {
                              headers: {
                                "Content-Type": "application/json",
                                ...getAuthHeader(),
                              },
                            }
                          );
                          if (res.data.success) {
                            alert("Payment added!");
                            // Refresh payment history
                            const payRes = await axios.get(
                              `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/payments?proj_id=${data.project.proj_id}`,
                              { headers: getAuthHeader() }
                            );
                            if (payRes.data.success)
                              setPaymentHistory(payRes.data.payments);
                          } else {
                            alert("Error adding payment: " + res.data.message);
                          }
                        } catch (err) {
                          alert("Error adding payment: " + err.message);
                        }
                      }}
                    />
                  </Tooltip>
                </div>
                <hr />
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
            )}
          </div>
        </div>
      )}
      {editPiece && memberData && (
        <div className="pop-up-form">
          <h3>Edit Member</h3>
          <Tooltip title="Close Form" arrow>
            <button
              className="close-btn"
              onClick={() => setEditPiece(false)}
              style={{ cursor: "pointer" }}
            >
              X
            </button>
          </Tooltip>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = {
                usr_name: formData.get("name"),
                address: formData.get("address"),
                phone: formData.get("phone"),
              };
              try {
                const res = await axios.put(
                  `https://new-backend-3jbn.onrender.com/member/${memberData.mem_id}/edit`,
                  payload,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      ...getAuthHeader(),
                    },
                  }
                );
                if (res.data.success) {
                  alert("Member updated!");
                  setEditPiece(false);
                  // Refresh members list
                  const membersRes = await axios.get(
                    `https://new-backend-3jbn.onrender.com/project/${data.project.proj_id}/members`,
                    { headers: getAuthHeader() }
                  );
                  if (membersRes.data.success)
                    setMembers(membersRes.data.members);
                } else {
                  alert("Error updating member: " + res.data.message);
                }
              } catch (err) {
                alert("Error updating member: " + err.message);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={memberData.usr_name}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={memberData.address}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Contact:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue={memberData.phone}
                required
              />
            </div>
            <button type="submit">Update Member</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Detail;