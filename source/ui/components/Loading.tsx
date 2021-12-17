import React, { FC } from "react"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import theme from "../common/theme"

const Loading: FC = props => {
	return (
		<Box>
			<Text color={theme.mainColor}>
				<Spinner type='dots' />
			</Text>
			<Box marginLeft={1}>
				<Text color={theme.mainColor}>{props.children}</Text>
			</Box>
		</Box>
	)
}

export default Loading
