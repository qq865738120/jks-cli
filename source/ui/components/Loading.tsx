import React, { FC, useEffect, useState } from "react"
import { Box, Text } from "ink"
import theme from "../common/theme"

const Loading: FC = props => {
	const [frame, setFrame] = useState(0)
	const [frameArr] = useState({
		interval: 80,
		frames: [
			"⠋",
			"⠙",
			"⠹",
			"⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"
		],
	})

	useEffect(() => {
		const timer = setInterval(() => {
			setFrame(
				(previousFrame: number) => (previousFrame + 1) % frameArr.frames.length
			)
		}, frameArr.interval)
		return () => {
			clearInterval(timer)
		}
	}, [])

	return (
		<Box>
			<Text color={theme.mainColor}>{frameArr.frames[frame]}</Text>
			<Box marginLeft={1}>
				<Text color={theme.secondColor}>{props.children}</Text>
			</Box>
		</Box>
	)
}

export default Loading
