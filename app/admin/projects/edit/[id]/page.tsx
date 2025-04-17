import { ProjectEditClient } from './client';
import { JSX } from 'react';

// Explicitly type params as a Promise based on the error message
export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Type params as a Promise
}): Promise<JSX.Element> {
  // Await the params promise to resolve it
  const resolvedParams = await params;
  const { id } = resolvedParams; // Destructure id from the resolved params
  
  return <ProjectEditClient id={id} />;
}