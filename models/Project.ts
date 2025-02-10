import mongoose, { Schema, Document } from 'mongoose';

interface IProject extends Document {
  userId: string;
  projectName: string;
  description: string;
  industry: string;
  transaction: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  competitors: {
    name: string;
    link: string;
  }[];
  investment: number; // New investment field
  socialLinks: {      // Updated social links fields (required but can be null)
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    drive: string | null;
  };
}

const ProjectSchema: Schema = new Schema({
  userId: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  transaction: { type: String, required: true },
  dateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  competitors: [
    {
      name: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
  investment: { type: Number, required: true }, // New investment field
  socialLinks: {                                // Updated social links fields
    instagram: { type: String, default: null },
    facebook: { type: String, default: null },
    linkedin: { type: String, default: null },
    drive: { type: String, default: null },
  },
});

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
