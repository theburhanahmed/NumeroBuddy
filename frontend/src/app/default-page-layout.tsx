'use client';

import React from 'react';

/**
 * Default layout wrapper for pages that need consistent top padding below navbar.
 * Navigation and main landmark are provided by root layout.
 */
export function DefaultPageLayout({ children }: { children: React.ReactNode }) {
  return <div className="pt-28">{children}</div>;
}

