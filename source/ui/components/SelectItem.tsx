import * as React from "react"
import type { FC } from "react"
import { Text, Box } from "ink"
import theme from "../common/theme"

export interface Props {
	isSelected?: boolean
	label: string
	subLabel?: string
}

const SelectItem: FC<Props> = ({ isSelected = false, label, subLabel }) => (
	<Box flexDirection='row'>
		<Text color={isSelected ? theme.mainColor : undefined}>{label}</Text>
		{subLabel && (
			<Box marginLeft={1}>
				<Text color='gray' dimColor={!isSelected}>({subLabel})</Text>
			</Box>
		)}
	</Box>
)

export default SelectItem
