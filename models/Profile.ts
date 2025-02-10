import mongoose, { Schema, Document } from 'mongoose';

interface IProfile extends Document {
  userId: string; // Added userId to associate with the user
  name: string;
  email: string;
  phoneNumber: number;
  businessInterest: string[]; // Array of business interests
  location: string;
  socialLinks: {        // Social links fields (can be null)
    instagram: string | null;
    linkedin: string | null;
    twitter: string | null;
  };
}

const ProfileSchema: Schema = new Schema({
  userId: { type: String, required: true },  // userId field to associate with the user
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  businessInterest: { type: [String], required: true }, // Array of business interests
  location: { type: String, default: 'Not Specified' },  // Default to 'Not Specified'
  socialLinks: {                                // Social links fields (can be null)
    instagram: { type: String, default: null },
    linkedin: { type: String, default: null },
    twitter: { type: String, default: null },
  },
});

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
