// Server component to properly unwrap params
import { ProjectEditClient } from './client';

// Correct page component definition for Next.js App Router
export default function ProjectEditPage({
  params,
}: {
  params: { id: string };
}) {
  // Extract the id from params
  const { id } = params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}