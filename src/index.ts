import express from "express"
import path from 'path';
import { fileURLToPath } from 'url';

import { router as apiRouter } from "./api/routes"

const PORT = 8000

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Serve the static files
/* route requests for static files to appropriate directory */
app.use('/', express.static(__dirname + '/public'))


// Serve the API
app.use("/api", apiRouter);

/* final catch-all route to index.html defined last */
app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
