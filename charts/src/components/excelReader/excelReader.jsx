import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Chart from '../chart/chart';

import "./excelReader.css"

function ExcelReader() {
    const [dataArray, setDataArray] = useState();

    function getJsDateFromExcel(excelDate){
        const SECONDS_IN_DAY = 24 * 60 * 60;
        const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
        const MAGIC_NUMBER_OF_DAYS = (25567 + 2);    
        if (!Number(excelDate)) {
            alert('wrong input format')
        }

        const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
        const parsed = delta * MISSING_LEAP_YEAR_DAY;
        const date = new Date(parsed)

        return date
    }

    const handleFile = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const range = XLSX.utils.decode_range(sheet['!ref']);

                const columns = new Array(range.e.c + 1).fill(null).map(() => []);

                for (let row = range.s.r; row <= range.e.r; row++) {
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = { r: row, c: col };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        const cellValue = sheet[cellRef] ? sheet[cellRef].v : null;

                        const isDate = sheet[cellRef] && sheet[cellRef].t === 'n' && sheet[cellRef].v >= 1;

                        if (col === range.s.c) {
                            console.log('cel', cellValue)
                            columns[col].push(isDate ? getJsDateFromExcel(cellValue )  : cellValue);
                        } else {
                            columns[col].push(cellValue);
                        }
                    }
                }

                const dataObject = {};
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const key = columns[col][0];
                    const values = columns[col].slice(1);

                    dataObject[key] = values;
                }

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
            <input type="file" onChange={handleFile} id='file' name="file" />
        </div>
        {dataArray ? <Chart dataObject={dataArray} /> : ""}
    </div>
}

export default ExcelReader;
