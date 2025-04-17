// Server component to properly unwrap params
import { ProjectEditClient } from './client';

// We need to make the component async to await params
export default async function ProjectEditPage({ params }: { params: { id: string } }) {
  // Await the params object to extract the id
  const { id } = await params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}