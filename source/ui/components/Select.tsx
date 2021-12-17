import React, { FC } from "react"
import { Box, Text } from "ink"
import theme from "../common/theme"
import SelectInput from "ink-select-input"
import SelectIndicator from "./SelectIndicator"
import SelectItem from "./SelectItem"

export interface ISelectItem {
	value: any
	label: string
}

export interface ISelectProps {
	label: string
	placeholder?: string
	items: ISelectItem[]
	initialIndex?: number
	onConfirm: (item: ISelectItem) => any
}

const Select: FC<ISelectProps> = ({ label, placeholder, items, initialIndex = 0, onConfirm }) => {
	return (
		<Box flexDirection='column'>
			<Box marginBottom={1}>
				<Text color={theme.mainColor}>
					{label}
					<Text color='gray'>{placeholder}</Text>
				</Text>
			</Box>
			<SelectInput
				items={items}
				initialIndex={initialIndex}
				onSelect={onConfirm}
				indicatorComponent={SelectIndicator}
				itemComponent={SelectItem}
			/>
		</Box>
	)
}

export default Select
