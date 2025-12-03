import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Pill } from 'lucide-react';
import { FarmacoCard, type Farmaco } from './farmaco-card';

type Malattia = {
  id: string;
  nome: string;
};

interface ResultsSectionProps {
  displayFarmaci: Farmaco[];
  malattie: Malattia[];
  selectedMalattia: string;
  pianoTerapeutico: Farmaco[];
  onAddToPiano: (farmaco: Farmaco) => void;
  currentStep: number;
  allStepsCompleted: boolean;
  hasFormeFarmaceutiche: boolean;
}

export function ResultsSection({
  displayFarmaci,
  malattie,
  selectedMalattia,
  pianoTerapeutico,
  onAddToPiano,
  currentStep,
  allStepsCompleted,
  hasFormeFarmaceutiche,
}: ResultsSectionProps) {
  const malattiaNome = malattie.find((m) => m.id === selectedMalattia)?.nome;

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base sm:text-lg flex items-center gap-2'>
          <Package className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
          Risultati
          {displayFarmaci.length > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {displayFarmaci.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayFarmaci.length > 0 ? (
          <div className='grid grid-cols-1 gap-3 sm:gap-4'>
            {displayFarmaci.map((farmaco) => (
              <FarmacoCard
                key={farmaco.id}
                farmaco={farmaco}
                malattiaNome={malattiaNome}
                isInPiano={!!pianoTerapeutico.find((f) => f.id === farmaco.id)}
                onAddToPiano={onAddToPiano}
              />
            ))}
          </div>
        ) : allStepsCompleted && displayFarmaci.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-center p-8 min-h-[200px]'>
            <Package className='w-12 h-12 text-muted-foreground/50 mb-4' />
            <p className='text-sm text-muted-foreground'>
              Nessun farmaco trovato con i criteri selezionati.
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center text-center p-8 min-h-[200px]'>
            <Pill className='w-12 h-12 text-muted-foreground/50 mb-4' />
            <p className='text-sm text-muted-foreground'>
              {currentStep === 1
                ? 'Seleziona una patologia per iniziare la ricerca'
                : currentStep === 2
                ? 'Seleziona un principio attivo per continuare'
                : hasFormeFarmaceutiche
                ? 'Seleziona una forma farmaceutica per vedere i risultati'
                : 'Seleziona un principio attivo per vedere i risultati'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
