import RequestWP from "@/models/RequestWP";
import RequestAI from "@/models/RequestAI";
import RequestDS from "@/models/RequestDS";


export const storeRequestWPData = async (requestData: any) => {
  console.log("RequestWP Data saved");
  try {
    // Create a new RequestWP document
    const requestWP = new RequestWP({
      content: requestData.content,
      project: {
        projectId: requestData.project.projectId,
        projectName: requestData.project.projectName,
      },
      userId: requestData.userId,
      link: requestData.link, // Specific to RequestWP
    });
    // Save the RequestWP in the database
    await requestWP.save();
    return requestWP; // Return the stored RequestWP
  } catch (error: any) {
    throw new Error("Error storing RequestWP data: " + error.message);
  }
};

export const storeRequestAIData = async (requestData: any) => {
  console.log("RequestAI Data saved");
  try {
    // Create a new RequestAI document
    const requestAI = new RequestAI({
      content: requestData.content,
      project: {
        projectId: requestData.project.projectId,
        projectName: requestData.project.projectName,
      },
      userId: requestData.userId,
      link: requestData.link, // Specific to RequestAI
    });
    // Save the RequestAI in the database
    await requestAI.save();
    return requestAI; // Return the stored RequestAI
  } catch (error: any) {
    throw new Error("Error storing RequestAI data: " + error.message);
  }
};

export const storeRequestDSData = async (requestData: any) => {
  console.log("RequestDS Data saved");
  try {
    // Create a new RequestDS document
    const requestDS = new RequestDS({
      content: requestData.content,
      project: {
        projectId: requestData.project.projectId,
        projectName: requestData.project.projectName,
      },
      userId: requestData.userId,
    });
    // Save the RequestDS in the database
    await requestDS.save();
    return requestDS; // Return the stored RequestDS
  } catch (error: any) {
    throw new Error("Error storing RequestDS data: " + error.message);
  }
};

export const deleteRequestWPData = async (requestId: string) => {
    try {
      const deletedRequestWP = await RequestWP.findByIdAndDelete(requestId).exec();
      return deletedRequestWP; // Return the deleted RequestWP
    } catch (error: any) {
      throw new Error("Error deleting RequestWP data: " + error.message);
    }
  };
 
  export const deleteRequestAIData = async (requestId: string) => {
    try {
      const deletedRequestAI = await RequestAI.findByIdAndDelete(requestId).exec();
      return deletedRequestAI; // Return the deleted RequestAI
    } catch (error: any) {
      throw new Error("Error deleting RequestAI data: " + error.message);
    }
  };

  export const deleteRequestDSData = async (requestId: string) => {
    try {
      const deletedRequestDS = await RequestDS.findByIdAndDelete(requestId).exec();
      return deletedRequestDS; // Return the deleted RequestDS
    } catch (error: any) {
      throw new Error("Error deleting RequestDS data: " + error.message);
    }
  };

  export const getAllRequestWPByUserId = async (userId: string) => {
    try {
      const requestsWP = await RequestWP.find({ userId }).exec();
      return requestsWP; // Return all RequestWP documents for the user
    } catch (error: any) {
      throw new Error("Error fetching RequestWP data: " + error.message);
    }
  };
  
  export const getAllRequestAIByUserId = async (userId: string) => {
    try {
      const requestsAI = await RequestAI.find({ userId }).exec();
      return requestsAI; // Return all RequestAI documents for the user
    } catch (error: any) {
      throw new Error("Error fetching RequestAI data: " + error.message);
    }
  };
  

  export const getAllRequestDSByUserId = async (userId: string) => {
    try {
      const requestsDS = await RequestDS.find({ userId }).exec();
      return requestsDS; // Return all RequestDS documents for the user
    } catch (error: any) {
      throw new Error("Error fetching RequestDS data: " + error.message);
    }
  };