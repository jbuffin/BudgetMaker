package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class LineItem(category: String, amount: Double)

case class MonthlyBudget(_id: JsValue, year: Int, month: Int, lineItems: List[LineItem])

object BudgetFormats {
	implicit val lineItemFormat = Json.format[LineItem]
	implicit val monthlyBudgetFormat = Json.format[MonthlyBudget]
}