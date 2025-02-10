"use client";

import DataCard from "@/components/extraComponents/DataCard";

interface ProjectDetailsGrid1Props {
  project: { projectName: string; description: string }; // Define project type with only necessary fields
}

const ProjectDetailsGrid1: React.FC<ProjectDetailsGrid1Props> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 h-30">
      <DataCard >
        <p className="text-lg"><strong>Project Name:
          </strong> {project.projectName}</p>
        <p className="text-lg"><strong>Project Description:</strong> {project.description}</p>
      </DataCard>
    </div>
  );
};

export default ProjectDetailsGrid1;
