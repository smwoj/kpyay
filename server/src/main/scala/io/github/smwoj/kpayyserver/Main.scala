package io.github.smwoj.kpayyserver

import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits._

object Main extends IOApp {
  def run(args: List[String]) =
    KpayyserverServer.stream[IO].compile.drain.as(ExitCode.Success)
}