// SQLite3 initialisieren
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('shop.db');

// Express initialisieren
const express = require('express');
const app = express()

// Body-Parser initialisieren
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Server starten
const port = 3000;
app.listen(port, function() {
  console.log('listening on port' + port)
});

// Express-Session initialisieren
const session = require('express-session');
app.use(session({ 
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

// Main
app.get(['/'], function(req, res){
	//var logedIn = false;
	req.session['start'] = parseInt(0);
	req.session['end'] = parseInt(2);
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'firstName': req.session['fistName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'fistName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});
app.post(['/shopNext'], function(req, res){
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['end']) <= parseInt(rows.length)){
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 2;
			} else {
				req.session['end'] = parseInt(req.session['end']) + 2;
				req.session['start'] = parseInt(req.session['start']) + 2;
			}
			console.log(req.session['start']);
			res.render('shop', {
				message: '',
				'fistName': req.session['fistName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['end']) <= parseInt(rows.length)){
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 2;
			} else {
				req.session['end'] = parseInt(req.session['end']) + 2;
				req.session['start'] = parseInt(req.session['start']) + 2;
			}
			res.render('shop', {
				message: '',
				'fistName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});
app.post(['/shopBack'], function(req, res){
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['start'])-2 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 2;
			} else {
				req.session['start'] = parseInt(req.session['start']) - 2;
				req.session['end'] = parseInt(req.session['end']) - 2;
			}
			console.log(req.session['start']);
			res.render('shop', {
				message: '',
				'fistName': req.session['fistName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['start'])-2 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 2;
			} else {
				req.session['start'] = parseInt(req.session['start']) - 2;
				req.session['end'] = parseInt(req.session['end']) - 2;
			}
			console.log();
			res.render('shop', {
				message: '',
				'fistName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});

/*/cart
app.post('/cart', (req, res) =>{
	db.all(`SELECT * FROM cart WHERE user = ` + mail, (err, rows) => {
		if (err){
			console.log(err.message);
		}
		else{
			let products = [][];
			for (var i = 1; i < rows.length; i++) {
				products[i][0] = rows[i].pID;
				products[i][1] = rows[i].pStatus;
			}
			res.render('cart', {'products': products || []});
			
			/*const pPicturelink = rows[0].picturelink;
			const pName = rows[0].name;
			const pPrice = rows[0].price;
			const p = rows[0].password;
			console.log(rows);
			res.render('alleArtikel', {'rows':  rows || []});
		}
	})
});
app.post('/oncart/:id', function(req, res){
	const id = req.params['id'];
	const mail = req.session['mail'];
	db.run(`INSERT INTO cart (pID, pStatus) VALUES ('${id}', false) WHERE user =` + mail, (err){
		
		
		//cart
		
	});
});*/

// Register
app.get('/register', (req, res) => {
	res.render('register', {
		'errors': [],
		'fistName': '',
		'surName': '',
		'mail': '',
		'street': '',
		'number': '',
		'postcode': '',
		'place': ''
	});
});
app.post('/onRegister', function(req, res){
	const fistName = req.body["fistName"];
	const surName = req.body["surName"];
	const mail = req.body["mail"];
	const password = req.body["password"];
	const passwordCont = req.body["passwordCont"];
	const street = req.body["street"];
	const number = req.body["number"];
	const postcode = req.body["postcode"];
	const place = req.body["place"];
	
	if(fistName == null || fistName == '' || surName == null || surName == '' || mail == null || mail == '' ||
	password == null || password == '' || passwordCont == null || passwordCont == '' || password != passwordCont || 
	street == null || street == '' || number == null || number == '' || postcode == null || postcode == '' || place == null || place == ''){
		let errors = [];
		if(fistName == null || fistName == ''){
			console.log('Vorname leer');
			errors[0] = 'Bitte Nachnamen eingeben.';
		}
		if(surName == null || surName == ''){
			console.log('Nachname leer');
			errors[1] = 'Bitte Nachnamen eingeben.';
		}
		if(mail == null || mail == ''){
			console.log('Mail leer');
			errors[2] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if(password == null || password == ''){
			console.log('Passwort leer');
			errors[3] = 'Bitte ein Passwort eingeben.';
		}
		if(passwordCont == null || passwordCont == ''){
			console.log('Passwortkontrolle leer');
			errors[4] = 'Bitte Passwort wiederholen.';
		}
		else if(password != passwordCont){
			console.log('Passwort stimmt nicht ueberein');
			errors[5] = 'Passwörter stimmen nicht überein.';
		}
		if(street == null || street == ''){
			console.log('Strasse leer');
			errors[6] = 'Bitte Straße eingeben.';
		}
		if(number == null || number == ''){
			console.log('Hausnummer leer');
			errors[7] = 'Bitte Hausnummer eingeben.';
		}
		if(postcode == null || postcode == ''){
			console.log('PLZ leer');
			errors[8] = 'Bitte Postleitzahl eingeben.';
		}
		if(place == null || place == ''){
			console.log('Ort leer');
			errors[9] = 'Bitte Wohnort eingeben.';
		}
		res.render('register', {
			'errors': errors,
			'fistName': fistName,
			'surName': surName,
			'mail': mail,
			'street': street,
			'number': number,
			'postcode': postcode,
			'place': place	
		});
	} 
	else {
		const sql = `INSERT INTO customers (fistName, surName, mail, password, street, number, postcode, place) VALUES ('${fistName}', '${surName}', '${mail}', '${password}', '${street}', '${number}', '${postcode}', '${place}')`;
		console.log(sql);
		db.run(sql, function(err){
			req.session['fistName'] = fistName;
			req.session['surName'] = surName;
			req.session['mail'] = mail;
			req.session['authenticated'] = true;
			db.all('SELECT * FROM products', function(err, rows){
				res.render('shop', {
					message: 'Willkommen',
					'fistName': req.session['fistName'],
					'surName': req.session['surName'],
					'mail': '',
					'errors': '',
					'logedIn': true,
					
					/// Shop ///
					'rows': rows || []
				});
			});
		});
	}
});

app.post('/onLogIn', function(req, res){
	const mail = req.body["mail"];
	const password = req.body["password"];
	let errors = [];
	
	if(mail == null || mail == '' || password == null || password == ''){
		if (mail == null || mail == ''){
			console.log('Mail leer');
			errors[0] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if (password == null || password == ''){
			console.log('PW leer');
			errors[1] = 'Bitte Passwort eingeben.';
		}
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'fistName': '',
				'surName': '',
				'mail': mail,
				'errors': errors,
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
	else {
		db.all(`SELECT * FROM customers WHERE mail='${mail}'`, (err, rows) => {
			if (err){
				console.log(err.message);
			}
			else{
				const fistName = rows[0].fistName;
				const surName = rows[0].surName;
				const passwordCont = rows[0].password;
				if (password === passwordCont){
					req.session['authenticated'] = true;
					req.session['fistName'] = fistName;
					req.session['surName'] = surName;
					req.session['mail'] = mail;
					db.all('SELECT * FROM products', function(err, rows){
						res.render('shop', {
							message: 'Willkommen',
							'fistName': req.session['fistName'],
							'surName': req.session['surName'],
							'mail': '',
							'errors': errors,
							'logedIn': true,
							
							/// Shop ///
							'start': req.session['start'],
							'end': req.session['end'],
							'rows': rows || []
						});
					});
				}
				else {
					errors[1] = 'Falsches Passwort';
					db.all('SELECT * FROM products', function(err, rows){
						res.render('shop', {
							message: '',
							'fistName': '',
							'surName': '',
							'mail': mail,
							'errors': errors,
							'logedIn': false,
							
							/// Shop ///
							'start': req.session['start'],
							'end': req.session['end'],
							'rows': rows || []
						});
					});
				}
			}
		});
	}
});

/*app.get(['/logedIn'], function(req, res){
	let errors = [];
	if (req.session['authenticated']){
		const fistName = req.body["fistName"];
		const surName = req.body["surName"];
		const mail = req.session['mail'];
		
		res.render('shop', {
			message: 'Willkommen',
			'fistName': fistName,
			'surName': surName,
			'mail': '',
			'errors': '',
			'logedIn': true
		});
	}
	else {
		errors[0] = 'anmeldung erforderlich';
		res.render('shop', {
			message: '',
			'fistName': '',
			'surName': '',
			'mail': '',
			'errors': errors,
			'logedIn': false
		});
	}
});*/

app.post('/onLogOut', function (req, res) {
	//Sessionvariable löschen
	delete req.session['authenticated'];
	db.all('SELECT * FROM products', function(err, rows){
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'fistName': '',
				'surName': '',
				'mail': '',
				'errors': '',
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	});
});