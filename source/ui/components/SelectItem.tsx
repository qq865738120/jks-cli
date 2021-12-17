import * as React from "react"
import type { FC } from "react"
import { Text } from "ink"
import theme from "../common/theme"

export interface Props {
	isSelected?: boolean
	label: string
}

const SelectItem: FC<Props> = ({ isSelected = false, label }) => (
	<Text color={isSelected ? theme.mainColor : undefined}>{label}</Text>
)

export default SelectItem
