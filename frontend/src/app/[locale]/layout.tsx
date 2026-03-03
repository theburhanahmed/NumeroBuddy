import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

// Note: metadata and viewport are exported from root layout.tsx. Navigation is in root layout.

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the locale
  let messages;
  try {
    const messagesModule = await import(`@/i18n/messages/${locale}.json`);
    messages = messagesModule.default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="pt-28">{children}</div>
    </NextIntlClientProvider>
  );
}
