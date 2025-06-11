import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Uncomment if you need navigation
function Projects({ heading, data,refreshData }) {
  const [form, setForm] = useState(false);
  const [blur, setBlur] = useState(false);
  const navigate = useNavigate(); // Uncomment if you need navigation
  const [projectData,setProjectData] = useState(null);
  const tooltip = `Add New ${heading}`;

  function handleClick() {
    setForm(!form);
    setBlur(!blur);
    fetchFormData();
  }

 // In your handleSubmit
async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log("Form Data: ", data);

  let payload = data;
  let url = "";

  if (heading === "Projects") {
    payload = {
      name: data.name,
      description: data.description,
      status: data.status,
      price: String(data.price),
      material: data.material,
    };
    url = "https://new-backend-3jbn.onrender.com/add/project";
  } else if (heading === "Upcoming Projects") {
    payload = {
      name: data.name,
      description: data.description,
      status: data.status,
      price: String(data.price),
      material: data.material,
    };
    url = "https://new-backend-3jbn.onrender.com/add/upcoming-project";
  } else if (heading === "Members") {
    payload = {
      usr_name: data.name,
      address: data.address,
      phone: data.phone,
      proj_id: data.project,
    };
    url = "https://new-backend-3jbn.onrender.com/add/member";
  }

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" }
    });

    // Inside handleSubmit, after a successful add:
if (response.data.success) {
  console.log("Item added successfully:", response.data.project || response.data.member);
  if (typeof refreshData === "function") refreshData(); // <--- Add this line
  setTimeout(() => navigate("/homepage"), 1000);
} else {
      console.error("Error adding item:", response.data.message);
    }
    event.target.reset();
    setForm(false);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}


  async function handleCardClick(cardType, id) {
  console.log("Card type clicked:", cardType);
  console.log("Card ID:", id);
  let response;
  try {
    switch (cardType) {
      case "Projects":
        response = await axios.get(`https://new-backend-3jbn.onrender.com/project/${id}`);
        break;
      case "Members":
        response = await axios.get(`https://new-backend-3jbn.onrender.com/member/${id}`);
        break;
      case "Upcoming Projects":
        response = await axios.get(`https://new-backend-3jbn.onrender.com/upcoming/${id}`);
        break;
      default:
        console.error("Unknown card type:", cardType);
        return;
    }
    if (response && response.data) {
      console.log("Card data:", response.data);
      if (cardType === "Members" && response.data.member) {
        // Route to member detail page with member data
        navigate("/member", { state: { data: response.data.member } });
      } else {
        // Default: route to card page
        navigate("/card", { state: { data: response.data } });
      }
    } else {
      console.error("No data found for the card");
    }
  } catch (error) {
    console.error("Error fetching card data:", error);
  }
}

const fetchFormData = async()=>{
    try{
    const res = await axios.get("https://new-backend-3jbn.onrender.com/form/data");
    setProjectData(res.data.data);
    console.log(res.data.data);
  }
  catch (error) {
    setProjectData([]);
    console.error("Failed to fetch members or projects:", error);
  }}

  return (
    <div className="projects-container">
      <div className="heading">
        <h2>{heading}</h2>
        <Tooltip title={tooltip} arrow>
          <AddIcon
            fontSize="large"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </div>
      <hr />
      <div className="project-list">
  {(!data || data.length === 0) ? (
    <div style={{display:"flex", justifyContent:"center", alignContent:"center", width:"100%"}}>
      <p>No data to display</p>
    </div>
  ) : (
    (heading === "Projects" || heading === "Upcoming Projects"
  ? data.map((project, index) => (
      <div
        className="project-item"
        key={index}
        onClick={() => handleCardClick(heading, project.proj_id)}
      >
        <h3>{project.proj_name}</h3>
        <p>{project.proj_desc}</p>
        <p>Status: {project.status}</p>
        <p>Price: ₹ {project.price}/- per piece</p>
      </div>
    ))
  : data.map((member, index) => (
      <div
        className="project-item"
        key={index}
        onClick={() => handleCardClick(heading, member.mem_id)}
      >
        <h3>{member.usr_name}</h3>
        <p>{member.address}</p>
        <p>Contact: {member.phone}</p>
      </div>
    ))
)
  )}
</div>
      <hr />
      {form && (
  <div className="pop-up-form">
    <h3>Add New {(heading === "Projects" || heading === "Upcoming Projects") ? "Project" : "Member"}</h3>
    <Tooltip title="Close Form" arrow>
      <button
        className="close-btn"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        X
      </button>
    </Tooltip>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
      </div>
      {(heading === "Projects" || heading === "Upcoming Projects") && (
        <>
          <div className="form-group">
            <label htmlFor="description">Project Description:</label>
            <textarea
              id="description"
              name="description"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="status">Project Status:</label>
            <select
              className="form-select mb-4"
              id="status"
              name="status"
              required
              defaultValue=""
            >
              <option value="" disabled>
                -- Select Project Status --
              </option>
              <option value="complete">Completed</option>
              <option value="in-progress">
                In-Progress
              </option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="material">Project Material:</label>
            <textarea
              id="material"
              name="material"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="text" id="price" name="price" required />
          </div>
          <div className="form-group">
            <label htmlFor="datetime">Date & Time:</label>
            <input type="datetime-local" id="datetime" name="datetime" required />
          </div>
        </>
      )}
      {heading === "Members" &&
        (
          <>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                name="address"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input type="number" id="phone" name="phone" required />
            </div>
            <label htmlFor="project">Select Project:</label>
            <select
              className="form-select mb-4"
              id="project"
              name="project"
              required
              defaultValue=""
            >
              <option value="" disabled>
                -- Select Project --
              </option>
              {projectData && projectData.map((option, idx) => (
                <option key={idx} value={option.proj_id}>{option.proj_name}</option>
              ))}
            </select>
          </>
        )
      }
      <button type="submit">Add {(heading === "Projects" || heading === "Upcoming Projects") ? "Project" : "Member"}</button>
    </form>
  </div>
)}
    </div>
  );
}

export default Projects;
