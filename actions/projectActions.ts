// actions/projectActions.ts
import Project from "@/models/Project";

export const storeProjectData = async (projectData: any) => {
  console.log("Project Data Saved"); // Log the project data for debugging

  try {
    const project = new Project({
      userId: projectData.userId,
      projectName: projectData.projectName,
      description: projectData.description,
      industry: projectData.industry,
      transaction: projectData.transaction,
      dateRange: projectData.dateRange,
      competitors: projectData.competitors,
      investment: projectData.investment, // New investment field
      socialLinks: {                      // New social links fields with null defaults
        instagram: projectData.instagram || null,
        facebook: projectData.facebook || null,
        linkedin: projectData.linkedin || null,
        drive: projectData.drive || null,
      },
    });
    await project.save();
    return project;
  } catch (error: any) {
    throw new Error("Error storing project data: " + error.message);
  }
};

export const getProjectData = async (projectId: string) => {
  try {
    const project = await Project.findById(projectId).exec(); // Fetch the project by ID
    return project; // Return the project data
  } catch (error: any) {
    throw new Error("Error fetching project data: " + error.message);
  }
}
// New delete function to delete the project
export const deleteProjectData = async (projectId: string) => {
  try {
    const project = await Project.findByIdAndDelete(projectId).exec();
    return project; // Return the deleted project
  } catch (error: any) {
    throw new Error("Error deleting project data: " + error.message);
  }
};

//update project data
export const updateProjectData = async (projectId: string, updatedData: any) => {
  try {
    // Update the project in the database
    const updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, { new: true }).exec();
    return updatedProject; // Return the updated project data
  } catch (error: any) {
    throw new Error("Error updating project data: " + error.message);
  }
};

export const getProjectsByUserId = async (userId: string) => {
  try {
    // Query to find all projects for the given userId
    const projects = await Project.find({ userId }, "projectName _id").exec();

    // Return the filtered project data
    return projects;
  } catch (error: any) {
    throw new Error("Error fetching projects by userId: " + error.message);
  }
};
export const getStatsProjectByUserId = async (userId: string) => {
  try {
    // Query to find all projects for the given userId, and select only the required fields
    const projects = await Project.find({ userId }, "projectName _id industry transaction investment").exec();

    // Return the filtered project data
    return projects;
  } catch (error: any) {
    throw new Error("Error fetching project stats by userId: " + error.message);
  }
};