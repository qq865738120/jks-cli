import { render } from "ink"
import meow from "meow"
import React from "react"
import AboutView from "../ui/AboutView"

export default function about(cli: meow.Result<meow.AnyFlags>): any {
	render(<AboutView cli={cli} />)
}
