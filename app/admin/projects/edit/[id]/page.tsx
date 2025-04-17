import { ProjectEditClient } from './client';

// Define proper types for Next.js App Router params
type PageProps = {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ProjectEditPage({ params }: PageProps) {
  // Extract the id from params
  const { id } = params;
  
  // Pass the extracted id to the client component
  return <ProjectEditClient id={id} />;
}