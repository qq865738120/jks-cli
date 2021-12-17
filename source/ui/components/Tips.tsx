
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Box, Text } from "ink"
import theme from "../common/theme"
import * as figures from "figures"

export type ITipsPropsType = "success" | "error" | "info"

export interface ITipsProps {
	isShow: boolean
	type?: ITipsPropsType
	message?: string
}

export interface ITips {
	clear: () => any
}


// eslint-disable-next-line react/display-name
export default forwardRef<ITips, ITipsProps>(({
	// eslint-disable-next-line react/prop-types
	isShow = false,
	// eslint-disable-next-line react/prop-types
	type = "success",
	// eslint-disable-next-line react/prop-types
	message,
}, ref) => {
	const [option, setOption] = useState({ type, message })
	const [oldOption, setOldOption] = useState({ type, message })
	const [oldOption2, setOldOption2] = useState({ type, message })
	const [oldOption3, setOldOption3] = useState({ type, message })

	useImperativeHandle(ref, () => ({
    clear
  }));

	useEffect(() => {
		clear()
	}, [])

	useEffect(() => {
		setOldOption3(oldOption2)
		setOldOption2(oldOption)
		setOldOption(option)
		setOption({ type, message })
	}, [message, type])

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const clear = () => {
		setOption({ type: "success", message: "" })
		setOldOption({ type: "success", message: "" })
		setOldOption2({ type: "success", message: "" })
		setOldOption3({ type: "success", message: "" })
	}

	return isShow ? (
		<Box marginTop={2} flexDirection='column'>
			<Box>
				{option.type === "success" && (
					<>
						<Text color={theme.secondColor}>{figures.tick}</Text>
						<Box marginLeft={1}>
							<Text color={theme.secondColor}>{option.message || "成功"}</Text>
						</Box>
					</>
				)}
				{option.type === "error" && (
					<>
						<Text color={theme.mainColorHeight}>{figures.cross}</Text>
						<Box marginLeft={1}>
							<Text color={theme.mainColorHeight}>
								{option.message || "出错了"}
							</Text>
						</Box>
					</>
				)}
				{option.type === "info" && (
					<>
						<Text color={theme.lastColor}>{figures.info}</Text>
						<Box marginLeft={1}>
							<Text color={theme.lastColor}>
								{option.message || "温馨提示"}
							</Text>
						</Box>
					</>
				)}
			</Box>

			{(oldOption.type !== option.type ||
				oldOption.message !== option.message) &&
			oldOption.message ? (
				<Box>
					{oldOption.type === "success" && (
						<>
							<Text color='#999' dimColor>
								{figures.tick}
							</Text>
							<Box marginLeft={1}>
								<Text color='#999' dimColor>
									{oldOption.message}
								</Text>
							</Box>
						</>
					)}
					{oldOption.type === "error" && (
						<>
							<Text color='#999' dimColor>
								{figures.cross}
							</Text>
							<Box marginLeft={1}>
								<Text color='#999' dimColor>
									{oldOption.message || "出错了"}
								</Text>
							</Box>
						</>
					)}
					{oldOption.type === "info" && (
						<>
							<Text color='#999' dimColor>
								{figures.info}
							</Text>
							<Box marginLeft={1}>
								<Text color='#999' dimColor>
									{oldOption.message || "温馨提示"}
								</Text>
							</Box>
						</>
					)}
				</Box>
			) : null}

			{(oldOption2.type !== oldOption.type ||
				oldOption2.message !== oldOption.message) &&
			oldOption2.message ? (
				<Box>
					{oldOption2.type === "success" && (
						<>
							<Text color='#666' dimColor>
								{figures.tick}
							</Text>
							<Box marginLeft={1}>
								<Text color='#666' dimColor>
									{oldOption2.message}
								</Text>
							</Box>
						</>
					)}
					{oldOption2.type === "error" && (
						<>
							<Text color='#666' dimColor>
								{figures.cross}
							</Text>
							<Box marginLeft={1}>
								<Text color='#666' dimColor>
									{oldOption2.message || "出错了"}
								</Text>
							</Box>
						</>
					)}
					{oldOption2.type === "info" && (
						<>
							<Text color='#666' dimColor>
								{figures.info}
							</Text>
							<Box marginLeft={1}>
								<Text color='#666' dimColor>
									{oldOption2.message || "温馨提示"}
								</Text>
							</Box>
						</>
					)}
				</Box>
			) : null}

			{(oldOption3.type !== oldOption2.type ||
				oldOption3.message !== oldOption2.message) &&
			oldOption3.message ? (
				<Box>
					{oldOption3.type === "success" && (
						<>
							<Text color='#333' dimColor>
								{figures.tick}
							</Text>
							<Box marginLeft={1}>
								<Text color='#333' dimColor>
									{oldOption3.message}
								</Text>
							</Box>
						</>
					)}
					{oldOption3.type === "error" && (
						<>
							<Text color='#333' dimColor>
								{figures.cross}
							</Text>
							<Box marginLeft={1}>
								<Text color='#333' dimColor>
									{oldOption3.message || "出错了"}
								</Text>
							</Box>
						</>
					)}
					{oldOption3.type === "info" && (
						<>
							<Text color='#333' dimColor>
								{figures.info}
							</Text>
							<Box marginLeft={1}>
								<Text color='#333' dimColor>
									{oldOption3.message || "温馨提示"}
								</Text>
							</Box>
						</>
					)}
				</Box>
			) : null}
		</Box>
	) : null
})
