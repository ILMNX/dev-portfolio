import { ProjectEditClient } from './client';

// Using directly generated types from Next.js
export default async function ProjectEditPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Extract the id from params
  const { id } = params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}