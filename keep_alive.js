const express = require('express');
const app = express();
const port = 0.0.0.0/0;
app.get('/', (req, res) => res.send('Afk bot!'));

app.listen(port, () => console.log(`Afk bot is listening to http://localhost:${port}`));
