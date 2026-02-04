import React from "react";

interface Project {
  id: number;
  title: string;
  description: string;
}

// Force dynamic rendering to avoid build-time fetch
export const dynamic = 'force-dynamic';

const ProjectsPage = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  let projectsData: Project[] = [];
  try {
    // Use relative URL that will be proxied by nginx
    const response = await fetch(`${apiUrl}/projects`, {
      cache: 'no-store', // Ensure fresh data
    });
    
    if (response.ok) {
      projectsData = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Continue with empty array if fetch fails
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      {projectsData && projectsData.length > 0 ? (
        projectsData.map((project: Project) => (
          <div key={project.id}>{project.title}</div>
        ))
      ) : (
        <div>No projects found</div>
      )}
    </div>
  );
}

export default ProjectsPage;
