import { render } from 'ink';
import meow from 'meow';
import React from "react";
import RunView from '../ui/RunView';

export default function run(cli: meow.Result<meow.AnyFlags>, quick: string): any {
  render(<RunView cli={cli} quick={quick} />);
}
