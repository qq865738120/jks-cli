import { Box } from "ink"
import React, { FC, useEffect, useState } from "react"
import { readSetting } from "./common/settingHelper"
import { ISetForm } from "./components/SetForm"
import shell from "shelljs"
import Tips, { ITipsProps } from "./components/Tips"
import Select from "./components/Select"
import meow from "meow"

export interface IRunView {
	cli: meow.Result<meow.AnyFlags>
	quick: string
}

const RunView: FC<IRunView> = ({ quick }) => {
	// 步骤
	const [setup, setSetup] = useState(-1)
	// 设置
	const [setting, setSetting] = useState<{
		list?: ISetForm[]
		userInfo?: string
	}>()
	const [quickList, setQuickList] = useState<
		{ label: string; value: string }[]
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
					message: "正在运行...",
				})
				runCommand(item.command)
			} else {
				setQuickList(
					(setting.list || []).map(item => {
						return {
							label: item.title,
							value: item.command,
						}
					})
				)
				if ((setting.list || []).length === 0) {
					setTips({
						isShow: true,
						type: "error",
						message: "您还没有设置快捷方式，请使用jks-cli set命令新增一些快捷方式。",
					})
				} else {
					setSetup(0)
				}
			}
		}
	}, [setting])

	const onSelectQuick = (item: any) => {
		setSetup(-1)
		setTips({
			isShow: true,
			type: "info",
			message: "正在运行...",
		})
		runCommand(item.value)
	}

	const runCommand = (command: string) => {
		const result = shell.exec(command)
		// console.log("result", result)
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

	return (
		<Box flexDirection='column'>
			{setup === 0 && (
				<Select
					label='您要运行哪一个快捷方式？'
					items={quickList}
					onConfirm={onSelectQuick}
				/>
			)}

			<Tips {...tips}></Tips>
		</Box>
	)
}

export default RunView
