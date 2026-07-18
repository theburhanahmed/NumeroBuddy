import React from 'react';
import { DownloadIcon, PrinterIcon, ShareIcon } from 'lucide-react';

interface ReportSection {
  title: string;
  content: React.ReactNode;
}

interface ReportLayoutProps {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  pdfUrl?: string;
  onSave?: () => void;
}

export function ReportLayout({ title, subtitle, sections, pdfUrl, onSave }: ReportLayoutProps) {
  const share = async () => {
    if (navigator.share) await navigator.share({ title, text: subtitle || title });
  };

  return (
    <article className="space-y-6 print:bg-white print:text-black">
      <header className="flex flex-wrap items-start justify-between gap-4 p-6 rounded-3xl bg-[#1a2942]/40 border border-cyan-500/20 print:border-black">
        <div><h1 className="text-3xl font-serif text-white print:text-black">{title}</h1>{subtitle && <p className="text-white/70 print:text-black">{subtitle}</p>}</div>
        <div className="flex gap-2 print:hidden">
          {onSave && <button onClick={onSave} className="px-4 rounded-xl bg-cyan-500 text-white">Save</button>}
          {pdfUrl && <a href={pdfUrl} className="p-3 rounded-xl bg-cyan-500 text-white" aria-label="Download PDF"><DownloadIcon className="w-5 h-5" /></a>}
          <button onClick={() => window.print()} className="p-3 rounded-xl bg-cyan-500 text-white" aria-label="Print report"><PrinterIcon className="w-5 h-5" /></button>
          <button onClick={share} className="p-3 rounded-xl bg-cyan-500 text-white" aria-label="Share report"><ShareIcon className="w-5 h-5" /></button>
        </div>
      </header>
      {sections.map((section) => <section key={section.title} className="p-6 rounded-3xl bg-[#1a2942]/40 border border-cyan-500/20 print:border-black"><h2 className="text-xl font-semibold text-white print:text-black mb-3">{section.title}</h2><div className="text-white/80 print:text-black">{section.content}</div></section>)}
    </article>
  );
}
