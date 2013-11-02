var theFile = [];

var transactionVM;
var fake = true;
var fakeTransactions = [{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/12/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/12/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -21.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/12/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -52.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/13/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('9/12/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -13.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('9/13/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('9/14/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('9/15/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/7/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/8/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/9/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
},{
	"_id":{"$oid":"12341256"},
	status : 'posted',
	date : new Date('10/23/2013'),
	description : "Aldi store 1455",
	category : 'Grocery',
	amount : -12.00,
	newTransaction : false
}];

if(ko) {
	var transactionVM = {
		init : function(year) {
			this.year = ko.observable(year);
			this.transactions = ko.observableArray([]);
			this.getYearlyTransactions(fake);
			this.fileProcessing = ko.observable(false);
			this.monthsComputed = ko.computed(function() {
				var monthsInScope = [];
				if(transactionVM.transactions()) {
					console.log('computing months');
					ko.utils.arrayForEach(transactionVM.transactions(), function(transaction) {
						console.log(transaction.date.getMonth());
						if(monthsInScope.indexOf(transaction.date.getMonth()) === -1) {
							monthsInScope.push(transaction.date.getMonth())
						}
					});
				}
				return monthsInScope;
			});
			this.transactionsForMonthComputed = function(month) {
				var transactionsForMonth = [];
				ko.utils.arrayForEach(transactionVM.transactions(), function(transaction) {
					console.log(transaction.date.getMonth()+' === '+month);
					if(transaction.date.getMonth() === month) {
						transactionsForMonth.push(transaction);
					}
				});
				return transactionsForMonth;
			};
		}
	}
	transactionVM.getYearlyTransactions = function(fake) {
		transactionVM.transactions([]);
		transactionVM.transactions(fakeTransactions);
	};
	
	$(function() {
		transactionVM.init(new Date().getFullYear());
		ko.applyBindings(transactionVM);
	});
}
transactionVM.dropZoneText = ko.computed(function() {
	if(this.fileProcessing) {
		return 'Processing File...';
	} else {
		return 'Drop File Here';
	}
});

var target = document.getElementById("fileDropZone");
if(target) {
	target.addEventListener("dragover", function(e) {
		e.preventDefault();
	}, true);
	target.addEventListener("drop", function(e) {
		e.preventDefault();
		loadCSV(e.dataTransfer.files[0]);
	}, true);
}
function loadCSV(src) {
	var reader = new FileReader();
	reader.onload = function(e) {
		transactionVM.fileProcessing(true);
		console.log('begin parsing the file');
		var lines = reader.result.split(/[\r\n|\n]+/);
		lines.forEach(function(line) {
			var parsedLineArr = CSVtoArray(line);
			if(parsedLineArr.length !== 0) {
				var parsedLineObject = Object.create(Transaction);
				parsedLineObject.init(parsedLineArr);
				transactionVM.transactions.push(parsedLineObject);
			}
		});
		transactionVM.fileProcessing(false);
		console.log('done parsing the file');
	};
	reader.readAsText(src);
}

var Transaction = {
	init : function(arr) {
		this.status = arr[0];
		this.date = new Date(arr[2]);
		this.description = arr[4];
		this.category = arr[5];
		this.amount = parseFloat(arr[6]);
		this.newTransaction = true;
	}
};

function CSVtoArray(text) {
	var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	// Return NULL if input string is not well formed CSV string.
	if (!re_valid.test(text))
		return null;
	var a = []; // Initialize array to receive values.
	text.replace(re_value, // "Walk" the string using replace with callback.
	function(m0, m1, m2, m3) {
		// Remove backslash from \' in single quoted values.
		if (m1 !== undefined)
			a.push(m1.replace(/\\'/g, "'"));
		// Remove backslash from \" in double quoted values.
		else if (m2 !== undefined)
			a.push(m2.replace(/\\"/g, '"'));
		else if (m3 !== undefined)
			a.push(m3);
		return ''; // Return empty string.
	});
	// Handle special case of empty last value.
	if (/,\s*$/.test(text))
		a.push('');
	return a;
};