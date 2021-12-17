#!/usr/bin/env node
import meow from "meow"
import about from "./cli/about"
import build from "./cli/build"
import help from "./cli/help"
import option from "./cli/option"
import run from "./cli/run"
import stop from "./cli/stop"
import set from "./cli/set"

const cli = meow(help, option)
const buildJobs: string[] = cli.unnormalizedFlags['job'] as any;

switch (cli.input[0]) {
	case "set":
		set(cli)
		break
	case "build":
		build(cli, buildJobs, cli.unnormalizedFlags['symbol'] as string)
		break
	case "run":
		run(cli, cli.unnormalizedFlags['quick'] as string)
		break
	case "stop":
		stop(cli, buildJobs, cli.unnormalizedFlags['symbol'] as string)
		break
	case "about":
		about(cli)
		break
	default:
		cli.showHelp()
		break
}
