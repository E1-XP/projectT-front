const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const compression = require('compression');

app.use(compression());

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));