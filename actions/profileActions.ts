// actions/profileActions.ts
import Profile from "@/models/Profile";

export const storeProfileData = async (profileData: any) => {
  console.log("Profile Data Saved"); // Log the profile data for debugging

  try {
    const profile = new Profile({
      userId: profileData.userId, // Include userId
      name: profileData.name,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      businessInterest: profileData.businessInterest,
      location: profileData.location || 'Not Specified', // Default location if not provided
      socialLinks: {
        instagram: profileData.socialLinks?.instagram || null, // Ensure accessing nested objects
        linkedin: profileData.socialLinks?.linkedin || null,
        twitter: profileData.socialLinks?.twitter || null,
      },
    });
    await profile.save();
    return profile;
  } catch (error: any) {
    throw new Error("Error storing profile data: " + error.message);
  }
};


export const getProfileDataByUserId = async (userId: string) => {
  try {
    const profile = await Profile.findOne({ userId }).exec(); // Find profile by userId
    return profile; // Return the profile data
  } catch (error: any) {
    throw new Error("Error fetching profile data by userId: " + error.message);
  }
};

// New delete function to delete the profile
export const deleteProfileData = async (userId: string) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId }).exec();
    return profile; // Return the deleted profile
  } catch (error: any) {
    throw new Error("Error deleting profile data: " + error.message);
  }
};

// Update profile data
export const updateProfileData = async (userId: string, updatedData: any) => {
  try {
    // Update the profile in the database
    const updatedProfile = await Profile.findOneAndUpdate({ userId }, updatedData, { new: true }).exec();
    return updatedProfile; // Return the updated profile data
  } catch (error: any) {
    throw new Error("Error updating profile data: " + error.message);
  }
};
