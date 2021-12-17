import React from "react"
import { Box, Text } from "ink"

export function TableCell(props: React.PropsWithChildren<any>) {
	return (
		<Box>
			<Text wrap="truncate">{props.children}</Text>
		</Box>
	)
}
