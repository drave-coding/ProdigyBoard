import Task from "@/models/Task";

export const storeTaskData = async (taskData: any) => {
  console.log("Task Data saved"); 
  // Log the task data for debugging
  try {
    // Create a new Task document
    const task = new Task({
      taskName: taskData.taskName,
      content: taskData.content,
      status: taskData.status,
      project: {
        projectId: taskData.project.projectId,
        projectName: taskData.project.projectName,
      }, // Update project field structure
      userId: taskData.userId,
      deadline: taskData.deadline,
    });
    // Save the task in the database
    await task.save();
    return task; // Return the stored task
  } catch (error: any) {
    throw new Error("Error storing task data: " + error.message);
  }
};

export const updateTaskData = async (taskId: string, updatedData: any) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true }).exec();
      return updatedTask; // Return the updated task data
    } catch (error: any) {
      throw new Error("Error updating task data: " + error.message);
    }
  };

  export const deleteTaskData = async (taskId: string) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId).exec();
      return deletedTask; // Return the deleted task
    } catch (error: any) {
      throw new Error("Error deleting task data: " + error.message);
    }
  };

  export const getAllTasksByUserId = async (userId: string) => {
    try {
      const tasks = await Task.find({ userId }).exec();
      return tasks; // Return all tasks for the given user
    } catch (error: any) {
      throw new Error("Error fetching tasks: " + error.message);
    }
  };

  export const getAllTasksByUserIdAndProjectId = async (
    userId: string,
    projectId: string
  ) => {
    try {
      const tasks = await Task.find({
        userId,
        "project.projectId": projectId,
      }).exec();
      return tasks; // Return all tasks for the given user and project
    } catch (error: any) {
      throw new Error("Error fetching tasks: " + error.message);
    }
  };
  