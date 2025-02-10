import mongoose, { Schema, Document } from "mongoose";

// Define the Audience interface
interface IAudience extends Document {
  title: string;
  rating: string; // Could be a numeric type if required for calculations
  reviews: string;
  category: string;
  address: string;
  website: string;
  phoneNumber: string;
  project: {
    projectId: string;
    projectName: string;
  }; // Project field containing ID and Name
  userId: string; // ID of the user who added this data
}

// Define the schema for audience
const AudienceSchema: Schema = new Schema({
  title: { type: String, required: true }, // Title of the place/restaurant
  rating: { type: String, required: true, default: "N/A" }, // Rating of the place (default is N/A)
  reviews: { type: String, required: true }, // Number of reviews
  category: { type: String, required: true }, // Category (e.g., Lebanese restaurant)
  address: { type: String, required: true }, // Address of the place
  website: { type: String, required: true }, // Website URL
  phoneNumber: { type: String, required: true }, // Contact phone number
  project: {
    projectId: { type: String, required: true }, // Associated project ID
    projectName: { type: String, required: true }, // Associated project name
  }, // Project field
  userId: { type: String, required: true }, // Creator's user ID
});

// Create and export the Audience model
const Audience =
  mongoose.models.Audience ||
  mongoose.model<IAudience>("Audience", AudienceSchema);

export default Audience;
