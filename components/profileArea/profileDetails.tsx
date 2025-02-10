/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios"; // Import your axios instance
import ProfileTopSection from "./profileTopSection"; // Import ProfileTopSection
import { Button } from "@/components/ui/button"; // Updated Button import
import { Linkedin, Twitter, Instagram } from "lucide-react"; // Icon library for social media icons
import { UserButton } from "@clerk/nextjs";

interface ProfileDetailsProps {
  userId: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userId }) => {
  const [profile, setProfile] = useState<any>(null); // To store fetched profile data
  const [loading, setLoading] = useState<boolean>(true); // To show loading status
  const [error, setError] = useState<string | null>(null); // To show any errors

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          throw new Error("User ID is required.");
        }

        const response = await axios.post("/profile/details", { userId });
        setProfile(response.data); // Set profile data
        setError(null); // Clear any previous errors
      } catch (err: any) {
        
        console.error("Error fetching profile:", err.message);
        setError("Failed to fetch profile details.");
        setProfile(null); // Clear profile data on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfile();
  }, [userId]); // Refetch if userId changes

  if (loading) {
    return <div className="col-span-4 bg-slate-50 text-center w-full  p-4  rounded-lg">Loading profile details...</div>;
  }

  if (error) {
    return <div className="col-span-4 bg-slate-50 text-center w-full  p-4  rounded-lg">{error}</div>;
  }

  if (!profile) {
    return <div className="col-span-4 bg-slate-50 text-center w-full  p-4  rounded-lg">No profile details available.</div>;
  }

  // Extract first name and last name
  const nameParts = profile.name.split(" ");
  const lastName = nameParts.pop() || "";
  const firstName = nameParts.join(" ");

  const location = profile.location || "Not Specified";

  return (
    <div>
      <div className="mt-3 max-w-[1400px] rounded-xl mx-auto">
        <ProfileTopSection profile={profile} />
      </div>

      <div className="max-h-[575px] overflow-y-auto p-4 max-w-[1200px] rounded-xl mx-auto bg-slate-50">
        {/* Profile Page Section */}
        <div className=" border border-gray-300 rounded-lg p-6 mb-4 max-w-[900px] mx-auto flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="w-28 h-24">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-28 h-28 rounded-full", // Customize avatar size
                },
              }}
            />
          </div>

          {/* Profile Details */}
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.location || "Location not provided"}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          {/* Personal Information Section */}
          <div className="border border-gray-300 rounded-lg p-6 max-w-[900px] mx-auto">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="flex flex-col space-y-4">
              {/* First Name and Last Name */}
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <p className="text-gray-700">{firstName}</p>
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <p className="text-gray-700">{lastName}</p>
                </div>
              </div>

              {/* Email and Phone Number */}
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-700">{profile.email}</p>
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <p className="text-gray-700">{profile.phoneNumber}</p>
                </div>
              </div>

              {/* Business Interest and Location */}
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Business Interest
                  </label>
                  <p className="text-gray-700">{profile.businessInterest.join(", ")}</p>
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <p className="text-gray-700">{location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="border border-gray-300 rounded-lg p-6 max-w-[900px] mx-auto">
            <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
            <div className="flex space-x-4">
              {profile.socialLinks.linkedin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                </Button>
              )}
              {profile.socialLinks.twitter && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter size={16} />
                    <span>Twitter</span>
                  </a>
                </Button>
              )}
              {profile.socialLinks.instagram && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram size={16} />
                    <span>Instagram</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
