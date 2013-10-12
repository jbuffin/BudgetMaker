package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class Transaction(_id: JsValue, status: String, date: java.util.Date, description: String, categoryId: String, amount: Double)

object Transaction extends Function6[JsValue, String, java.util.Date, String, String, Double, Transaction] {
	implicit val transactionFormats = Json.format[Transaction]
}