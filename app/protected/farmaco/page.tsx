'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from 'react';
import { Combobox } from '@/components/ui/combox';
import { downloadRicettaPDF } from '@/lib/pdf/ricetta';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  Pill,
  FlaskConical,
  Package,
  Download,
} from 'lucide-react';

type Malattia = {
  id: string;
  nome: string;
  codice_esenzione: string | null;
};

type Farmaco = {
  id: string;
  nome: string;
  principio_attivo: string | null;
  forma_farmaceutica: string | null;
  posologia: string | null;
  tipologia: string | null;
};

export default function Page() {
  const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
  const [malattie, setMalattie] = useState<Malattia[]>([]);
  const [selectedMalattia, setSelectedMalattia] = useState<string>('');
  const [selectedPrincipioAttivo, setSelectedPrincipioAttivo] =
    useState<string>('');
  const [selectedFormaFarmaceutica, setSelectedFormaFarmaceutica] =
    useState<string>('');
  const supabase = createClient();

  // Fetch all farmaci
  useEffect(() => {
    const getFarmaci = async () => {
      const { data, error } = await supabase.from('farmaco').select('*');
      if (error) {
        console.error('Error fetching farmaci:', error);
      } else {
        setFarmaci(data || []);
      }
    };
    getFarmaci();
  }, []);

  // Fetch malattie
  useEffect(() => {
    const getMalattie = async () => {
      const { data, error } = await supabase
        .from('malattia')
        .select('id, nome, codice_esenzione')
        .order('nome');

      if (error) {
        console.error('Error fetching malattie:', error);
      } else {
        setMalattie(data || []);
      }
    };
    getMalattie();
  }, []);

  const [filteredFarmaci, setFilteredFarmaci] = useState<Farmaco[]>([]);

  // Reset all filters when component mounts
  useEffect(() => {
    setSelectedMalattia('');
    setSelectedPrincipioAttivo('');
    setSelectedFormaFarmaceutica('');
    setFilteredFarmaci([]);
  }, []);

  // Fetch farmaci by malattia when malattia is selected
  useEffect(() => {
    const fetchFarmaciByMalattia = async () => {
      if (!selectedMalattia) {
        setFilteredFarmaci([]);
        setSelectedPrincipioAttivo('');
        setSelectedFormaFarmaceutica('');
        return;
      }

      const { data, error } = await supabase
        .from('malattia_farmaco')
        .select('farmaco_id')
        .eq('malattia_id', selectedMalattia);

      if (error || !data) {
        setFilteredFarmaci([]);
        return;
      }

      const farmacoIds = data.map((item) => item.farmaco_id).filter(Boolean);
      const filtered = farmaci.filter((f) => farmacoIds.includes(f.id));
      setFilteredFarmaci(filtered);
      setSelectedPrincipioAttivo('');
      setSelectedFormaFarmaceutica('');
    };

    fetchFarmaciByMalattia();
  }, [selectedMalattia, farmaci]);

  // Reset forma farmaceutica when principio attivo changes
  useEffect(() => {
    setSelectedFormaFarmaceutica('');
  }, [selectedPrincipioAttivo]);

  // Get unique principi attivi from filtered farmaci
  const principiAttivi = useMemo(() => {
    const unique = new Set<string>();
    filteredFarmaci.forEach((f) => {
      if (f.principio_attivo) {
        unique.add(f.principio_attivo);
      }
    });
    return Array.from(unique).sort();
  }, [filteredFarmaci]);

  // Get farmaci filtered by principio attivo
  const farmaciByPrincipioAttivo = useMemo(() => {
    if (!selectedPrincipioAttivo) return filteredFarmaci;
    return filteredFarmaci.filter(
      (f) => f.principio_attivo === selectedPrincipioAttivo
    );
  }, [filteredFarmaci, selectedPrincipioAttivo]);

  // Get unique forme farmaceutiche from farmaci filtered by principio attivo
  const formeFarmaceutiche = useMemo(() => {
    const unique = new Set<string>();
    farmaciByPrincipioAttivo.forEach((f) => {
      if (f.forma_farmaceutica) {
        unique.add(f.forma_farmaceutica);
      }
    });
    return Array.from(unique).sort();
  }, [farmaciByPrincipioAttivo]);

  // Get final filtered farmaci
  const finalFarmaci = useMemo(() => {
    if (!selectedFormaFarmaceutica) return farmaciByPrincipioAttivo;
    return farmaciByPrincipioAttivo.filter(
      (f) => f.forma_farmaceutica === selectedFormaFarmaceutica
    );
  }, [farmaciByPrincipioAttivo, selectedFormaFarmaceutica]);

  // Check if forma farmaceutica step is needed (if there are any forme available)
  // Only check this after selecting malattia + principio attivo
  const hasFormeFarmaceutiche = useMemo(() => {
    // Only check if we have selected both malattia and principio attivo
    if (!selectedMalattia || !selectedPrincipioAttivo) return true; // Default to 3 steps
    return formeFarmaceutiche.length > 0;
  }, [formeFarmaceutiche, selectedMalattia, selectedPrincipioAttivo]);

  // Calculate current step (1, 2, or 3)
  const currentStep = useMemo(() => {
    if (!selectedMalattia) return 1;
    if (!selectedPrincipioAttivo) return 2;
    // If no forme farmaceutiche available, we're done after step 2
    if (!hasFormeFarmaceutiche) return 2; // Completed (only 2 steps needed)
    if (!selectedFormaFarmaceutica) return 3;
    return 3; // All steps completed (3 steps)
  }, [
    selectedMalattia,
    selectedPrincipioAttivo,
    selectedFormaFarmaceutica,
    hasFormeFarmaceutiche,
  ]);

  // Check if all required steps are completed
  const allStepsCompleted = useMemo(() => {
    if (!selectedMalattia || !selectedPrincipioAttivo) return false;
    // If no forme available, we're done after step 2
    if (!hasFormeFarmaceutiche) return true;
    // If forme available, need step 3 too
    return !!selectedFormaFarmaceutica;
  }, [
    selectedMalattia,
    selectedPrincipioAttivo,
    selectedFormaFarmaceutica,
    hasFormeFarmaceutiche,
  ]);

  // Total steps: default to 3, switch to 2 only if we know there are no forme available
  const totalSteps = useMemo(() => {
    // If we haven't selected both malattia and principio attivo yet, default to 3
    if (!selectedMalattia || !selectedPrincipioAttivo) return 3;
    // Once we know, use the actual value
    return hasFormeFarmaceutiche ? 3 : 2;
  }, [selectedMalattia, selectedPrincipioAttivo, hasFormeFarmaceutiche]);

  const progress = useMemo(() => {
    // If all steps completed, show 100%
    if (allStepsCompleted) return 100;
    return ((currentStep - 1) / totalSteps) * 100;
  }, [currentStep, totalSteps, allStepsCompleted]);

  const malattiaItems = malattie.map((malattia) => ({
    label: malattia.nome,
    value: malattia.id,
  }));

  // Show results when: malattia + principio attivo selected, and (no forme available OR forma selected)
  const displayFarmaci = useMemo(() => {
    if (allStepsCompleted) {
      // If no forme farmaceutiche available, show results after step 2
      if (!hasFormeFarmaceutiche) return farmaciByPrincipioAttivo;
      // If forme available, show results after step 3 is completed
      return finalFarmaci;
    }
    return [];
  }, [
    allStepsCompleted,
    hasFormeFarmaceutiche,
    farmaciByPrincipioAttivo,
    finalFarmaci,
  ]);

  // Handler for PDF download
  const handleDownloadPDF = (farmaco: Farmaco) => {
    const malattiaSelezionata = malattie.find((m) => m.id === selectedMalattia);
    const malattiaNome = malattiaSelezionata?.nome || '';
    const codiceEsenzione = malattiaSelezionata?.codice_esenzione || null;
    downloadRicettaPDF(farmaco, malattiaNome, codiceEsenzione);
  };

  return (
    <div className='flex flex-col px-4 pt-2 pb-6 sm:px-5 sm:pt-3 sm:pb-5 md:px-6 md:pt-4 md:pb-6 w-full max-w-7xl mx-auto'>
      {/* Page Header */}
      <div className='mb-6 sm:mb-8 md:mb-10'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10'>
            <Pill className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight'>
            Ricerca Farmaci
          </h1>
        </div>
        <p className='text-sm sm:text-base text-muted-foreground max-w-3xl ml-0 sm:ml-14 md:ml-16'>
          Segui pochi passaggi e trova con velocità e accuratezza il farmaco
          giusto in base alla condizione medica.
        </p>
      </div>

      {/* Progress Bar - Compact */}
      <div className='mb-4 sm:mb-6'>
        <div className='flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2'>
          <span className='font-medium'>
            {allStepsCompleted
              ? `Completato (${totalSteps} step)`
              : `Passo ${currentStep} di ${totalSteps}`}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className='w-full h-2.5 bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary transition-all duration-500 ease-in-out'
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className='flex items-center justify-between mt-3 text-xs sm:text-sm'>
          <div className='flex items-center gap-2'>
            {currentStep > 1 ? (
              <CheckCircle2 className='w-4 h-4 text-primary' />
            ) : (
              <Circle className='w-4 h-4 text-muted-foreground' />
            )}
            <span
              className={cn(
                'font-medium',
                currentStep > 1 ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Patologia
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {currentStep > 2 ? (
              <CheckCircle2 className='w-4 h-4 text-primary' />
            ) : (
              <Circle className='w-4 h-4 text-muted-foreground' />
            )}
            <span
              className={cn(
                'font-medium',
                currentStep > 2 ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Principio Attivo
            </span>
          </div>
          {/* Show step 3 by default, hide only when we know there are no forme available */}
          {totalSteps === 3 && (
            <div className='flex items-center gap-2'>
              {allStepsCompleted ? (
                <CheckCircle2 className='w-4 h-4 text-primary' />
              ) : (
                <Circle className='w-4 h-4 text-muted-foreground' />
              )}
              <span
                className={cn(
                  'font-medium',
                  allStepsCompleted ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Forma
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
        {/* Left: Filters */}
        <div className='flex flex-col gap-4 sm:gap-5'>
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
                  onValueChange={setSelectedMalattia}
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
                  <Select
                    value={selectedPrincipioAttivo}
                    onValueChange={setSelectedPrincipioAttivo}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Seleziona un principio attivo' />
                    </SelectTrigger>
                    <SelectContent>
                      {principiAttivi.length > 0 ? (
                        principiAttivi.map((principio) => (
                          <SelectItem key={principio} value={principio}>
                            {principio}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='no-data' disabled>
                          Nessun principio attivo disponibile
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {selectedPrincipioAttivo && (
                    <Badge variant='secondary' className='w-fit'>
                      {selectedPrincipioAttivo}
                    </Badge>
                  )}
                </div>
              )}

              {/* Step 3: Select Forma Farmaceutica - Only show if there are forme available */}
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
                    onValueChange={setSelectedFormaFarmaceutica}
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
        </div>

        {/* Right: Results */}
        <div className='flex flex-col'>
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
                    <Card
                      key={farmaco.id}
                      className='border-l-4 border-l-primary'
                    >
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
                            <span className='font-medium'>Posologia:</span>{' '}
                            {farmaco.posologia}
                          </p>
                        )}
                        {selectedMalattia && (
                          <p className='text-xs text-muted-foreground'>
                            <span className='font-medium'>Per:</span>{' '}
                            {
                              malattie.find((m) => m.id === selectedMalattia)
                                ?.nome
                            }
                          </p>
                        )}
                        <div className='pt-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full sm:w-auto'
                            onClick={() => handleDownloadPDF(farmaco)}
                          >
                            <Download className='w-4 h-4 mr-2' />
                            Scarica Ricetta
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
        </div>
      </div>
    </div>
  );
}
