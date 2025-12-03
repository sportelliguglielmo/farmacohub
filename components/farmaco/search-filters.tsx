import { Combobox } from '@/components/ui/combox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pill } from 'lucide-react';

type Malattia = {
  id: string;
  nome: string;
  codice_esenzione: string | null;
};

interface SearchFiltersProps {
  malattie: Malattia[];
  malattiaItems: Array<{ label: string; value: string }>;
  selectedMalattia: string;
  onMalattiaChange: (value: string) => void;
  principiAttivi: string[];
  principioAttivoItems: Array<{ label: string; value: string }>;
  selectedPrincipioAttivo: string;
  onPrincipioAttivoChange: (value: string) => void;
  formeFarmaceutiche: string[];
  selectedFormaFarmaceutica: string;
  onFormaFarmaceuticaChange: (value: string) => void;
  hasFormeFarmaceutiche: boolean;
}

export function SearchFilters({
  malattie,
  malattiaItems,
  selectedMalattia,
  onMalattiaChange,
  principiAttivi,
  principioAttivoItems,
  selectedPrincipioAttivo,
  onPrincipioAttivoChange,
  formeFarmaceutiche,
  selectedFormaFarmaceutica,
  onFormaFarmaceuticaChange,
  hasFormeFarmaceutiche,
}: SearchFiltersProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base sm:text-lg flex items-center gap-2'>
          <Pill className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
          Filtri di Ricerca
        </CardTitle>
        <CardDescription>
          Seleziona i criteri per trovare il farmaco giusto
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 sm:space-y-5'>
        {/* Step 1: Select Malattia */}
        <div className='space-y-2'>
          <label className='text-sm font-medium flex items-center gap-2'>
            <span className='flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold'>
              1
            </span>
            Seleziona Patologia
          </label>
          <Combobox
            key={selectedMalattia || 'empty'}
            items={malattiaItems}
            value={selectedMalattia}
            onValueChange={onMalattiaChange}
            placeholder='Cerca una patologia...'
            className='w-full'
          />
          {selectedMalattia && (
            <Badge variant='secondary' className='w-fit'>
              {malattie.find((m) => m.id === selectedMalattia)?.nome}
            </Badge>
          )}
        </div>

        {/* Step 2: Select Principio Attivo */}
        {selectedMalattia && (
          <div className='space-y-2'>
            <label className='text-sm font-medium flex items-center gap-2'>
              <span className='flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold'>
                2
              </span>
              Seleziona Principio Attivo
            </label>
            <Combobox
              key={selectedPrincipioAttivo || 'empty'}
              items={principioAttivoItems}
              value={selectedPrincipioAttivo}
              onValueChange={onPrincipioAttivoChange}
              placeholder='Cerca un principio attivo...'
              className='w-full'
            />
            {selectedPrincipioAttivo && (
              <Badge variant='secondary' className='w-fit'>
                {selectedPrincipioAttivo}
              </Badge>
            )}
          </div>
        )}

        {/* Step 3: Select Forma Farmaceutica */}
        {selectedPrincipioAttivo && hasFormeFarmaceutiche && (
          <div className='space-y-2'>
            <label className='text-sm font-medium flex items-center gap-2'>
              <span className='flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold'>
                3
              </span>
              Seleziona Forma Farmaceutica
            </label>
            <Select
              value={selectedFormaFarmaceutica}
              onValueChange={onFormaFarmaceuticaChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Seleziona una forma farmaceutica' />
              </SelectTrigger>
              <SelectContent>
                {formeFarmaceutiche.map((forma) => (
                  <SelectItem key={forma} value={forma}>
                    {forma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFormaFarmaceutica && (
              <Badge variant='secondary' className='w-fit'>
                {selectedFormaFarmaceutica}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

