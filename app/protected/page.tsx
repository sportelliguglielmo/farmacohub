import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pill, Search, Shield, Heart } from 'lucide-react';

async function AuthCheck() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return null;
}

export default function ProtectedPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      <div className='flex-1 w-full flex flex-col items-center justify-start gap-4 sm:gap-5 md:gap-6 py-4 sm:py-5 md:py-6 px-4 sm:px-6'>
        {/* Hero Section*/}
        <div className='flex flex-col items-center text-center gap-2 sm:gap-3 max-w-3xl w-full'>
          <div className='flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-primary/10 mb-1 sm:mb-2'>
            <Pill className='w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-primary' />
          </div>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight px-2'>
            Benvenuto in FarmacoHub
          </h1>
          <p className='text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl px-4'>
            La tua risorsa completa per trovare il farmaco giusto in base alla
            condizione clinica.
          </p>
        </div>

        {/* CTA Section */}
        <div className='flex flex-col items-center gap-2 sm:gap-3 w-full max-w-2xl px-4'>
          <Button
            asChild
            size='lg'
            className='w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6'
          >
            <Link href='/protected/farmaco'>Trova il Farmaco</Link>
          </Button>
        </div>

        {/* Features Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full max-w-5xl mt-2 sm:mt-4'>
          <Card className='w-full'>
            <CardHeader className='p-3 sm:p-4 md:p-5'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3'>
                <Search className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
              </div>
              <CardTitle className='text-sm sm:text-base md:text-lg mb-1 sm:mb-2'>
                Ricerca Rapida
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                Trova facilmente i farmaci associati a una specifica patologia
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='w-full'>
            <CardHeader className='p-3 sm:p-4 md:p-5'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3'>
                <Shield className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
              </div>
              <CardTitle className='text-sm sm:text-base md:text-lg mb-1 sm:mb-2'>
                Informazioni Affidabili
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                Database completo e aggiornato con informazioni farmaceutiche
                verificate
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='w-full sm:col-span-2 lg:col-span-1'>
            <CardHeader className='p-3 sm:p-4 md:p-5'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3'>
                <Heart className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
              </div>
              <CardTitle className='text-sm sm:text-base md:text-lg mb-1 sm:mb-2'>
                Facile da Usare
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                Interfaccia intuitiva progettata per professionisti sanitari e
                pazienti
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
