var BudgetDateUtil = {
	getFullMonthString : function(month) {
		return this.months[month].fullString;
	},
	getAbbrMonthString : function(month) {
		return this.months[month].abbrString;
	},
	months : [{
		fullString : 'January',
		abbrString : 'Jan'
	}, {
		fullString : 'February',
		abbrString : 'Feb'
	}, {
		fullString : 'March',
		abbrString : 'Mar'
	}, {
		fullString : 'April',
		abbrString : 'Apr'
	}, {
		fullString : 'May',
		abbrString : 'May'
	}, {
		fullString : 'June',
		abbrString : 'June'
	}, {
		fullString : 'July',
		abbrString : 'Jul'
	}, {
		fullString : 'August',
		abbrString : 'Aug'
	}, {
		fullString : 'September',
		abbrString : 'Sept'
	}, {
		fullString : 'October',
		abbrString : 'Oct'
	}, {
		fullString : 'November',
		abbrString : 'Nov'
	}, {
		fullString : 'December',
		abbrString : 'Dec'
	}]
};

