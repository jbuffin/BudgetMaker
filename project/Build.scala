import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

	val appName = "BudgetMaker"
	val appVersion = "1.0-SNAPSHOT"

	val appDependencies = Seq(
		jdbc,
		anorm,
		"org.reactivemongo" %% "play2-reactivemongo" % "0.9"
	)

	val main = play.Project(appName, appVersion, appDependencies).settings()

}
