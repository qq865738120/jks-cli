import { render } from 'ink';
import meow from 'meow';
import React from "react";
import SetView from '../ui/SetView';

export default function set(cli: meow.Result<meow.AnyFlags>): any {
  render(<SetView cli={cli} />);
}
