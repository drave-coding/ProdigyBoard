import mongoose, { Schema, Document } from "mongoose";

// Define the RequestWP interface
interface IRequestWP extends Document {
  content: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
  status: string; // Default: 'ongoing'
  remarks: string | ""; // Default: null
  link: string; // Required for RequestWP
}

// Define the schema for RequestWP
const RequestWPSchema: Schema = new Schema({
  content: { type: String, required: true },
  project: {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
  },
  userId: { type: String, required: true },
  status: { type: String, default: "ongoing" }, // Default: "ongoing"
  remarks: { type: String, default: "" }, // Default: null
  link: { type: String, required: true }, // Required for RequestWP
});

// Create and export the RequestWP model
const RequestWP =
  mongoose.models.RequestWP || mongoose.model<IRequestWP>("RequestWP", RequestWPSchema);

export default RequestWP;
