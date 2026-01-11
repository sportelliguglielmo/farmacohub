import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlaskConical, CheckCircle2, Plus, X } from 'lucide-react';
import { useState } from 'react';

export type Farmaco = {
  id: string;
  nome: string;
  principio_attivo: string | null;
  forma_farmaceutica: string | null;
  posologia: string | null;
  tipologia: string | null;
  commenti?: string | null;
};

interface FarmacoCardProps {
  farmaco: Farmaco;
  malattiaNome?: string;
  isInPiano: boolean;
  onAddToPiano: (farmaco: Farmaco) => void;
  variant?: 'default' | 'compact';
  onRemove?: (farmacoId: string) => void;
}

export function FarmacoCard({
  farmaco,
  malattiaNome,
  isInPiano,
  onAddToPiano,
  variant = 'default',
  onRemove,
}: FarmacoCardProps) {
  const [commenti, setCommenti] = useState<string>(farmaco.commenti || '');

  if (variant === 'compact') {
    return (
      <Card className='border-l-4 border-l-primary relative'>
        <CardHeader className='pb-1 pr-8 pt-3 px-3'>
          <CardTitle className='text-xs sm:text-sm'>{farmaco.nome}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-1 pt-0 px-3 pb-3'>
          <div className='flex flex-wrap gap-1.5'>
            {farmaco.principio_attivo && (
              <Badge variant='outline' className='text-[10px] px-1.5 py-0.5'>
                <FlaskConical className='w-2.5 h-2.5 mr-1' />
                {farmaco.principio_attivo}
              </Badge>
            )}
            {farmaco.forma_farmaceutica && (
              <Badge variant='outline' className='text-[10px] px-1.5 py-0.5'>
                {farmaco.forma_farmaceutica}
              </Badge>
            )}
          </div>
          {farmaco.commenti && (
            <p className='text-[10px] text-muted-foreground mt-1.5'>
              <span className='font-medium'>Note:</span> {farmaco.commenti}
            </p>
          )}
        </CardContent>
        {onRemove && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-1.5 right-1.5 h-5 w-5'
            onClick={() => onRemove(farmaco.id)}
          >
            <X className='w-3 h-3' />
            <span className='sr-only'>Rimuovi</span>
          </Button>
        )}
      </Card>
    );
  }

  const handleAddToPiano = () => {
    const farmacoConCommenti = {
      ...farmaco,
      commenti: commenti.trim() || null,
    };
    onAddToPiano(farmacoConCommenti);
    // Reset commenti after adding
    setCommenti('');
  };

  return (
    <Card className='border-l-4 border-l-primary'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm sm:text-base flex items-start justify-between gap-2'>
          <span>{farmaco.nome}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 pt-0'>
        <div className='flex flex-wrap gap-2'>
          {farmaco.principio_attivo && (
            <Badge variant='outline' className='text-xs'>
              <FlaskConical className='w-3 h-3 mr-1' />
              {farmaco.principio_attivo}
            </Badge>
          )}
          {farmaco.forma_farmaceutica && (
            <Badge variant='outline' className='text-xs'>
              {farmaco.forma_farmaceutica}
            </Badge>
          )}
          {farmaco.tipologia && (
            <Badge variant='outline' className='text-xs'>
              {farmaco.tipologia}
            </Badge>
          )}
        </div>
        {farmaco.posologia && (
          <p className='text-xs sm:text-sm text-muted-foreground'>
            <span className='font-medium'>Posologia:</span> {farmaco.posologia}
          </p>
        )}
        {malattiaNome && (
          <p className='text-xs text-muted-foreground'>
            <span className='font-medium'>Per:</span> {malattiaNome}
          </p>
        )}
        {!isInPiano && (
          <div className='space-y-1.5 pt-1'>
            <Label
              htmlFor={`commenti-${farmaco.id}`}
              className='text-xs font-medium'
            >
              Commenti aggiuntivi (opzionale)
            </Label>
            <Input
              id={`commenti-${farmaco.id}`}
              type='text'
              placeholder='Aggiungi note o commenti sul farmaco...'
              value={commenti}
              onChange={(e) => setCommenti(e.target.value)}
              className='text-xs h-8'
            />
          </div>
        )}
        <div className='pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
            onClick={handleAddToPiano}
            disabled={isInPiano}
          >
            {isInPiano ? (
              <>
                <CheckCircle2 className='w-4 h-4 mr-2' />
                Già nel Piano
              </>
            ) : (
              <>
                <Plus className='w-4 h-4 mr-2' />
                Aggiungi a Piano Terapeutico
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
