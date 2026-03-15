'use client';

import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <div>
      <Select onValueChange={onSelectChange} defaultValue={locale}>
        <SelectTrigger className="w-20 md:w-32 h-10 md:h-12 px-2 md:px-3 rounded-full border-none glass-premium text-[10px] md:text-sm font-bold uppercase tracking-widest">
          <SelectValue placeholder={t('label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('en')}</SelectItem>
          <SelectItem value="hi">{t('hi')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
