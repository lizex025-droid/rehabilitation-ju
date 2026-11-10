import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/seo';

type JsonLdData = Record<string, unknown>;

export function StructuredData({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** Real navigation hierarchy, not artificially generated keyword breadcrumbs. */
export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  if (items.length < 2) return null;
  return <StructuredData data={{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }} />;
}

export const organizationJsonLd: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Al Nokhba',
  url: SITE_URL,
  logo: absoluteUrl('/al-nokhba-logo.png'),
  description: 'مبادرة طلابية مستقلة تساعد طلبة كلية علوم التأهيل في الجامعة الأردنية.',
};

export const websiteJsonLd: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  // Google considers aliases in order if it cannot confidently display the main name.
  // The exact pages.dev hostname is a last-resort fallback instead of its parent brand.
  alternateName: ['النخبة علوم التأهيل', 'النخبة لعلوم التأهيل', 'Al Nokhba', 'rehabilitation-ju.pages.dev'],
  url: SITE_URL,
  inLanguage: 'ar-JO',
  publisher: { '@id': `${SITE_URL}/#organization` },
};
