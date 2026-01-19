import { useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import type { TicketProps } from '../types/ticketsProps';
import { handleShare } from '../utils/share';
import { formatNumber, formatTicket } from '../utils/format';

interface useXLSProps {
  tickets: TicketProps[];
  walletName?: string | null;
}

const dataType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function useXLS({ tickets, walletName }: useXLSProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [xlsFile, setXlsFile] = useState('');

  const handleGenerateXLS = useCallback(
    (data: TicketProps[], walletName: string) => {
      const formmatedData = data.map((ticket) => ({
        Nota: ticket.grade,
        Ativo: formatTicket(ticket.symbol),
        Nome: ticket.name,
        Quantidade: ticket.quantity,
        'Preço Médio': formatNumber(ticket.averagePrice),
        Classe: ticket.classSymbol,
      }));

      try {
        const workSheet = XLSX.utils.json_to_sheet(formmatedData);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, walletName);
        const wbout = XLSX.write(workBook, {
          bookType: 'xlsx',
          type: 'base64',
        });

        setXlsFile(`data:${dataType};base64,${wbout}`);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  useEffect(() => {
    if (walletName && !!tickets.length) {
      handleGenerateXLS(tickets, walletName);
    }
  }, [handleGenerateXLS, tickets, walletName]);

  const handleShareXLS = async () => {
    setIsLoading(true);

    try {
      if (!xlsFile || !walletName) {
        return;
      }

      await handleShare({
        title: 'Compartilhar planilha',
        url: xlsFile,
        type: dataType,
        filename: walletName,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { xlsFile, handleShareXLS, isLoading };
}
