import mongoose, { Schema, Document } from "mongoose";

// Define the RequestAI interface
interface IRequestAI extends Document {
  content: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
  status: string; // Default: 'ongoing'
  remarks: string | ""; // Default: null
  link: string; // Required for RequestAI
}

// Define the schema for RequestAI
const RequestAISchema: Schema = new Schema({
  content: { type: String, required: true },
  project: {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
  },
  userId: { type: String, required: true },
  status: { type: String, default: "ongoing" }, // Default: "ongoing"
  remarks: { type: String, default: "" }, // Default: null
  link: { type: String, required: true }, // Required for RequestAI
});

// Create and export the RequestAI model
const RequestAI =
  mongoose.models.RequestAI || mongoose.model<IRequestAI>("RequestAI", RequestAISchema);

export default RequestAI;
