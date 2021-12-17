import { Box } from "ink"
import React, { FC, useEffect, useState } from "react"
import { readSetting } from "./common/settingHelper"
import { ISetForm } from "./components/SetForm"
import Tips, { ITipsProps } from "./components/Tips"
import Logo from "./components/Logo"
import meow from "meow"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jenkinsapi = require("jenkins-api")

export interface IStopView {
	cli: meow.Result<meow.AnyFlags>
	jobs: string[]
	symbol: string
}

let jenkins: any = null

const StopView: FC<IStopView> = ({ cli, jobs, symbol }) => {
	// 设置
	const [setting, setSetting] = useState<{
		list?: ISetForm[]
		userInfo?: string
	}>()
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
			if (setting.userInfo) {
				jenkins = jenkinsapi.init(setting.userInfo)
			} else {
				setTips({
					isShow: true,
					type: "error",
					message: "请先设置用户信息，使用 jks-cli set 命令。",
				})
			}

			const jobsSet = new Set(jobs)
			for (const job of jobsSet) {
				const params = job.split(symbol)
				if (params.length === 2) {
					jenkins.stop_build(params[1], params[0], (err: any) => {
						if (err){
							setTips({
								isShow: true,
								type: "error",
								message: `[${params[1]}]: ${err}`,
							})
						} else {
							setTips({
								isShow: true,
								type: "success",
								message: `${params[1]} 取消构建成功`,
							})
						}
					});
				} else {
					setTips({
						isShow: true,
						type: "info",
						message: `${job} 参数格式不正确。`,
					})
				}
			}
		}
	}, [setting])

	return (
		<Box flexDirection='column'>
			<Logo version={cli.pkg.version} />

			<Tips {...tips}></Tips>
		</Box>
	)
}

export default StopView
