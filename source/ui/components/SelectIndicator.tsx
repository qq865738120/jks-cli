import * as React from 'react';
import type {FC} from 'react';
import {Box, Text} from 'ink';
import * as figures from 'figures';
import theme from '../common/theme';

export interface Props {
	isSelected?: boolean;
}

const SelectIndicator: FC<Props> = ({isSelected = false}) => (
	<Box marginRight={1}>
		<Text color={theme.mainColor}>{isSelected ? figures.radioOn : figures.radioOff}</Text>
	</Box>
);

export default SelectIndicator;
