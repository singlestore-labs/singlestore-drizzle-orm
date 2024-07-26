import express from "express"
import path from 'path';
import { fileURLToPath } from 'url';

import { router } from "./api/routes"

const PORT = 8000

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the API
app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
