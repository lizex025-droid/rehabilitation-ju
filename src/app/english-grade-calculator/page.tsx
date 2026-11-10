import type { Metadata } from 'next';
import { socialMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/StructuredData';
import { EnglishGradeCalculator } from '@/components/EnglishGradeCalculator';

const title = 'حاسبة علامة اللغة الإنجليزية في الجامعة الأردنية | النخبة';
const description = 'حاسبة علامة الإنجليزي في الجامعة الأردنية: التصنيفي الأول، علامات المستويات الثلاثة، التصنيفي النهائي، مكافأة الانتقال، والتقدير المتوقع.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  ...socialMetadata(title, description, '/english-grade-calculator'),
};

export default function EnglishGradeCalculatorPage() {
  return <>
    <BreadcrumbJsonLd items={[
      { name: 'الرئيسية', path: '/' },
      { name: 'حاسبات الطالب', path: '/gpa-calculator' },
      { name: 'حاسبة اللغة الإنجليزية', path: '/english-grade-calculator' },
    ]} />
    <section className="content-section calculator-page-section">
      <div className="container-wide">
        <EnglishGradeCalculator />
      </div>
    </section>
  </>;
}
