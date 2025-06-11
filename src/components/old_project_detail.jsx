import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Detail({data}) {

  const [form, setForm] = React.useState(false);
  const [editPiece, setEditPiece] = React.useState(false);
  const [memberDetail, setMemberDetail] = React.useState(false);
  const navigate = useNavigate();
  const [members, setMembers] = React.useState([]);
  const [memberData,setMemberData] = React.useState(null);

  


  React.useEffect(() => {
    
    async function fetchMembers() {
      try {
        const res = await axios.get(`http://localhost:5000/project/${data.project.proj_id}/members`);
        if (res.data.success) setMembers(res.data.members);
      } catch (err) {
        setMembers([]);
      }
    }
    fetchMembers();
  }, [data.project.proj_id]);


  





  async function handleDelete() {
  if (!window.confirm("Are you sure you want to delete this project?")) return;
  try {
    const response = await axios.delete(
      `http://localhost:5000/delete/project/${data.project.proj_id}`
    );
    if (response.data.success) {
      console.log('Project deleted successfully:', response.data.message);
      navigate('/homepage');
    } else {
      console.error('Error deleting project:', response.data.message);
      alert('Error deleting project: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error deleting project:', error.message);
    alert('Error deleting project: ' + error.message);
  }
}


  function handleAddBtn() {
    setForm(!form);
  }

  function handleEditMember() {
    setMemberDetail(false);
    setEditPiece(!editPiece);
    // Here you can implement the logic to edit the member's details
  }
  async function handleDeleteMember() {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const response = await axios.delete('http://localhost:5000/delete/member/12345');
      if (response.data.success) {
        console.log('Member deleted successfully:', response.data.message);
        // Optionally, you can update the UI to reflect the deletion
      } else {
        console.error('Error deleting member:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting member:', error.message);
    }
  }

    function handleMemberDetail(data) {
      setMemberData(data)
      setMemberDetail(!memberDetail);
    }

  function formatIndianTime(input) {
  const date = new Date(input);

  const options = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const formatter = new Intl.DateTimeFormat('en-IN', options);
  return formatter.format(date).replace(',', ',');
}


async function addProjectMember(e) {
  e.preventDefault();
  // Collect form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Prepare payload for backend
  const payload = {
  usr_name: data.name,
  address: data.address,
  phone: data.phone,
  proj_id: data.project_id
};

  try {
    const response = await axios.post("http://localhost:5000/add/member", payload, {
      headers: { "Content-Type": "application/json" }
    });
    if (response.data.success) {
      alert("Member added successfully!");
      setForm(false);
      // Refresh members list
      const res = await axios.get(`http://localhost:5000/project/${data.project_id}/members`);
      if (res.data.success){
        setMembers(res.data.members);

      } 
    } else {
      alert("Error adding member: " + response.data.message);
    }
  } catch (error) {
    alert("Error adding member: " + error.message);
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
        <p>Total Piece: 50,000</p>
        <p>Price: ₹ {data.project.price}/- per piece</p>
      </div>
      <hr />
      <div className="project-head">
        <h2>Enrolled Members</h2>
        <Tooltip title="Add New Member" arrow>
          <AddIcon
            fontSize="large"
            onClick={handleAddBtn}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </div>
      <div className="project-members">
        {members.length === 0 ? (
          <p>No members enrolled.</p>
        ) : (
          members.map((member, index) => (
            <div className="member" key={member.mem_id}>
              <div className="member-info" onClick={()=>{handleMemberDetail(member)}}>
                <p>{member.usr_name}</p>
                <p>{member.address} , {member.phone}</p>
              </div>
              <div className="action-btns">
                <p>2700 Piece</p>
                <Tooltip title="Edit Member" arrow>
                  <EditIcon
                    fontSize="small"
                    onClick={handleEditMember}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip title="Delete Member" arrow>
                  <DeleteIcon
                    fontSize="small"
                    onClick={handleDeleteMember}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      {/* You can add more content here, such as project information, tasks, members, etc. */}
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
          <form
            onSubmit={addProjectMember}
          >
            <div className="form-group">
              <label htmlFor="name">Project ID:</label>
              <input type="text" id="project_id" name="project_id" value={data.project.proj_id} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="name">Project Name:</label>
              <input type="text" id="project_Name" name="project_Name" value={data.project.proj_name} readOnly/>
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Address:</label>
              <input type="text" id="address" name="address" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact:</label>
              <input type="text" id="contact" name="contact" required />
            </div>
            <button type="submit">Add Member</button>
          </form>
        </div>
      )}
      {editPiece && (
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
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Edit form submitted");
              setEditPiece(false);
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue="Amit Sharma"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue="Kaushik Enclave"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Contact:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue="8766232343"
              />
            </div>
            <div className="form-group">
              <label htmlFor="piece">Assigned Pieces:</label>
              <input
                type="number"
                id="piece"
                name="piece"
                defaultValue="2700"
              />
            </div>
            <button type="submit">Update Member Data</button>
          </form>
        </div>
      )}
      {memberDetail && (
        <div className="pop-up-form">
          <h3>Member Details</h3>
          <Tooltip title="Close Form" arrow>
            <button
              className="close-btn"
              onClick={() => setMemberDetail(false)}
              style={{ cursor: "pointer" }}
            >
              X
            </button>
          </Tooltip>
          <div className="member-details">
            <p><strong>Name:</strong> {memberData.usr_name}</p>
            <p><strong>Address:</strong> {memberData.address}</p>
            <p><strong>Contact:</strong> {memberData.phone}</p>
          </div>
          <div className="history">
            <div className="head d-flex justify-content-between align-items-center">
                <h4>Piece Received History</h4>
                <Tooltip title="Add More Pieces" arrow>
                <AddIcon
                fontSize="large"
                style={{ cursor: "pointer" }}
                onClick={()=>{handleEditMember(memberData.mem_id)}}
                />
                </Tooltip>
            </div>
            <hr />
            <div className="history-list d-flex justify-content-between align-items-center">
              <p>Piece Received: 2700</p>
              <p>01 June 2025, 10:00 AM</p>
            </div>
            <div className="history-list d-flex justify-content-between align-items-center">
              <p>Piece Received: 2700</p>
              <p>01 June 2025, 10:00 AM</p>
            </div>
            <div className="history-list d-flex justify-content-between align-items-center">
              <p>Piece Received: 2700</p>
              <p>01 June 2025, 10:00 AM</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
