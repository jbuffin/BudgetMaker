var budgetVM;
var budgetIsFake = true;
var fakeBudget = JSON.parse('[{"_id":{"$oid":"526c0ba1c8bc073001a048d4"},"year":2013,"month":1,"lineItems":[]}]');
function toggleFakeBudget() {
	budgetIsFake = !budgetIsFake;
	budgetVM.getYearlyBudget(budgetIsFake);
}
budgetLogger.setLevel('trace');
if (ko) {
	var LineItemObservable = {
		init : function(lineItemJSON) {
			console.log(lineItemJSON);
			this.category = lineItemJSON.category;
			this.categoryType = ko.observable(lineItemJSON.categoryType);
			this.amount = ko.observable(lineItemJSON.amount);
			console.log(ko.toJSON(this));
		}
	};
	var MonthObservable = {
		init : function(monthJSON) {
			console.log(monthJSON);
			if (monthJSON._id) {
				this._id = monthJSON._id;
			}
			this.year = ko.observable(monthJSON.year);
			this.month = ko.observable(monthJSON.month);
			this.lineItems = ko.observableArray([]);
			for (index in monthJSON.lineItems) {
				var lineItemObservable = Object.create(LineItemObservable);
				lineItemObservable.init(monthJSON.lineItems[index]);
				this.lineItems.push(lineItemObservable);
			}
		}
	};
	budgetVM = {
		init : function(year) {
			console.log('Setting the year to ' + year);
			this.year = ko.observable(year);
			this.budget = ko.observableArray([]);
			this.getYearlyBudget(budgetIsFake);
			this.lineItemCategories = ko.computed(function() {
				var lineItemCategories = [];
				budgetVM.budget().forEach(function(thatBudget) {
					thatBudget.lineItems().forEach(function(thatLineItem) {
						if (lineItemCategories.indexOf(thatLineItem.category) === -1) {
							lineItemCategories.push(thatLineItem.category);
						}
					});
				});
				return lineItemCategories;
			});
		}
	};
	budgetVM.totalCategoryTypeThisMonth = function(monthBudget, categoryType) {
		console.log('computing total ' + categoryType + ' for ' + monthBudget.month());
		var total = 0;
		ko.utils.arrayForEach(monthBudget.lineItems(), function(item) {
			if (item.categoryType() === categoryType) {
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
			console.log('does ' + item.category + ' match ' + categoryToMatch + '?');
			return item.category === categoryToMatch;
		});
		if (!match) {
			console.log('no match');
			return 0;
		} else {
			return match.amount;
		}
	};
	budgetVM.computeLineTotalAmount = function(lineItemCategory) {
		console.log('computing total for ' + lineItemCategory + ' category');
		var total = 0;
		ko.utils.arrayForEach(this.budget(), function(monthlyBudget) {
			var match = ko.utils.arrayFirst(monthlyBudget.lineItems(), function(item) {
				return item.category === lineItemCategory;
			});
			if (match) {
				total += parseFloat(match.amount());
			}
		});
		console.log('total for ' + lineItemCategory + ' is ' + total);
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
			console.log(item.categoryType());
			if (item.categoryType() === 'income') {
				total += parseFloat(item.amount());
			} else if (item.categoryType() === 'expense') {
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
	budgetVM.addMonth = function() {
		var newMonthJS = ko.toJS(this.budget()[this.budget().length - 1]);
		console.log(newMonthJS);
		newMonthJS.month += 1;
		if (newMonthJS._id) {
			delete newMonthJS._id;
		}
		console.log(newMonthJS.month);
		var newMonth = Object.create(MonthObservable);
		newMonth.init(newMonthJS);
		console.log(newMonthJS);
		console.log(newMonth);
		this.budget.push(newMonth);
	};
	budgetVM.addLineItem = function() {
		var newCategory = $('#addCategoryModalInput').val();
		var newCategoryType = $('#addCategoryModalType').val();
		if (newCategory) {
			console.log(newCategory);
			ko.utils.arrayForEach(this.budget(), function(monthlyBudget) {
				var lineItemObservable = Object.create(LineItemObservable);
				var newLineItem = {
					category : newCategory,
					categoryType : newCategoryType,
					amount : 0
				};
				lineItemObservable.init(newLineItem);
				monthlyBudget.lineItems.push(lineItemObservable);
			});
		}
		$('#addCategoryModal').modal('toggle');
		$('#addCategoryModalInput').val('')
	};
	budgetVM.getYearlyBudget = function(fake) {
		budgetVM.budget([]);
		console.log('getting the budget for ' + this.year());
		jsRoutes.controllers.BudgetAPI.getBudgetForYear(this.year()).ajax({
			success : budgetVM.buildBudgetFromJSON
		});
	};
	budgetVM.buildBudgetFromJSON = function(budgetJSON) {
		budgetVM.budget.removeAll();
		if (budgetIsFake) {
			budgetJSON = fakeBudget;
		}
		for (index in budgetJSON) {
			var monthObservable = Object.create(MonthObservable);
			monthObservable.init(budgetJSON[index]);
			budgetVM.budget.push(monthObservable);
		}
	}
	budgetVM.saveBudget = function() {
		console.log(ko.toJSON(this));
		jsRoutes.controllers.BudgetAPI.saveBudgetYear().ajax({
			data : ko.toJSON(this),
			contentType : 'text/json',
			success : function(ret) {
				console.log(JSON.stringify(ret));
			}
		});
	};
	budgetVM.printFullMonth = function(month) {
		console.log('printing the month: ' + month());
		return BudgetDateUtil.getFullMonthString(month() - 1);
	};
	$(function() {
		budgetVM.init(new Date().getFullYear());
		ko.applyBindings(budgetVM);
	});
}