import React from "react";
import Projects from "./Projects";
import {upcoming} from "../data"; // Assuming you have a data file
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


function MainContent() {
  const [members, setMembers] = useState(null);
  const [projects,setProjects] = useState(null);

  const fetchData = async () => {
    try {
      const memberRes = await axios.get("http://localhost:5000/allMember");
      const projectRes = await axios.get("http://localhost:5000/allProjects");
      // The API returns { success: true, members: [...] } and { success: true, projects: [...] }
      // console.log("Members", memberRes.data.members);
      // console.log("Projects", projectRes.data.projects);
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
      data = {projects}
      refreshData={fetchData}/>
      <Projects 
      heading = "Members"
      data = {members}
      refreshData={fetchData}/>
      <Projects 
      heading = "Upcoming Projects"
      data = {upcoming}/>
    </div>
  );
}

export default MainContent;
