import React from 'react';
import ProjectGrid1 from '@/components/projectSummaryArea/projectgrid1';
import ProjectGrid2 from '@/components/projectSummaryArea/projectgrid2';
import TopSection from '@/components/TopSection';

const ProjectSummary = () => {
  return (
    <div className="max-w-screen-2xl mx-auto w-full p-10 -mt-8">
      <TopSection />
      <div className="grid grid-cols-4 gap-6 -mt-8 ">
        {/* Left: ProjectGrid1 takes 1/4 width */}
        <div className="col-span-1 ">
          <ProjectGrid1 />
        </div>
        {/* Right: ProjectGrid2 takes 3/4 width */}
        <div className="col-span-3 ">
          <ProjectGrid2 />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
