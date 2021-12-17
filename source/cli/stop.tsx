import chalk from 'chalk';
import { render } from 'ink';
import React from "react";
import theme from '../ui/common/theme';
import StopView from '../ui/StopView';
import * as figures from "figures"
import meow from 'meow';

export default function stop(cli: meow.Result<meow.AnyFlags>, jobs: string[], symbol: string): any {
  if (jobs.length === 0) {
		console.log(
			chalk.hex(theme.mainColorHeight)(
				`${figures.cross} 请携带 --job 或者 --j 属性`
			)
		)
		return
	}
  render(<StopView cli={cli} jobs={jobs} symbol={symbol} />);
}
