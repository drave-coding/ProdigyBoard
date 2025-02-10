import Audience from "../models/Audience"; // Import the Audience model

// Fetch all audiences by userId
export const getAllAudiencesByUserId = async (userId: string) => {
  try {
    const audiences = await Audience.find({ userId }).exec();
    return audiences; // Return all audiences for the given user
  } catch (error: any) {
    throw new Error("Error fetching audiences: " + error.message);
  }
};

// Fetch all audiences by userId and projectId
export const getAllAudiencesByUserIdAndProjectId = async (
  userId: string,
  projectId: string
) => {
  try {
    const audiences = await Audience.find({
      userId,
      "project.projectId": projectId,
    }).exec();
    return audiences; // Return all audiences for the given user and project
  } catch (error: any) {
    throw new Error("Error fetching audiences: " + error.message);
  }
};
