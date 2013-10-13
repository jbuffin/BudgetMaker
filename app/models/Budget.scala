package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class MonthlyAmount(year: Int, month: Int, amount: Double)

case class LineItem(_id: JsValue, category: String, amounts: List[MonthlyAmount])


object BudgetFormats {
	implicit val monthlyBudgetFormat = Json.format[MonthlyAmount]
	implicit val lineItemFormat = Json.format[LineItem]
}