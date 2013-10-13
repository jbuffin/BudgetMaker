var budgetVM;
if (ko) {
	var MonthlyAmountObservable = {
		init : function(monthlyAmountJSON) {
			this.original = monthlyAmountJSON;
			this.year = ko.observable(monthlyAmountJSON.year);
			this.month = ko.observable(monthlyAmountJSON.month);
			this.amount = ko.observable(monthlyAmountJSON.amount);
		}
	};
	var LineItemObservable = {
			init : function(lineItemJSON) {
				this.original = lineItemJSON;
				this.category = ko.observable(lineItemJSON.category);
				this.amounts = ko.observableArray([]);
				for(index in lineItemJSON.amounts) {
					var monthlyAmountObservable = Object.create(MonthlyAmountObservable);
					monthlyAmountObservable.init(lineItemJSON.amounts[index]);
					this.amounts().push(monthlyAmountObservable);
				}
			}
	};
	budgetVM = {
		init : function(year) {
			console.log('Setting the year to '+year);
			this.year = ko.observable(year);
			this.budget = ko.observableArray([]);
			this.getUsedCategories();
			this.getYearlyBudget();
		}
	};
	budgetVM.getUsedCategories = function() {
		console.log('getting the categories for '+this.year());
		this.categories = ko.observableArray(['Income', 'Housing']);
	};
	budgetVM.getYearlyBudget = function() {
		console.log('getting the budget for '+this.year());
		var fakeBudget = [{
			_id : {
				$oid : '5143lj34t1ib'
			},
			category : 'Income',
			amounts : [{
				year : 2013,
				month : 1,
				amount : 2900.00
			}, {
				year : 2013,
				month : 2,
				amount : 2900.00
			}, {
				year : 2013,
				month : 3,
				amount : 3000.00
			}]
		}, {
			_id : {
				$oid : '5143lj3341ib'
			},
			category : 'Housing',
			amounts : [{
				year : 2013,
				month : 1,
				amount : 950.00
			}, {
				year : 2013,
				month : 2,
				amount : 950.00
			}, {
				year : 2013,
				month : 3,
				amount : 950.00
			}]
		}];
		for(index in fakeBudget) {
			console.log(fakeBudget[index]);
			var lineItemObservable = Object.create(LineItemObservable);
			lineItemObservable.init(fakeBudget[index]);
			this.budget().push(lineItemObservable);
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