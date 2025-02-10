"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


interface RequestAI {
  _id: string;
  content: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
  status: string;
  remarks: string | null;
  link: string;
}

const AIContent: React.FC = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState<RequestAI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<RequestAI | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/requests/AI/get", {
        userId: user.id,
      });
      if (response.data && response.data.length > 0) {
        setRequests(response.data);
      } else {
        setRequests([]); // Ensure an empty array when there are no requests
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error.response?.data || error.message);
      

      if (error.response?.status === 404) {
      setRequests([]); // Set requests to empty array
      setError("No requests found.");
    } else {
      setError(error.message || "Failed to fetch requests");
    }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  if (loading)
    return (
      <div className="flex justify-center items-center text-lg text-gray-500">
        <p>Updating requests...</p>
      </div>
    );

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  const handleDeleteRequest = (request: RequestAI) => {
    setDeleteRequest(request);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deleteRequest) return;
      await axios.delete("/requests/AI/del", {
        data: { requestId: deleteRequest._id },
      });
      setRequests(requests.filter((req) => req._id !== deleteRequest._id));
      setDeleteRequest(null);
    } catch (error: any) {
      console.error("Error deleting request:", error.response?.data || error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "stopped":
        return "bg-red-500 text-white";
      case "ongoing":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    
    <div className="max-w-[1200px] bg-slate-50 rounded-lg p-4 -mt-8 max-h-[500px] overflow-y-auto">
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-white p-4 rounded-lg shadow-lg space-y-4 relative"
            >
              {/* Positioned top-right status and trash button */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Badge className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRequest(request)}
                >
                  <FaTrashAlt className="h-5 w-5 text-destructive" />
                </Button>
              </div>

              {/* Content section with padding to avoid overlap */}
              <div className="space-y-2 pr-[107px]"> {/* Added pr-10 to give right padding */}
                <h3 className="text-xl font-medium">{request.content}</h3>
                <div>
                  <strong>Link:</strong>{" "}
                  <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    Open Sheet
                  </a>
                </div>
                <div>
                  <strong>Project Name:</strong> {request.project.projectName}
                </div>

                {request.remarks && (
                  <div>
                    <strong>Remarks:</strong> {request.remarks}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">Wait Till We Load....</p>
        )}
      </div>

      {/* Task Delete Dialog */}
      {deleteRequest && (
        <Dialog open={true} onOpenChange={() => setDeleteRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Request</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the request &quot;{deleteRequest.content}&quot;?
            </p>
            <DialogFooter>
              <Button onClick={() => setDeleteRequest(null)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AIContent;
