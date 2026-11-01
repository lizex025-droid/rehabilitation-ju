import type { Metadata } from 'next';

export const SITE_URL = 'https://rehabilitation-ju.pages.dev';
export const SITE_NAME = 'النخبة — علوم التأهيل';
export const SOCIAL_IMAGE = `${SITE_URL}/al-nokhba-orbital-learning-board-v2.png`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Keep one preferred domain and a page-specific canonical across both Pages projects. */
export function socialMetadata(title: string, description: string, path: string): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter'> {
  return {
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: 'ar_JO',
      type: 'website',
      images: [{ url: SOCIAL_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}
