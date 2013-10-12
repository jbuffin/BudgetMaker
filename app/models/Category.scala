package models

import play.api.libs.json.JsValue
import play.api.libs.json.Json

case class Category(_id: JsValue, name: String)

object Category extends Function2[JsValue, String, Category] {
	implicit val categoryFormats = Json.format[Category]
}