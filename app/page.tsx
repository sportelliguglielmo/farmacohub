import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { AuthButton } from '@/components/auth-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pill, Search, Shield, Heart, ArrowRight } from 'lucide-react';

async function CheckAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // If user is authenticated, redirect to protected area
  if (data?.claims) {
    redirect('/protected');
  }

  return null;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <CheckAuth />
      </Suspense>
      <main className='min-h-screen flex flex-col items-center'>
        <div className='flex-1 w-full flex flex-col gap-6 sm:gap-8 md:gap-10 items-center'>
          <nav className='w-full flex justify-center border-b border-b-foreground/10 h-14 sm:h-16'>
            <div className='w-full max-w-5xl flex justify-between items-center p-2 sm:p-3 px-3 sm:px-4 md:px-5 text-xs sm:text-sm'>
              <div className='flex gap-2 sm:gap-3 md:gap-5 items-center font-semibold min-w-0'>
                <Link href={'/'} className='flex items-center gap-2 sm:gap-3'>
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
                <Suspense>
                  <AuthButton />
                </Suspense>
              </div>
            </div>
          </nav>

          <div className='flex-1 flex flex-col gap-8 sm:gap-10 md:gap-12 max-w-5xl w-full p-4 sm:p-5 md:p-6'>
            {/* Hero Section */}
            <div className='flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/10'>
                <Pill className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary' />
              </div>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-2'>
                FarmacoHub
              </h1>
              <p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl px-4'>
                La piattaforma professionale per la ricerca guidata di farmaci
                in base alla patologia individuata.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4'>
                <Button
                  asChild
                  size='lg'
                  className='text-base sm:text-lg px-6 sm:px-8'
                >
                  <Link href='/auth/sign-up'>
                    Inizia la tua ricerca
                    <ArrowRight className='ml-2 w-4 h-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='text-base sm:text-lg px-6 sm:px-8'
                >
                  <Link href='/auth/login'>Accedi</Link>
                </Button>
              </div>
            </div>

            {/* Features Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full mt-8 sm:mt-12'>
              <Card className='w-full'>
                <CardHeader className='p-4 sm:p-5 md:p-6'>
                  <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                    <Search className='w-6 h-6 sm:w-7 sm:h-7 text-primary' />
                  </div>
                  <CardTitle className='text-lg sm:text-xl md:text-2xl mb-2'>
                    Ricerca Rapida
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base'>
                    Trova facilmente i farmaci associati a una specifica
                    patologia con la nostra ricerca avanzata
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className='w-full'>
                <CardHeader className='p-4 sm:p-5 md:p-6'>
                  <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                    <Shield className='w-6 h-6 sm:w-7 sm:h-7 text-primary' />
                  </div>
                  <CardTitle className='text-lg sm:text-xl md:text-2xl mb-2'>
                    Informazioni Affidabili
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base'>
                    Database completo e aggiornato con informazioni
                    farmaceutiche verificate da professionisti
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className='w-full sm:col-span-2 lg:col-span-1'>
                <CardHeader className='p-4 sm:p-5 md:p-6'>
                  <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                    <Heart className='w-6 h-6 sm:w-7 sm:h-7 text-primary' />
                  </div>
                  <CardTitle className='text-lg sm:text-xl md:text-2xl mb-2'>
                    Facile da Usare
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base'>
                    Interfaccia intuitiva progettata per professionisti sanitari
                    e pazienti
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs sm:text-sm gap-4 sm:gap-6 md:gap-8 py-8 sm:py-12 md:py-16 px-4'>
            <p>
              Powered by <strong className='font-bold'>Isotta Sportelli</strong>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
