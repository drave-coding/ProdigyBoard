import mongoose, { Schema, Document } from 'mongoose';

// Define the Task interface
interface ITask extends Document {
  taskName: string;
  content: string;
  status: string; // Could be enums like 'pending', 'in-progress', 'completed', etc.
  project: {
    projectId: string;
    projectName: string;
  }; // Project field containing ID and Name
  userId: string; // ID of the user who created the task
  deadline: Date; // Task deadline
} 

// Define the schema for tasks
const TaskSchema: Schema = new Schema({
  taskName: { type: String, required: true }, // Task Name
  content: { type: String, required: true },  // Content/Description
  status: { type: String, required: true, default: "pending" }, // Status (default is pending)
  project: {
    projectId: { type: String, required: true }, // Associated project ID
    projectName: { type: String, required: true }, // Associated project Name
  }, // Project field containing ID and Name
  userId: { type: String, required: true }, // Creator's user ID
  deadline: { type: Date, required: true }, // Deadline for the task
});

// Create and export the Task model
const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
