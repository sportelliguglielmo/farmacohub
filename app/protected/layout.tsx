import { DeployButton } from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import { AuthButton } from '@/components/auth-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { Pill } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <div className='w-full flex flex-col gap-6 sm:gap-8 md:gap-10 items-center'>
        <nav className='w-full flex justify-center border-b border-b-foreground/10 h-14 sm:h-16'>
          <div className='w-full flex justify-between items-center p-2 sm:p-3 px-4 sm:px-6 md:px-8 text-xs sm:text-sm'>
            <div className='flex gap-2 sm:gap-3 md:gap-5 items-center font-semibold min-w-0'>
              <Link
                href={'/protected'}
                className='flex items-center gap-2 sm:gap-3'
              >
                <div className='flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/10'>
                  <Pill className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary' />
                </div>
                <span className='text-primary font-bold text-base sm:text-lg md:text-xl'>
                  FarmacoHub
                </span>
              </Link>
            </div>
            <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
              <ThemeSwitcher />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>
        <div className='flex-1 min-h-[calc(100vh-3.5rem-1.5rem)] sm:min-h-[calc(100vh-4rem-2rem)] md:min-h-[calc(100vh-4rem-2.5rem)] flex flex-col gap-12 sm:gap-16 md:gap-20 w-full'>
          {children}
        </div>

        <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-4 sm:gap-6 md:gap-8 py-8 sm:py-12 md:py-16 px-4'>
          <p className='text-xs sm:text-sm'>
            Powered by <strong className='font-bold'>Isotta Sportelli</strong>
          </p>
        </footer>
      </div>
    </main>
  );
}
