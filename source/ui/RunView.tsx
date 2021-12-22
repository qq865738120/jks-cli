import { Box } from "ink"
import React, { FC, useEffect, useMemo, useState } from "react"
import { readSetting } from "./common/settingHelper"
import { ISetForm } from "./components/SetForm"
import shell from "shelljs"
import Tips, { ITipsProps } from "./components/Tips"
import Select from "./components/Select"
import meow from "meow"
import BuildView from "./BuildView"

export interface IRunView {
	cli: meow.Result<meow.AnyFlags>
	quick: string
}

const RunView: FC<IRunView> = ({ quick, cli }) => {
	// 步骤
	const [setup, setSetup] = useState(-1)
	// 是否展示build视图
	const [isShowBuildView, setIsShowBuildView] = useState(false)
	// build视图job参数
	const [buildJobs, setBuildJobs] = useState<string[]>([])
	// build视图symbol参数
	const [buildSymbol, setBuildSymbol] = useState<string>(",")
	// 设置
	const [setting, setSetting] = useState<{
		list?: ISetForm[]
		userInfo?: string
	}>()
	const [quickList, setQuickList] = useState<
		{ label: string; value: string, subLabel: string }[]
	>([])
	// 提示
	const [tips, setTips] = useState<ITipsProps>({
		isShow: false,
		type: "success",
		message: "",
	})

	useEffect(() => {
		setSetting((readSetting() || {}) as any)
	}, [])

	useEffect(() => {
		if (setting) {
			const item = setting.list?.find(item => item.title === quick)
			if (item && item.command) {
				setTips({
					isShow: true,
					type: "info",
					message: "开始运行",
				})
				runCommand(item.command)
			} else {
				setQuickList(
					(setting.list || []).map(item => {
						return {
							label: item.title,
							value: item.command,
							subLabel: item.remark
						}
					})
				)
				if ((setting.list || []).length === 0) {
					setTips({
						isShow: true,
						type: "error",
						message:
							"您还没有设置快捷方式，请使用jks-cli set命令新增一些快捷方式。",
					})
				} else {
					setSetup(0)
				}
			}
		}
	}, [setting])

	const onSelectQuick = (item: any) => {
		setSetup(1)
		setTips({
			isShow: true,
			type: "info",
			message: `快捷方式: ${item.label}`,
		})
		runCommand(item.value)
	}

	const runCommand = (command: string) => {
		if (/^jks-cli\s*build\s*/.test(command)) {
			setIsShowBuildView(true)
			setBuildJobs(
				command
					.replace(/^jks-cli\s*build\s*/, "")
					.split(/\s*(--job|--j)\s*/g)
					.filter(Boolean)
					.filter(
						(item: string) =>
							item !== "--job" && item !== "--j" && !/^--/.test(item)
					)
					.map((item: string) => item.split(/\s*--.*$/g)[0] || "")
			)
			const symbolStr: any = /(--symbol\s*\S*)|(--s\s*\S*)/g.exec(command)
			const symbol = symbolStr ? symbolStr[0].split(/--s(ymbol)?\s*/) : [","]
			setBuildSymbol(symbol.pop())
		} else {
			const result = shell.exec(command)
			if (result.code === 0) {
				setTips({
					isShow: true,
					type: "success",
					message: "运行完成",
				})
			} else {
				setTips({
					isShow: true,
					type: "error",
					message: "出错啦，请检查快捷方式 command 是否正确",
				})
			}
		}
	}

	const build = useMemo(
		() => (
			<BuildView
				cli={cli}
				jobs={buildJobs}
				symbol={buildSymbol}
				onFinish={() =>
					setTips({
						isShow: true,
						type: "success",
						message: "运行完成",
					})
				}
			/>
		),
		[buildJobs, buildSymbol]
	)

	return (
		<Box flexDirection='column'>
			{setup === 0 && (
				<Select
					label='您要运行哪一个快捷方式？'
					items={quickList}
					onConfirm={onSelectQuick}
				/>
			)}

			{setup === 1 && isShowBuildView && build}

			<Tips {...tips}></Tips>
		</Box>
	)
}

export default RunView
