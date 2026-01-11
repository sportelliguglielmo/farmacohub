import { Pill } from 'lucide-react';

export function PageHeader() {
  return (
    <div className='mb-6 sm:mb-8 md:mb-10'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10'>
          <Pill className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
        </div>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight'>
          Ricerca Medicinali
        </h1>
      </div>
      <p className='text-sm sm:text-base  max-w-3xl ml-0 sm:ml-14 md:ml-16'>
        Segui pochi passaggi e trova con velocità e accuratezza il farmaco
        giusto in base alla condizione medica.
      </p>
    </div>
  );
}
