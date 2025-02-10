// TopSection.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import ProjectForm from './projectSummaryArea/projectForm';
import axios from '@/lib/axios'; // Import your Axios instance
import { useRouter } from 'next/navigation'; // Import useRouter

const TopSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Get user info
  const router = useRouter(); // Initialize useRouter

  const handleFormSubmit = async (formData: any) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        if (!user) {
          throw new Error("User not authenticated.");
        }

        console.log('Submitting form:');
        // Include userId in the formData to send to the API
        const response = await axios.post('/projects', {
          ...formData,
          userId: user.id // Pass user ID from Clerk
        });

        // Redirect to details page with the newly created project ID
        router.push(`/projects/${response.data._id}`);
        
        break; // Exit the loop if the request is successful
      } catch (error: any) {
        if (error.response && error.response.status === 504) {
          attempt++;
          console.error(`Attempt ${attempt} failed with 504. Retrying...`);
          if (attempt >= maxRetries) {
            console.error('Max retries reached. Could not submit form.');
            alert('Failed to submit form after multiple attempts. Please try again later.');
          }
        } else {
          console.error('Error submitting form:');
          alert('An error occurred while submitting the form. Please try again.');
          break; // Exit the loop if the error is not 504
        }
      } finally {
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-[66.67%] rounded-lg  pb-12">
      <div className="flex justify-between items-end">
        <div></div>
        <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
          <DialogTrigger asChild>
            <button className="bg-transparent border border-purple-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-purple-500 hover:text-white active:scale-95 flex items-center shadow-md">
              <FaPlus className="mr-2" />
              Add Project
            </button>
          </DialogTrigger>

          {/* Dialog Content */}
          <DialogContent className="sm:max-w-[700px] -mt-[30px]">
            <DialogHeader>
              <DialogTitle>Create or Add Project</DialogTitle>
            </DialogHeader>
           
            <ProjectForm handleSubmit={handleFormSubmit} />
           
            
          </DialogContent>
        </Dialog>
      </div>

      <div className="my-2" />
      {/* White Line */}
      <div className="h-1 bg-white border-t border-gray-300" />
    </div>
  );
};

export default TopSection;
