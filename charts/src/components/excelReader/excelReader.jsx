import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Chart from '../chart/chart';

import "./excelReader.css"

function ExcelReader() {
    const [dataArray, setDataArray] = useState();

    const handleFile = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            const reader = new FileReader();
    
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
    
                // Assuming you are reading the first sheet
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
    
                // Get the range of the sheet (assuming it's contiguous)
                const range = XLSX.utils.decode_range(sheet['!ref']);
    
                // Initialize an array for each column
                const columns = new Array(range.e.c + 1).fill(null).map(() => []);
    
                // Iterate through each row and push cell values into corresponding columns
                for (let row = range.s.r; row <= range.e.r; row++) {
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = { r: row, c: col };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        const cellValue = sheet[cellRef] ? sheet[cellRef].v : null;
                
                        // Check if the cell is a date (Excel stores dates as serial numbers)
                        const isDate = sheet[cellRef] && sheet[cellRef].t === 'n' && sheet[cellRef].v >= 1;
                
                        // If it's a date, convert the serial number to a JavaScript Date object
                        columns[col].push(isDate ? new Date((sheet[cellRef].v - 1) * 24 * 3600 * 1000) : cellValue);
                    }
                }
                // Create an object with keys from the first row and values as arrays
                const dataObject = {};
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const key = columns[col][0];
                    const values = columns[col].slice(1);
    
                    const formattedValues = values.map((dateString) => {
                        // Check if dateString is not null before splitting
                        if (dateString !== null) {
                            console.log(dateString)
                            const [month, day, year] = dateString.split('-');
                            return `${year}-${month}-${day}`;
                        } else {
                            return null; // Or provide a default value if needed
                        }
                    });
    
                    dataObject[key] = formattedValues;
                }
    
                // Set the resulting object in state
                setDataArray(dataObject);
            };
    
            reader.readAsBinaryString(file);
        } else {
            alert('Please select a file');
        }
    };
    

    return <div className="input-container">
        <div className="upload-box">
        <h1>Convert Excel File to Chart</h1>
        <label htmlFor="file" className='input-box'>Upload File</label>
        <input type="file"  onChange={handleFile} id='file'  name="file" />
        </div>
        {dataArray ? <Chart dataObject={dataArray} /> : ""}
    </div>
}

export default ExcelReader;
