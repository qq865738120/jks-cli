import chalk from "chalk"
import * as figures from "figures"
import { render } from "ink"
import meow from "meow"
import React from "react"
import BuildView from "../ui/BuildView"
import theme from "../ui/common/theme"

export default function build(cli: meow.Result<meow.AnyFlags>, jobs: string[], symbol: string): any {
	if (jobs.length === 0) {
		console.log(
			chalk.hex(theme.mainColorHeight)(
				`${figures.cross} 请携带 --job 或者 --j 属性`
			)
		)
		return
	}
	render(<BuildView cli={cli} jobs={jobs} symbol={symbol} />)
}
