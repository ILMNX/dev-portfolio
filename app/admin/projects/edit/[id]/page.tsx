// Server component to properly unwrap params
import { ProjectEditClient } from './client';

// Updated interface to match Next.js requirements
export default function ProjectEditPage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Extract the id from params
  const { id } = params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}