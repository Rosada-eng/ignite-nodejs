import { parse } from 'csv-parse'
import fs from 'node:fs'

const filepath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(filepath);

const parser = parse({
    delimiter: ',',
    skipEmptyLines: true,
    from_line: 2,
});

async function importCSV() {

    const linesParser = stream.pipe(parser);

    for await (const record of linesParser) {
        const [title, description] = record;

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            }),
        })
        .then(response => response.json())
        .then(response_data => console.log(response_data))
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('CSV file successfully processed');

}

importCSV();