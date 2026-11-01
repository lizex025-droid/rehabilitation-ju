import type { MetadataRoute } from 'next';
import { pages } from '@/lib/content';
import { allCourses, specialtyMaterialSets } from '@/lib/specialtyMaterials';
import { absoluteUrl } from '@/lib/seo';

/** Generated at build time for the Cloudflare Pages static export. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>([
    '/',
    '/install',
    '/privacy',
    '/terms',
    ...Object.keys(pages).map(slug => `/${slug}`),
    ...Object.keys(specialtyMaterialSets).map(slug => `/${slug}`),
    ...allCourses().map(course => `/courses/${course.id}`),
    ...['physical-therapy', 'occupational-therapy', 'prosthetics-orthotics', 'hearing-speech'].map(specialty => `/study-plans/${specialty}`),
  ]);

  // Do not invent modification dates; they must reflect actual content changes.
  return [...paths].sort().map(path => ({ url: absoluteUrl(path) }));
}
