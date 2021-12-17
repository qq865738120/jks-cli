import React, { FC } from "react"
import Gradient from "ink-gradient"
import BigText from "ink-big-text"
import Divider from "ink-divider"
import { Box, Static, Text } from "ink"
// import pkg from '../../../package.json'

export interface ILogoProps {
	version?: string
}

const Logo: FC<ILogoProps> = ({ version }) => {
	return (
		<Static items={[version]}>
			{(item) => (
				<Box key={item} flexDirection='column' marginBottom={2}>
					<Gradient name='rainbow'>
						<BigText text='jks-cli' />
					</Gradient>
					<Box marginTop={1} marginBottom={1}>
						<Text color='gray'>用命令行的方式打开Jenkins。</Text>
					</Box>
					<Divider title={item} padding={0} />
				</Box>
			)}
		</Static>
	)
}

export default Logo
