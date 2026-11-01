import type { Metadata } from 'next';
import { SITE_URL, socialMetadata } from '@/lib/seo';
import { StructuredData, organizationJsonLd, websiteJsonLd } from '@/components/StructuredData';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RevealObserver } from '@/components/Reveal';
import { ScrollToPageStart } from '@/components/ScrollToPageStart';
import { ImageCacheRegistration } from '@/components/ImageCacheRegistration';
import './globals.css';
import './help-options.css';
import './card-stagger.css';
import './image-loading.css';
import './legal.css';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), verification: { google: 'jXnpNnNFDkcVxrp8QMmi5jqz5IqrfE1KaoTZ2bSbqBA' }, ...socialMetadata('النخبة علوم التأهيل', 'موقع النخبة الأكاديمي لطلبة كلية علوم التأهيل في الجامعة الأردنية.', '/'), title: { default: 'النخبة علوم التأهيل', template: '%s | النخبة علوم التأهيل' }, description: 'موقع النخبة الأكاديمي لطلبة كلية علوم التأهيل في الجامعة الأردنية.', robots: { index: true, follow: true }, applicationName: 'rehab ju', appleWebApp: { capable: true, title: 'rehab ju', statusBarStyle: 'default' }, manifest: '/manifest.webmanifest', icons: { icon: [{ url: '/al-nokhba-logo.png', type: 'image/png' }], apple: [{ url: '/al-nokhba-logo.png', type: 'image/png' }] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ar" dir="rtl"><head><link rel="dns-prefetch" href="https://pub-7353766376b14b8fa88b7a2a55859c04.r2.dev" /><link rel="preload" as="image" type="image/webp" href="/al-nokhba-logo.webp?v=20261101" /></head><body><StructuredData data={organizationJsonLd} /><StructuredData data={websiteJsonLd} /><ImageCacheRegistration /><ScrollToPageStart /><RevealObserver /><Navbar /><main id="main-content">{children}</main><Footer /></body></html>; }
