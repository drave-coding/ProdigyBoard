/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import ProjectDetailsGrid1 from '@/components/projectDetailsArea/projectDetailsgrid1';
import ProjectDetailsGrid2 from '@/components/projectDetailsArea/projectDetailsgrid2';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios'; // Use your custom Axios instance
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUser } from "@clerk/nextjs"; // Import useUser
;
import ProjectTopSection from '@/components/projectDetailsArea/projectTopSection';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const [project, setProject] = useState<any>(null); // State to hold the project data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const { user } = useUser(); // Get authenticated user

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/projectDetails/${id}`); // Make sure this matches your API route
        const projectData = response.data;
        
        // Check if the userId from the project matches the authenticated user's ID
        if (projectData.userId !== user?.id) {
          setProject(null); // Set project to null if not authorized
        } else {
          setProject(projectData); // Set project data if authorized
        }
      } catch (err: any) {
        
        console.error("Failed to fetch project data." + err);

      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    if (user) {
      fetchProject(); // Call fetchProject only if user is available
    }
  }, [id, user]); // Add `user` as a dependency

  // Display loading state
  if (loading) {
    return <div className='col-span-4 bg-slate-50 text-center w-full  p-4  rounded-lg mt-4'>Loading...</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pl-10 pr-10 pb-10 pt-3">
       
       
      {project ? (
        <>
        <ProjectTopSection projectId={id} />
          <ProjectDetailsGrid1 project={{ projectName: project.projectName, description: project.description }} />
          <ProjectDetailsGrid2 
            project={{
              industry: project.industry,
              transaction: project.transaction,
              dateRange: project.dateRange,
              competitors: project.competitors,
              investment: project.investment,
              socialLinks: project.socialLinks,
              userId: project.userId,
              _id:project._id,
              
              
            }} 
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="max-w-sm mx-auto shadow-lg -mt-72">
            <CardHeader>
              <h1 className=" text-xl font-bold text-center">
                Not Found
              </h1>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
              This Project is not available to you or it doesn&apos;t exist at all.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
