import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Gilbert Hasiholan Sibuea',
  title: 'Gilbert Hasiholan Sibuea - Full Stack Developer & Software Engineer',
  description: 'Gilbert Hasiholan Sibuea is a passionate Full Stack Developer and Software Engineer specializing in modern web technologies, mobile applications, and innovative digital solutions.',
  url: 'https://gilbersibuea.com', // Update with your actual domain
  ogImage: '/profile.png',
  links: {
    twitter: 'https://twitter.com/gilbert_dev', // Update with actual handle
    github: 'https://github.com/ILMNX', // Update with actual profile
    linkedin: 'https://www.linkedin.com/in/gilbert-sibuea-93b524246/', // Update with actual profile
  },
  creator: 'Gilbert Hasiholan Sibuea',
  keywords: [
    'Gilbert Hasiholan Sibuea',
    'Full Stack Developer',
    'Software Engineer',
    'Web Developer',
    'React Developer',
    'Next.js',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Frontend Developer',
    'Backend Developer',
    'Portfolio',
    'Software Development',
    'Web Applications',
    'Mobile Development',
    'API Development',
    'Database Design',
    'UI/UX Implementation',
    'Responsive Design',
    'Modern Web Technologies'
  ]
}

export function generateMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
} = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const metaDescription = description || siteConfig.description

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [image],
      creator: '@gilbert_dev', // Update with actual Twitter handle
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

// Structured data for the homepage
export const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gilbert Hasiholan Sibuea',
  jobTitle: 'Full Stack Developer',
  description: 'Passionate Full Stack Developer and Software Engineer specializing in modern web technologies',
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
  ],
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Full Stack Development',
    'Software Engineering',
    'Web Development',
    'Mobile Development',
    'API Development',
    'Database Design',
    'UI/UX Implementation'
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'Universitas Lampung' // Update with actual education
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance Developer' // Update with current employment
  }
}

// Website structured data
export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    '@type': 'Person',
    name: siteConfig.creator
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/projects?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}
