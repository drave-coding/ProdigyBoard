import mongoose, { Schema, Document } from "mongoose";

// Define the RequestDS interface
interface IRequestDS extends Document {
  content: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
  status: string; // Default: 'ongoing'
  remarks: string | ""; // Default: null
}

// Define the schema for RequestDS
const RequestDSSchema: Schema = new Schema({
  content: { type: String, required: true },
  project: {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
  },
  userId: { type: String, required: true },
  status: { type: String, default: "ongoing" }, // Default: "ongoing"
  remarks: { type: String, default: "" }, // Default: null
});

// Create and export the RequestDS model
const RequestDS =
  mongoose.models.RequestDS || mongoose.model<IRequestDS>("RequestDS", RequestDSSchema);

export default RequestDS;
