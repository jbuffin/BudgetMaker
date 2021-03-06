package controllers

import play.api._
import play.modules.reactivemongo.MongoController
import play.api.mvc._
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.api.Cursor
import play.api.libs.json._
import scala.concurrent.Future
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import models.MonthlyBudget
import models.BudgetFormats._
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._

object BudgetAPI extends Controller with MongoController {
	def budgetCollection: JSONCollection = db.collection[JSONCollection]("budget")
	
	def getBudgetForYear(year: Int) = Action {
		Async {
			val cursor: Cursor[JsValue] = budgetCollection.find(Json.obj("year" -> year)).sort(Json.obj("month" -> 1)).cursor[JsValue]
			val futureBudget: Future[List[JsValue]] = cursor.toList
			futureBudget.map { budget =>
				if(budget.length > 0) {
					Logger.debug("found a budget")
					Ok(Json.toJson(budget))
				} else {
					Logger.debug("make a new budget")
					getNewBudget(year)
				}
			}
		}
	}
	
	def getNewBudget(year: Int) = {
		val objectId = BSONObjectID.generate
		val fromCaseClass = Json.toJson(MonthlyBudget(Option(Json.toJson(objectId)), year, 1))
		val futureResult = budgetCollection.insert(fromCaseClass)
		Async {
			futureResult.map(_ => Ok(Json.arr(fromCaseClass)))
		}
	}
	
	def saveBudgetYear = Action(parse.json) { request =>
		request.body.\("budget").validate[List[MonthlyBudget]].map { budgets =>
			budgets.map { budget =>
				val futureResult = budgetCollection.save(budget)
					Async {
						futureResult.map(_ => Ok("Ok"))
					}
			}
			Ok("saved")
		}.recoverTotal { error =>
			BadRequest(Json.obj("res" -> "KO") ++ Json.obj("error" -> JsError.toFlatJson(error)))
		}
	}
	
}