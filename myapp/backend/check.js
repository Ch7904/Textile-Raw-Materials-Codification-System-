const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');
const app = express();
app.use(express.json());

const filePath = "C:\\Users\\Chidam\\Desktop\\SIOEN\\myapp\\data\\Material Structure Codification.xlsx";

const loadWorkbook = () => XLSX.readFile(filePath);
const saveWorkbook = (workbook) => XLSX.writeFile(workbook, filePath);


app.get('/items', (req, res) => {
    const wb = loadWorkbook();
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);
    res.json(data);
});

app.post('/items', (req, res) => {
    const wb = loadWorkbook();
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);
    data.push(req.body);
    const newWs = XLSX.utils.json_to_sheet(data);
    wb.Sheets[wb.SheetNames[0]] = newWs;
    saveWorkbook(wb);
    res.json({ success: true });
});
app.get('/debug-rows', (req, res) => {
    const wb = loadWorkbook();
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);

    const sample = data.map((row, index) => ({
        row: index + 1,
        "LEVEL 1": row["LEVEL 1"],
        "LEVEL 2": row["LEVEL 2"],
        "LEVEL 3 (display)": row["__EMPTY_2"],
        "LEVEL 3 (code)": row["LEVEL 3"],
        "LEVEL 10 (display)": row["LEVEL 10"],
        "LEVEL 10 (code)": row["__EMPTY_13"]
    }));

    res.json(sample.slice(0, 10)); // only first 10 rows
});


app.post('/generate-code', (req, res) => {
    const inputLevels = req.body.levels;
    const wb = loadWorkbook();
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Column indices based on inspection
    const columnIndexMap = {
        "LEVEL 1": { code: 3, display: 1 },
        "LEVEL 2": { code: 3, display: 4 },
        "LEVEL 3": { code: 5, display: 6 },
        "LEVEL 4": { code: 7, display: 8 },
        "LEVEL 5": { code: 9, display: 10 },
        "LEVEL 6": { code: 11, display: 12 },
        "LEVEL 7": { code: 13, display: 14 },
        "LEVEL 8": { code: 15, display: 16 },
        "LEVEL 10": { code: 17, display: 18 }
    };

    const normalize = str => str?.toString().trim().toUpperCase();

    // Skip headers
    const rows = data.slice(1);
    let matchedRow = null;

    for (const row of rows) {
        const isMatch = Object.entries(inputLevels).every(([levelKey, inputValue]) => {
            const displayIdx = columnIndexMap[levelKey]?.display;
            const cellValue = row[displayIdx];
            return normalize(cellValue) === normalize(inputValue);
        });

        if (isMatch) {
            matchedRow = row;
            break;
        }
    }

    if (!matchedRow) {
        return res.status(404).json({ message: "No matching item found" });
    }

    // Build result code
    let resultCode = "";
    for (const levelKey of Object.keys(inputLevels)) {
        const codeIdx = columnIndexMap[levelKey]?.code;
        let codePart = matchedRow[codeIdx];

        // Pad numeric values
        if (typeof codePart === "number") {
            codePart = codePart.toString().padStart(3, "0");
        }

        if (codePart) {
            resultCode += codePart.toString();
        }
    }

    res.json({ result: resultCode });
});















app.listen(5000, () => console.log("Server started on port 5000"));
