import { ProjectEditClient } from './client';

interface PageParams {
  id: string;
}

// Using Next.js 14 async component pattern
export default async function ProjectEditPage({
  params,
}: {
  params: PageParams;
}) {
  // Extract the id from params
  const { id } = params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}