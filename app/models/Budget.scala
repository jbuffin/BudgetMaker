package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class LineItem(category: String, categoryType: String, amount: Double)

case class MonthlyBudget(_id: Option[JsValue], year: Int, month: Int, lineItems: List[Option[LineItem]] = List())

object BudgetFormats {
	implicit val lineItemFormat = Json.format[LineItem]
	implicit val monthlyBudgetFormat = Json.format[MonthlyBudget]
}