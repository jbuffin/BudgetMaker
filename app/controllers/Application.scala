package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {
	
	def budget = Action {
		Ok(views.html.index())
	}

	def javascriptRoutes = Action { implicit request =>
		import routes.javascript._
		Ok(
			Routes.javascriptRouter("jsRoutes")(
				BudgetAPI.getBudgetForYear,
				BudgetAPI.saveBudgetYear
			)
		).as("text/javascript")
	}

}