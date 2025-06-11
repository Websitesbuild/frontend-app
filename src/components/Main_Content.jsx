import React, { useEffect, useState } from "react";
import Projects from "./Projects";
import { upcoming } from "../data";
import axios from "axios";

// Helper to get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function MainContent() {
  const [members, setMembers] = useState(null);
  const [projects, setProjects] = useState(null);

  const fetchData = async () => {
    try {
      const memberRes = await axios.get(
        "https://new-backend-3jbn.onrender.com/allMember",
        { headers: getAuthHeader() }
      );
      const projectRes = await axios.get(
        "https://new-backend-3jbn.onrender.com/allProjects",
        { headers: getAuthHeader() }
      );
      setMembers(memberRes.data.members);
      setProjects(projectRes.data.projects);
    } catch (error) {
      setMembers([]);
      setProjects([]);
      console.error("Failed to fetch members or projects:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container content">
      <Projects
        heading="Projects"
        data={projects}
        refreshData={fetchData}
      />
      <Projects
        heading="Members"
        data={members}
        refreshData={fetchData}
      />
      <Projects
        heading="Upcoming Projects"
        data={upcoming}
      />
    </div>
  );
}

export default MainContent;