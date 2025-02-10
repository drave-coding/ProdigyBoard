"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "../ui/multi-select";

interface ProfileUpdateFormProps {
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
  handleSubmit: (formData: any) => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ profile, handleSubmit }) => {
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");
  const [businessInterest, setBusinessInterest] = useState<string[]>(profile.businessInterest || []);
  const [location, setLocation] = useState(profile.location || "");
  const [socialLinks, setSocialLinks] = useState({
    instagram: profile.socialLinks.instagram || "",
    linkedin: profile.socialLinks.linkedin || "",
    twitter: profile.socialLinks.twitter || "",
  });

  const businessInterestOptions = [
    { label: "Technology", value: "Technology" },
    { label: "Finance", value: "Finance" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Education", value: "Education" },
    { label: "Retail", value: "Retail" },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      userId: profile.userId,
      name,
      email,
      phoneNumber: Number(phoneNumber),
      businessInterest,
      location,
      socialLinks: {
        instagram: socialLinks.instagram || null,
        linkedin: socialLinks.linkedin || null,
        twitter: socialLinks.twitter || null,
      },
    };
    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Business Interest</label>
          <MultiSelect
            options={businessInterestOptions}
            onValueChange={setBusinessInterest}
            defaultValue={businessInterest}
            placeholder="Select business interests"
            variant="inverted"
            animation={2}
            maxCount={3}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
          />
        </div>

        <Separator />

        <div className="pt-4">
          <label className="block text-sm font-medium">Social Links</label>
          <div className="space-y-4 pt-2 pb-4">
            <Input
              type="url"
              value={socialLinks.instagram}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, instagram: e.target.value })
              }
              placeholder="Instagram URL"
            />
            <Input
              type="url"
              value={socialLinks.linkedin}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, linkedin: e.target.value })
              }
              placeholder="LinkedIn URL"
            />
            <Input
              type="url"
              value={socialLinks.twitter}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, twitter: e.target.value })
              }
              placeholder="Twitter URL"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Profile
      </Button>
    </form>
  );
};

export default ProfileUpdateForm;
