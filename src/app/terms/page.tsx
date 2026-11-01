import type { Metadata } from 'next';
import { socialMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/LegalPage';
import { termsSections } from '@/lib/legalPolicies';

export const metadata: Metadata = {
  ...socialMetadata('شروط الاستخدام والمساهمة | النخبة', 'شروط استخدام موقع النخبة الطلابي وأحكام المساهمات التعليمية وحقوق أصحاب المحتوى.', '/terms'),
  title: 'شروط الاستخدام والمساهمة | النخبة',
  description: 'شروط استخدام موقع النخبة الطلابي وأحكام المساهمات التعليمية وحقوق أصحاب المحتوى.',
};

export default function TermsPage() {
  return <LegalPage
    title="شروط الاستخدام والمساهمة"
    eyebrow="تنظيم المساهمة وحفظ الحقوق"
    description="قواعد واضحة لاستخدام موارد النخبة والمشاركة بمواد تعليمية مع احترام حقوق الجميع."
    sections={termsSections}
    alternate={{ href: '/privacy', label: 'قراءة سياسة الخصوصية' }}
  />;
}
