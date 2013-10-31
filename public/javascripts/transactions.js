var theFile = [];
var target = document.getElementById("fileDropZone");
target.addEventListener("dragover", function(e) {
	e.preventDefault();
}, true);
target.addEventListener("drop", function(e) {
	e.preventDefault();
	loadImage(e.dataTransfer.files[0]);
}, true);

function loadImage(src) {
	var reader = new FileReader();
	reader.onload = function(e) {
		theFile = [];
		console.log('begin parsing the file');
		var lines = reader.result.split(/[\r\n|\n]+/);
		lines.forEach(function(line) {
			var parsedLineArr = CSVtoArray(line);
			if(parsedLineArr.length !== 0) {
				var parsedLineObject = Object.create(Transaction);
				parsedLineObject.init(parsedLineArr);
				theFile.push(parsedLineObject);
			}
		});
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
		this.amount = arr[6];
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