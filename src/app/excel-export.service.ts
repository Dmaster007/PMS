import { Injectable } from '@angular/core';
import User from './users/user';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportUsersToExcel(users: User[], fileName: string): void {
    // Define a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);
  
    // Define a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  
    // Generate an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  constructor() { }
}
