import { Box, Newline, Text } from "ink"
import React, { FC } from "react"
import theme from "./common/theme"
import Logo from "./components/Logo"
import * as figures from "figures"
import meow from "meow"

interface IAboutView {
	cli: meow.Result<meow.AnyFlags>
}

const AboutView: FC<IAboutView> = ({ cli }) => {
	return (
		<Box flexDirection='column'>
			<Logo version={cli.pkg.version} />

			<Box flexDirection='column' width={80}>
				<Text color={theme.mainColor} bold>
					作者：
				</Text>
				<Text>code_xia</Text>
				<Newline></Newline>
				<Text color={theme.mainColor} bold>
					邮箱：
				</Text>
				<Text>zhengwenjun1994@gmail.com</Text>
				<Newline></Newline>
				<Text color={theme.mainColor} bold>
					QQ：
				</Text>
				<Text>865738120</Text>
				<Newline></Newline>
				<Text color={theme.mainColor} bold>
					GitHub：
				</Text>
				<Text>https://github.com/qq865738120/jks-cli</Text>
				<Newline></Newline>
				<Text color={theme.mainColor} bold>
					未来规划：
				</Text>
				<Box>
					<Box marginRight={1}>
						<Text color={theme.secondColor}>{figures.circleFilled}</Text>
					</Box>
					<Text>构建项目功能</Text>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text color={theme.secondColor}>{figures.circleFilled}</Text>
					</Box>
					<Text>构建完成通知功能</Text>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text color={theme.secondColor}>{figures.circleFilled}</Text>
					</Box>
					<Text>快捷方式功能</Text>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text color={theme.secondColor}>{figures.circleFilled}</Text>
					</Box>
					<Text>导入导出设置功能</Text>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text color={theme.secondColor}>{figures.circle}</Text>
					</Box>
					<Text>Jenkins控制台输出、日志查看等功能</Text>
				</Box>
				<Newline></Newline>
				<Text color={theme.mainColor} bold>
					作者的话：
				</Text>
				<Text>
					<Text color={theme.secondColor} bold>
						jks-cli
					</Text>
					的初衷是让Jenkins的使用更加简便，
					<Text color={theme.secondColor} bold>
						不需要在web页面上搜索选择构建参数等复杂繁琐的操作
					</Text>
					。只需要一行命令就能完成花式构建。操作简单，但功能却很丰富。
					<Text color={theme.secondColor} bold>
						jks-cli
					</Text>
					友好的视觉交互体验得益于
					<Text color={theme.secondColor} bold>
						ink
					</Text>
					强大的功能。
				</Text>
			</Box>
		</Box>
	)
}

export default AboutView
