/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FaEdit } from "react-icons/fa";
import ProfileUpdateForm from "./profileUpdateForm";
import axios from "@/lib/axios";

interface ProfileTopSectionProps {
  profile: {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    businessInterest: string[];
    location: string;
    socialLinks: {
      instagram?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    };
  };
}

const ProfileTopSection: React.FC<ProfileTopSectionProps> = ({ profile }) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); // State to manage dialog visibility
  
  const handleSubmit = async (formData: any) => {
    try {
      // Make an API call to update the profile
      const response = await axios.patch("/profile/update", formData);

      if (response.status === 200) {
        window.location.reload(); // Refresh the page to see updated data
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="flex flex-col  h-[66.67%] rounded-lg">
      <div className="flex justify-between items-center">
      <div className="text-3xl text-slate-50 font-bold">My Profile</div>
        <div className="flex gap-4">
          {/* UPDATE BUTTON */}
          <Dialog open={isUpdateOpen} onOpenChange={(open: boolean) => setIsUpdateOpen(open)}>
            <DialogTrigger asChild>
              <button className="bg-transparent border border-violet-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-violet-500 hover:text-white active:scale-95 flex items-center shadow-md">
                <FaEdit className="mr-2" />
                Edit
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="py-4">
              <ProfileUpdateForm profile={profile} handleSubmit={handleSubmit} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="my-2" />
      
    </div>
  );
};

export default ProfileTopSection;
