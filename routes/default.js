module.exports = {
    setup: (app, db) => {
        /* DEFAULT ENDPOINT */
        console.log("Registering endpoint: /");
        app.get('/', (req, res) => {
			var html = "";
			html += "<html>";
			html += "<head>";
			html += "<title>DnD Tools Database JSON</title>";
			html += "</head>";
			html += "<body>";
			html += "<h1>List of available requests</h1>";
			html += "<p><span>?guid=X (x = guid) gives a specific item</span></p>";
			html += "<p><span>?limit=X (x = number) limited amount of items</span></p>";
			html += "<p>&nbsp;</p>";
			//html += "<p><a href='/classes'></a></p>";
			html += "<p><a href='/deities'>/deities</a></p>";
			//html += "<p><a href=''></a></p>";
			//html += "<p><a href=''></a></p>";
			html += "<p><a href='/items'>/items</a></p>";
			html += "<p><a href='/languages'>/languages</a></p>";
			html += "<p><a href='/monsters'>/monsters</a></p>";
			html += "<p><a href='/race'>/race</a></p>";
			html += "<p><a href='/races'>/races</a></p>";
			html += "<p><a href='/rulebooks'>/rulebooks</a></p>";
			html += "<p><a href='/skill'>/skill</a></p>";
			html += "<p><a href='/skills'>/skills</a></p>";
			//html += "<p><a href=''></a></p>";
			//html += "";
			html += "</body>";
			html += "</html>";
			
            res.send(html);
        });
    }
}