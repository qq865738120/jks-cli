import React from "react"
import { Text } from "ink"
import theme from "../common/theme"

const TableHeader: React.PropsWithChildren<any> = (props: any) => {
	return (
		<Text bold color={theme.secondColor}>
			{props.children}
		</Text>
	)
}

export default TableHeader
