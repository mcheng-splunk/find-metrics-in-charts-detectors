import * as fs from 'fs';

export default function readcsvtoarray(file) {
    try {
        var data = fs.readFileSync(file, "utf8");
        
        // (C) STRING TO ARRAY
        data = data.split("\r\n"); // SPLIT ROWS
        for (let i in data) { // SPLIT COLUMNS
        data[i] = data[i].split(",");
        }
        //console.log(data);
        return data
    } catch (err) {
        console.error("File " + file + " dont exist");
        process.exit();
    }
}

