'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from 'react';
import { downloadRicettaPDF } from '@/lib/pdf/ricetta';
import { PageHeader } from '@/components/farmaco/page-header';
import { ProgressStepper } from '@/components/farmaco/progress-stepper';
import { SearchFilters } from '@/components/farmaco/search-filters';
import { ResultsSection } from '@/components/farmaco/results-section';
import { TherapeuticPlan } from '@/components/farmaco/therapeutic-plan';
import type { Farmaco } from '@/components/farmaco/farmaco-card';

type Malattia = {
  id: string;
  nome: string;
  codice_esenzione: string | null;
};

export default function Page() {
  const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
  const [malattie, setMalattie] = useState<Malattia[]>([]);
  const [selectedMalattia, setSelectedMalattia] = useState<string>('');
  const [selectedPrincipioAttivo, setSelectedPrincipioAttivo] =
    useState<string>('');
  const [selectedFormaFarmaceutica, setSelectedFormaFarmaceutica] =
    useState<string>('');
  const [filteredFarmaci, setFilteredFarmaci] = useState<Farmaco[]>([]);
  const [pianoTerapeutico, setPianoTerapeutico] = useState<Farmaco[]>([]);
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

  // Reset all filters when component mounts
  useEffect(() => {
    setSelectedMalattia('');
    setSelectedPrincipioAttivo('');
    setSelectedFormaFarmaceutica('');
    setFilteredFarmaci([]);
    setPianoTerapeutico([]);
  }, []);

  // Fetch farmaci by malattia when malattia is selected
  useEffect(() => {
    const fetchFarmaciByMalattia = async () => {
      if (!selectedMalattia) {
        setFilteredFarmaci([]);
        setSelectedPrincipioAttivo('');
        setSelectedFormaFarmaceutica('');
        setPianoTerapeutico([]);
        return;
      }

      const { data, error } = await supabase
        .from('malattia_farmaco')
        .select('farmaco_id')
        .eq('malattia_id', selectedMalattia);

      if (error || !data) {
        setFilteredFarmaci([]);
        setPianoTerapeutico([]);
        return;
      }

      const farmacoIds = data.map((item) => item.farmaco_id).filter(Boolean);
      const filtered = farmaci.filter((f) => farmacoIds.includes(f.id));
      setFilteredFarmaci(filtered);
      setSelectedPrincipioAttivo('');
      setSelectedFormaFarmaceutica('');
      setPianoTerapeutico([]);
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

  // Check if forma farmaceutica step is needed
  const hasFormeFarmaceutiche = useMemo(() => {
    if (!selectedMalattia || !selectedPrincipioAttivo) return true;
    return formeFarmaceutiche.length > 0;
  }, [formeFarmaceutiche, selectedMalattia, selectedPrincipioAttivo]);

  // Calculate current step
  const currentStep = useMemo(() => {
    if (!selectedMalattia) return 1;
    if (!selectedPrincipioAttivo) return 2;
    if (!hasFormeFarmaceutiche) return 2;
    if (!selectedFormaFarmaceutica) return 3;
    return 3;
  }, [
    selectedMalattia,
    selectedPrincipioAttivo,
    selectedFormaFarmaceutica,
    hasFormeFarmaceutiche,
  ]);

  // Check if all required steps are completed
  const allStepsCompleted = useMemo(() => {
    if (!selectedMalattia || !selectedPrincipioAttivo) return false;
    if (!hasFormeFarmaceutiche) return true;
    return !!selectedFormaFarmaceutica;
  }, [
    selectedMalattia,
    selectedPrincipioAttivo,
    selectedFormaFarmaceutica,
    hasFormeFarmaceutiche,
  ]);

  // Total steps
  const totalSteps = useMemo(() => {
    if (!selectedMalattia || !selectedPrincipioAttivo) return 3;
    return hasFormeFarmaceutiche ? 3 : 2;
  }, [selectedMalattia, selectedPrincipioAttivo, hasFormeFarmaceutiche]);

  // Progress calculation
  const progress = useMemo(() => {
    if (allStepsCompleted) return 100;
    return ((currentStep - 1) / totalSteps) * 100;
  }, [currentStep, totalSteps, allStepsCompleted]);

  // Prepare items for comboboxes
  const malattiaItems = malattie.map((malattia) => ({
    label: malattia.nome,
    value: malattia.id,
  }));

  const principioAttivoItems = principiAttivi.map((principio) => ({
    label: principio,
    value: principio,
  }));

  // Show results when all steps are completed
  const displayFarmaci = useMemo(() => {
    if (allStepsCompleted) {
      if (!hasFormeFarmaceutiche) return farmaciByPrincipioAttivo;
      return finalFarmaci;
    }
    return [];
  }, [
    allStepsCompleted,
    hasFormeFarmaceutiche,
    farmaciByPrincipioAttivo,
    finalFarmaci,
  ]);

  // Handlers
  const handleAddToPiano = (farmaco: Farmaco) => {
    if (!pianoTerapeutico.find((f) => f.id === farmaco.id)) {
      setPianoTerapeutico([...pianoTerapeutico, farmaco]);
    }
  };

  const handleRemoveFromPiano = (farmacoId: string) => {
    setPianoTerapeutico(pianoTerapeutico.filter((f) => f.id !== farmacoId));
  };

  const handleDownloadPDF = () => {
    if (pianoTerapeutico.length === 0) return;
    const malattiaSelezionata = malattie.find((m) => m.id === selectedMalattia);
    const malattiaNome = malattiaSelezionata?.nome || '';
    const codiceEsenzione = malattiaSelezionata?.codice_esenzione || null;
    downloadRicettaPDF(pianoTerapeutico, malattiaNome, codiceEsenzione);
  };

  return (
    <div className='flex flex-col xl:flex-row gap-4 sm:gap-6 px-6 pt-2 pb-6 sm:px-8 sm:pt-3 sm:pb-5 md:px-10 md:pt-4 md:pb-6 lg:px-10 w-full'>
      {/* Main Content Container */}
      <div className='flex flex-col w-full xl:flex-1'>
        <PageHeader />

        <ProgressStepper
          currentStep={currentStep}
          totalSteps={totalSteps}
          allStepsCompleted={allStepsCompleted}
          progress={progress}
        />

        {/* Filters and Results in 2 columns */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {/* Filters */}
          <div className='flex flex-col gap-4 sm:gap-5'>
            <SearchFilters
              malattie={malattie}
              malattiaItems={malattiaItems}
              selectedMalattia={selectedMalattia}
              onMalattiaChange={setSelectedMalattia}
              principiAttivi={principiAttivi}
              principioAttivoItems={principioAttivoItems}
              selectedPrincipioAttivo={selectedPrincipioAttivo}
              onPrincipioAttivoChange={setSelectedPrincipioAttivo}
              formeFarmaceutiche={formeFarmaceutiche}
              selectedFormaFarmaceutica={selectedFormaFarmaceutica}
              onFormaFarmaceuticaChange={setSelectedFormaFarmaceutica}
              hasFormeFarmaceutiche={hasFormeFarmaceutiche}
            />
          </div>

          {/* Results */}
          <div className='flex flex-col'>
            <ResultsSection
              displayFarmaci={displayFarmaci}
              malattie={malattie}
              selectedMalattia={selectedMalattia}
              pianoTerapeutico={pianoTerapeutico}
              onAddToPiano={handleAddToPiano}
              currentStep={currentStep}
              allStepsCompleted={allStepsCompleted}
              hasFormeFarmaceutiche={hasFormeFarmaceutiche}
            />
          </div>
        </div>
      </div>

      {/* Right: Piano Terapeutico */}
      <TherapeuticPlan
        pianoTerapeutico={pianoTerapeutico}
        onRemove={handleRemoveFromPiano}
        onDownload={handleDownloadPDF}
        malattiaNome={
          malattie.find((m) => m.id === selectedMalattia)?.nome || undefined
        }
        codiceEsenzione={
          malattie.find((m) => m.id === selectedMalattia)?.codice_esenzione ||
          undefined
        }
      />
    </div>
  );
}
