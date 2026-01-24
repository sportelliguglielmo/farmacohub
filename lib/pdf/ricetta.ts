import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Type extension for jsPDF with autotable plugin properties
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

type Farmaco = {
  id: string;
  nome: string;
  principio_attivo: string | null;
  forma_farmaceutica: string | null;
  posologia: string | null;
  tipologia: string | null;
  commenti?: string | null;
};

export function downloadRicettaPDF(
  farmaci: Farmaco[],
  malattiaNome: string,
  codiceEsenzione: string | null
) {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Mock data for Italian prescription
  const pazienteData = {
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '15/03/1980',
    eta: '44',
    sesso: 'M',
    codiceFiscale: 'RSSMRA80C15H501Z',
    indirizzo: 'Via Roma, 10',
    cap: '00100',
    citta: 'Roma',
    asl: 'ASL Roma 1',
    regione: 'Lazio',
  };

  const medicoData = {
    nome: 'Luigi',
    cognome: 'Bianchi',
    qualifica: 'Medico Chirurgo',
    specializzazione: 'Medicina Generale',
    numeroOrdine: '12345',
    indirizzo: 'Via Verdi, 20',
    cap: '00100',
    citta: 'Roma',
    telefono: '06 1234567',
    email: 'luigi.bianchi@aslroma1.it',
  };

  const dataEmissione = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  let yPos = 15;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PIANO TERAPEUTICO', 105, yPos, { align: 'center' });
  yPos += 10;

  // Separator line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(14, yPos, 196, yPos);
  yPos += 8;

  // Dati del Paziente section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATI DEL PAZIENTE', 14, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 7;

  doc.setFontSize(10);
  doc.text(`Nome: ${pazienteData.nome} ${pazienteData.cognome}`, 14, yPos);
  doc.text(
    `Data di Nascita: ${pazienteData.dataNascita} (Età: ${pazienteData.eta} anni)`,
    14,
    yPos + 5
  );
  doc.text(`Sesso: ${pazienteData.sesso}`, 14, yPos + 10);
  doc.text(`Codice Fiscale: ${pazienteData.codiceFiscale}`, 14, yPos + 15);
  doc.text(
    `Indirizzo: ${pazienteData.indirizzo}, ${pazienteData.cap} ${pazienteData.citta}`,
    14,
    yPos + 20
  );
  doc.text(`ASL di Appartenenza: ${pazienteData.asl}`, 14, yPos + 25);
  doc.text(`Regione: ${pazienteData.regione}`, 14, yPos + 30);
  yPos += 40;

  // Separator line
  doc.line(14, yPos, 196, yPos);
  yPos += 8;

  // Dati del Medico section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATI DEL MEDICO', 14, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 7;

  doc.setFontSize(10);
  doc.text(
    `Medico Curante: Dott. ${medicoData.nome} ${medicoData.cognome}`,
    14,
    yPos
  );
  doc.text(
    `Qualifica: ${medicoData.qualifica} - ${medicoData.specializzazione}`,
    14,
    yPos + 5
  );
  doc.text(`N. Iscrizione Ordine: ${medicoData.numeroOrdine}`, 14, yPos + 10);
  doc.text(
    `Indirizzo Professionale: ${medicoData.indirizzo}, ${medicoData.cap} ${medicoData.citta}`,
    14,
    yPos + 15
  );
  doc.text(`Telefono: ${medicoData.telefono}`, 14, yPos + 20);
  doc.text(`Email: ${medicoData.email}`, 14, yPos + 25);
  yPos += 35;

  // Separator line
  doc.line(14, yPos, 196, yPos);
  yPos += 8;

  // Patologia - shown before table
  if (malattiaNome) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Patologia:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(malattiaNome, 50, yPos);
    yPos += 8;
  }

  // Codice Esenzione - shown after patologia
  if (codiceEsenzione) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Codice Esenzione:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(codiceEsenzione, 50, yPos);
    yPos += 8;
  }

  // Prepare table data for farmaci - combine principio attivo, commenti and nome
  // Format: principio_attivo - commenti (tipo nome_farmaco)
  // If principio_attivo === nome_farmaco, show only principio_attivo (and commenti if present)
  const tableHeaders = ['FARMACO', 'Forma farmaceutica', 'Posologia'];
  const tableValues = farmaci.map((farmaco) => {
    const principioAttivo = farmaco.principio_attivo || 'N/A';
    const nomeFarmaco = farmaco.nome || 'N/A';
    const commenti = farmaco.commenti || '';

    // Check if principio attivo and nome farmaco are the same (case-insensitive, trimmed)
    const isSame = principioAttivo !== 'N/A' && 
                   nomeFarmaco !== 'N/A' && 
                   principioAttivo.trim().toLowerCase() === nomeFarmaco.trim().toLowerCase();

    let farmacoCombinato: string;
    
    if (isSame) {
      // If they are the same, show only principio attivo (and commenti if present)
      if (commenti) {
        farmacoCombinato = `${principioAttivo} - ${commenti}`;
      } else {
        farmacoCombinato = principioAttivo;
      }
    } else {
      // Normal format: principio_attivo - commenti (tipo nome_farmaco)
      if (commenti) {
        farmacoCombinato = `${principioAttivo} - ${commenti} (tipo ${nomeFarmaco})`;
      } else {
        farmacoCombinato = `${principioAttivo} (tipo ${nomeFarmaco})`;
      }
    }

    return [
      farmacoCombinato,
      farmaco.forma_farmaceutica || 'N/A',
      farmaco.posologia || 'N/A',
    ];
  });

  // Add table with horizontal structure
  autoTable(doc, {
    head: [tableHeaders],
    body: tableValues,
    startY: yPos,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // Ensure alternate rows are also white
    },
    columnStyles: {
      0: { cellWidth: 90 }, // Farmaco (combined column - wider)
      1: { cellWidth: 50 }, // Forma Farmaceutica
      2: { cellWidth: 50 }, // Posologia
    },
    margin: { left: 14, right: 14 },
  });

  // Get final Y position after table
  const finalY = doc.lastAutoTable?.finalY || yPos + 50;
  yPos = finalY + 12;

  // Firma del Medico
  doc.setFontSize(10);
  doc.text('Firma del Medico:', 14, yPos);
  doc.setDrawColor(0, 0, 0);
  doc.line(60, yPos - 2, 120, yPos - 2);
  yPos += 8;

  // Data emissione - under signature
  doc.setFontSize(10);
  doc.text(`Data di Emissione: ${dataEmissione}`, 14, yPos);
  yPos += 12;

  // Ospedale/ASL Information footer - compact
  const ospedaleData = {
    nome: 'ASL Roma 1 - Presidio Ospedaliero',
    indirizzo: 'Via di San Gallicano, 10, 00153 Roma',
    telefono: '06 58541',
    telefonoEmergenza: '118',
    email: 'info@aslroma1.it',
  };

  // Compact footer with separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, yPos, 196, yPos);
  yPos += 5;

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(`${ospedaleData.nome} | ${ospedaleData.indirizzo}`, 14, yPos);
  doc.text(
    `Tel: ${ospedaleData.telefono} | Emergenze: ${ospedaleData.telefonoEmergenza} | Email: ${ospedaleData.email}`,
    14,
    yPos + 4
  );

  // Footer note
  yPos = 280;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Piano terapeutico generato automaticamente. Per uso informativo e non commerciale.',
    105,
    yPos,
    { align: 'center' }
  );

  // Save PDF
  const pazienteNome = `${pazienteData.nome}_${pazienteData.cognome}`.replace(
    /\s+/g,
    '_'
  );
  const fileName = `Piano_Terapeutico_${pazienteNome}_${
    new Date().toISOString().split('T')[0]
  }.pdf`;
  doc.save(fileName);
}
