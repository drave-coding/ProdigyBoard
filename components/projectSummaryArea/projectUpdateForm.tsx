'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Input } from '../ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { Button } from '../ui/button';
 // Adjust this import path as needed
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../extraComponents/DatePickerDemo';


interface ProjectUpdateFormProps {
  initialData: {
    projectName: string;
    description: string;
    industry: string;
    transaction: string;
    investment: string;
    competitors: { name: string; link: string }[];
    socialLinks: {
      instagram: string;
      facebook: string;
      linkedin: string;
      drive: string;
    };
    dateRange: DateRange | undefined;
  };
  projectId: string;
  handleSubmit: (formData: any, projectId: string) => void;
}

const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({
  initialData,
  projectId,
  handleSubmit,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialData.dateRange);
  const [competitors, setCompetitors] = useState(initialData.competitors);
  const [investment, setInvestment] = useState(initialData.investment);
  const [socialLinks, setSocialLinks] = useState(initialData.socialLinks);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompetitorChange = (index: number, field: 'name' | 'link', value: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index][field] = value;
    setCompetitors(newCompetitors);
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', link: '' }]);
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length === 1) {
      setCompetitors([]); // Prevent empty competitors array
    } else {
      const newCompetitors = competitors.filter((_, i) => i !== index);
      setCompetitors(newCompetitors);
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const isSocialLinkValid = (url: string | null | undefined, prefix: string) =>
    !url || url === '' || url.startsWith(prefix);
  

  const isFormValid = () => {
    const isCompetitorFilled = competitors.every(comp => comp.name && comp.link);
    const isCompetitorLinkValid = competitors.every(comp => comp.link.startsWith('https://') || comp.link.startsWith('http://'));
    const isDateRangeValid = dateRange?.from && dateRange?.to && dateRange.from <= dateRange.to;
    const areSocialLinksValid =
      isSocialLinkValid(socialLinks.instagram, 'https://www.instagram.com') &&
      isSocialLinkValid(socialLinks.facebook, 'https://www.facebook.com') &&
      isSocialLinkValid(socialLinks.linkedin, 'https://www.linkedin.com') &&
      isSocialLinkValid(socialLinks.drive, 'https://drive.google.com');

    return (
      formData.projectName &&
      formData.description &&
      formData.industry &&
      formData.transaction &&
      isDateRangeValid &&
      isCompetitorFilled &&
      isCompetitorLinkValid &&
      areSocialLinksValid
    );
  };

  const onSubmit = async () => {
    const formValues = {
      ...formData,
      dateRange,
      competitors,
      investment,
      socialLinks,
    };

    // Handle the submit logic
    await handleSubmit(formValues, projectId);

    
  };

  return (
    <form className="mt-4 space-y-4">
      <div className="max-h-[430px] overflow-y-auto"> 
        {/* Project Name */}
        <div className="flex flex-col">
          <label htmlFor="projectName" className="mb-1">Project Name</label>
          <Input
            id="projectName"
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1">Description</label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Industry and Transaction Type */}
        <div className="flex space-x-4">
          <div className="flex flex-col w-full">
            <label htmlFor="industry" className="mb-1">Industry</label>
            <Select
              value={formData.industry}
              onValueChange={(value: string) => handleChange({ target: { name: 'industry', value } } as React.ChangeEvent<HTMLSelectElement>)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="transaction" className="mb-1">Transaction Type</label>
            <Select
              value={formData.transaction}
              onValueChange={(value: string) => handleChange({ target: { name: 'transaction', value } } as React.ChangeEvent<HTMLSelectElement>)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2B">B2B</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
                <SelectItem value="C2C">C2C</SelectItem>
                <SelectItem value="Transaction">Transaction</SelectItem>
                <SelectItem value="Subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Duration and Investment Section */}
        <div className="flex space-x-4">
          <div className="flex flex-col w-full">
            <label className="mb-1">Project Duration</label>
            <DatePickerWithRange
              className="w-full"
              selectedRange={dateRange}
              onDateChange={(range: DateRange) => setDateRange(range)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="investment" className="mb-1">Investment</label>
            <Input
              id="investment"
              name="investment"
              placeholder="Investment Amount"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Competitors Section */}
        <div className="flex flex-col border border-gray-300 rounded-md p-4 mt-4">
          <label className="mb-1">Competitors</label>
          <div className={`flex flex-col space-y-2 ${competitors.length > 2 ? 'max-h-28 overflow-y-auto' : ''}`}>
            {competitors.map((competitor, index) => (
              <div key={index} className="flex space-x-4">
                <Input
                  id={`competitorName${index}`}
                  name={`competitorName${index}`}
                  placeholder="Competitor Name"
                  value={competitor.name}
                  onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  id={`competitorLink${index}`}
                  name={`competitorLink${index}`}
                  placeholder="Competitor Link"
                  value={competitor.link}
                  onChange={(e) => handleCompetitorChange(index, 'link', e.target.value)}
                  required
                />
                <Button variant="destructive" onClick={() => removeCompetitor(index)}>
                  <FaMinus />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addCompetitor} variant="secondary" className="mt-2">
            <FaPlus />
            Add Competitor
          </Button>
        </div>

        {/* Social Links Section */}
        <div className="flex flex-col">
          <label className="mb-1">Social Links</label>
          <div className="flex flex-col space-y-2">
            <Input
              id="instagram"
              name="instagram"
              placeholder="Instagram URL"
              value={socialLinks.instagram}
              onChange={handleSocialLinkChange}
              
            />
            <Input
              id="facebook"
              name="facebook"
              placeholder="Facebook URL"
              value={socialLinks.facebook}
              onChange={handleSocialLinkChange}
              
            />
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={socialLinks.linkedin}
              onChange={handleSocialLinkChange}
              
            />
            <Input
              id="drive"
              name="drive"
              placeholder="Google Drive URL"
              value={socialLinks.drive}
              onChange={handleSocialLinkChange}
              
            />
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={!isFormValid()}
        className="w-full mt-4"
      >
        Update Project
      </Button>
    </form>
  );
};

export { ProjectUpdateForm };
