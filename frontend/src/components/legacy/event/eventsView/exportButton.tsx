import * as React from 'react';
import { Button } from 'react-bootstrap';
import { faIconStyle } from './styles';
import { ExportProps } from './interfaces';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

export function ExportButton(props: ExportProps): JSX.Element {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const participants = props.participants;

  const exportToCSV = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('My Sheet');
    ws.columns = [{ header: 'Prénom et Nom', key: 'name', width: 32 }];
    participants.forEach((e) => {
      ws.addRow({ name: e.name });
    });
    const excelBuffer = await wb.xlsx.writeBuffer();
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Participant.e.s ${props.title}.xlsx`);
  };

  return (
    <Button variant="secondary" onClick={(e) => exportToCSV()}>
      <i className="fa fa-download " style={faIconStyle}></i>
      {'    Télécharger'}
    </Button>
  );
}
