var budgetVM;
if (ko) {
	var LineItemObservable = {
		init : function(lineItemJSON) {
			this.original = lineItemJSON;
			this.category = ko.observable(lineItemJSON.category);
			this.amount = ko.observable(lineItemJSON.amount);
		}
	};
	var MonthlyBudgetObservable = {
		init : function(monthlyBudgetJSON) {
			this.original = monthlyBudgetJSON;
			this.year = ko.observable(monthlyBudgetJSON.year);
			this.month = ko.observable(monthlyBudgetJSON.month);
			this.lineItems = ko.observableArray([]);
			for(index in monthlyBudgetJSON.lineItems) {
				var lineItemObservable = Object.create(LineItemObservable);
				lineItemObservable.init(monthlyBudgetJSON.lineItems[index]);
				this.lineItems().push(lineItemObservable);
			}
		}
	};
	budgetVM = {
		init : function(year) {
			console.log('Setting the year to '+year);
			this.year = ko.observable(year);
			this.budget = ko.observableArray([]);
			this.getYearlyBudget();
		}
	};
	budgetVM.getYearlyBudget = function() {
		console.log('getting the budget for '+this.year());
		var fakeBudget = [{
			_id : {
				$oid : 'fadslfkhads382hfad'
			},
			year : 2013,
			month : 1,
			lineItems : [{
				category : 'Income',
				amount : 2900
			}, {
				category : 'Housing',
				amount : 917
			}]
		}, {
			_id : {
				$oid : 'fadslfkafdss32hfad'
			},
			year : 2013,
			month : 2,
			lineItems : [{
				category : 'Income',
				amount : 2900
			}, {
				category : 'Housing',
				amount : 917
			}]
		}, {
			_id : {
				$oid : 'fadslfkhad2682hfad'
			},
			year : 2013,
			month : 3,
			lineItems : [{
				category : 'Income',
				amount : 3000
			}, {
				category : 'Housing',
				amount : 917
			}]
		}];
		for(index in fakeBudget) {
			console.log(fakeBudget[index]);
			var monthlyObservable = Object.create(MonthlyBudgetObservable);
			monthlyObservable.init(fakeBudget[index]);
			this.budget().push(monthlyObservable);
		}
	};
	budgetVM.printFullMonth = function(month) {
		console.log('printing the month: '+month());
		return BudgetDateUtil.getFullMonthString(month()-1);
	};
	$(function() {
		budgetVM.init(new Date().getFullYear());
		ko.applyBindings(budgetVM);
	});
}