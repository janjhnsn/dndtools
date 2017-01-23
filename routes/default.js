module.exports = {
    setup: (app, db) => {
        /* DEFAULT ENDPOINT */
        console.log("Registering endpoint: /");
        app.get('/', (req, res) => {
            res.send('hello ROOT world');
        });
    }
}