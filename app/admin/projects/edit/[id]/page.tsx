import { ProjectEditClient } from './client';
import { JSX } from 'react';

// Correct pattern for Next.js 15+ Server Components
export default async function ProjectEditPage({
  params,
}: {
  params: { id: string }; // Params are directly available, not a Promise
}): Promise<JSX.Element> {
  const { id } = params; // Destructure id directly from params
  
  return <ProjectEditClient id={id} />;
}