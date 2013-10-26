var budgetVM;
if (ko) {
	var LineItemObservable = {
			init : function(lineItemJSON) {
				this.category = ko.observable(lineItemJSON.category);
				this.type = ko.observable(lineItemJSON.type);
				this.amount = ko.observable(lineItemJSON.amount);
			}
	};
	var MonthObservable = {
			init : function(monthJSON) {
				this.year = ko.observable(monthJSON.year);
				this.month = ko.observable(monthJSON.month);
				this.lineItems = ko.observableArray([]);
				for(index in monthJSON.lineItems) {
					var lineItemObservable = Object.create(LineItemObservable);
					lineItemObservable.init(monthJSON.lineItems[index]);
					this.lineItems.push(lineItemObservable);
				}
			}
	};
	budgetVM = {
		init : function(year) {
			console.log('Setting the year to '+year);
			this.year = ko.observable(year);
			this.budget = ko.observableArray([]);
			this.getYearlyBudget();
			this.lineItemCategories = ko.computed(function() {
				var lineItemCategories = [];
				budgetVM.budget().forEach(function(thatBudget) {
					thatBudget.lineItems().forEach(function(thatLineItem) {
						if(lineItemCategories.indexOf(thatLineItem.category()) === -1) {
							lineItemCategories.push(thatLineItem.category());
						}
					});
				});
				return lineItemCategories;
			});
		}
	};
	budgetVM.totalCategoryTypeThisMonth = function(monthBudget, categoryType) {
		console.log('computing total '+categoryType+' for '+monthBudget.month());
		var total = 0;
		ko.utils.arrayForEach(monthBudget.lineItems(), function(item) {
			if(item.type() === categoryType) {
				total += parseFloat(item.amount());
			}
		});
		return total;
	};
	budgetVM.computeLineItemAmount = function(monthBudget, categoryToMatch) {
		console.log('computing line item amounts');
		console.log(monthBudget.lineItems());
		console.log(categoryToMatch);
		var match = ko.utils.arrayFirst(monthBudget.lineItems(), function(item) {
			console.log('does '+item.category()+' match '+categoryToMatch+'?');
			return item.category() === categoryToMatch;
		});
		if(!match) {
			console.log('no match');
			return 0;
		} else {
			return match.amount;
		}
	};
	budgetVM.computeLineTotalAmount = function(lineItemCategory) {
		console.log('computing total for '+lineItemCategory+' category');
		var total = 0;
		ko.utils.arrayForEach(this.budget(), function(monthlyBudget) {
			var match = ko.utils.arrayFirst(monthlyBudget.lineItems(), function(item) {
				return item.category() === lineItemCategory;
			});
			if(match) {
				total += parseFloat(match.amount());
			}
		});
		console.log('total for '+lineItemCategory+' is '+total);
		return total;
	};
	budgetVM.totalCategoryTypeYTD = function(categoryType) {
		var total = 0;
		ko.utils.arrayForEach(this.budget(), function(monthlyBudget) {
			total += parseFloat(budgetVM.totalCategoryTypeThisMonth(monthlyBudget, categoryType));
		});
		return total;
	};
	budgetVM.monthlyBudgetedTotal = function(monthlyBudget) {
		var total = 0;
		ko.utils.arrayForEach(monthlyBudget.lineItems(), function(item) {
			console.log(item.type());
			if(item.type() === 'income') {
				total += parseFloat(item.amount());
			} else if(item.type() === 'expense') {
				total -= parseFloat(item.amount());
			}
		});
		return total;
	};
	budgetVM.budgetedTotalYTD = function() {
		var total = 0;
		ko.utils.arrayForEach(this.budget(), function(monthlyBudget) {
			total += parseFloat(budgetVM.monthlyBudgetedTotal(monthlyBudget));
		});
		return total;
	};
	budgetVM.getYearlyBudget = function() {
		console.log('getting the budget for '+this.year());
		var fakeBudget = [{
			month : 1,
			year : 2013,
			lineItems : [{
				category : 'Income',
				type : 'income',
				amount : 2901
			}, {
				category : 'Housing',
				type : 'expense',
				amount : 951
			}]
		}, {
			month : 2,
			year : 2013,
			lineItems : [{
				category : 'Income',
				type : 'income',
				amount : 2902
			}, {
				category : 'Housing',
				type : 'expense',
				amount : 952
			}]
		}, {
			month : 3,
			year : 2013,
			lineItems : [{
				category : 'Income',
				type : 'income',
				amount : 2903
			}, {
				category : 'Housing',
				type : 'expense',
				amount : 953
			}]
		}];
		for(index in fakeBudget) {
			var monthObservable = Object.create(MonthObservable);
			monthObservable.init(fakeBudget[index]);
			this.budget().push(monthObservable);
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