import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Download } from 'lucide-react';
import { FarmacoCard, type Farmaco } from './farmaco-card';

interface TherapeuticPlanProps {
  pianoTerapeutico: Farmaco[];
  onRemove: (farmacoId: string) => void;
  onDownload: () => void;
  malattiaNome?: string;
  codiceEsenzione?: string | null;
}

export function TherapeuticPlan({
  pianoTerapeutico,
  onRemove,
  onDownload,
  malattiaNome,
  codiceEsenzione,
}: TherapeuticPlanProps) {
  return (
    <div className='flex flex-col w-full xl:w-[400px] shrink-0'>
      <Card className='w-full sticky top-4'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base sm:text-lg flex items-center gap-2'>
            <ClipboardList className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
            Piano Terapeutico
            {pianoTerapeutico.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {pianoTerapeutico.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-1.5 px-4 py-2'>
          {/* Patologia e Codice Esenzione */}
          {(malattiaNome || codiceEsenzione) && (
            <div className='space-y-2 pb-2 border-b mb-3'>
              {malattiaNome && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    Patologia:
                  </p>
                  <p className='text-sm font-semibold'>{malattiaNome}</p>
                </div>
              )}
              {codiceEsenzione && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    Codice Esenzione:
                  </p>
                  <p className='text-sm font-semibold'>{codiceEsenzione}</p>
                </div>
              )}
            </div>
          )}
          {pianoTerapeutico.length > 0 ? (
            <>
              <div className='space-y-2 max-h-[500px] overflow-y-auto'>
                {pianoTerapeutico.map((farmaco) => (
                  <FarmacoCard
                    key={farmaco.id}
                    farmaco={farmaco}
                    isInPiano={true}
                    onAddToPiano={() => {}}
                    variant='compact'
                    onRemove={onRemove}
                  />
                ))}
              </div>
              <div className='pt-2  mt-2'>
                <Button className='w-full' onClick={onDownload} size='default'>
                  <Download className='w-3.5 h-3.5 mr-2' />
                  Scarica Piano Terapeutico
                </Button>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center text-center p-8 min-h-[200px]'>
              <ClipboardList className='w-12 h-12 text-muted-foreground/50 mb-4' />
              <p className='text-sm text-muted-foreground'>
                Nessun farmaco nel piano terapeutico.
              </p>
              <p className='text-sm text-muted-foreground mt-2'>
                Aggiungi farmaci dai risultati per creare il piano.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
