package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class LineItem(category: Category, amount: Double)

case class MonthlyBudget(month: Int, lineItem: List[LineItem])

case class Budget(_id: JsValue, budget: List[MonthlyBudget])

object BudgetFormats {
	implicit val lineItemFormat = Json.format[LineItem]
	implicit val monthlyBudgetFormat = Json.format[MonthlyBudget]
	implicit val budgetFormat = Json.format[Budget]
}