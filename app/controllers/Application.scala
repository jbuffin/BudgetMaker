package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

	def index = Action {
		Redirect(routes.Application.budget)
	}
	
	def budget = Action {
		Ok(views.html.index())
	}

	def javascriptRoutes = Action { implicit request =>
		import routes.javascript._
		Ok(
			Routes.javascriptRouter("jsRoutes")()
		).as("text/javascript")
	}

}