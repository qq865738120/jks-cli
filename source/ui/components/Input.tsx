import React, { FC, useState } from "react"
import { Box, Text } from "ink"
import TextInput from "ink-text-input"
import theme from "../common/theme"

export interface IInputProps {
	label: string
	initValue?: string
	placeholder: string
	onConfirm: (value: any) => any
}

const Input: FC<IInputProps> = ({ label, placeholder, initValue, onConfirm }) => {
	const [value, setValue] = useState(initValue);

	const onSubmit = (value: any) => {
		onConfirm(value)
	}

	const onChange = (value: any) => {
		setValue(value)
	}

	return (
		<Box>
			<Box marginRight={1}>
				<Text color={theme.mainColor}>{label}</Text>
			</Box>
			<TextInput
				value={value || ''}
				placeholder={placeholder}
				showCursor
				onSubmit={onSubmit}
				onChange={onChange}
			/>
		</Box>
	)
}

export default Input
