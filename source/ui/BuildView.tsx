import { Box } from "ink"
import React, { FC, useEffect, useState } from "react"
import { readSetting } from "./common/settingHelper"
import Loading from "./components/Loading"
import MyTable from "./components/MyTable"
import { ISetForm } from "./components/SetForm"
import Tips, { ITipsProps } from "./components/Tips"
// import { TaskList, Task } from 'ink-task-list';
// import theme from "./common/theme"
import Logo from "./components/Logo"
import meow from "meow"
// import * as figures from "figures"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jenkinsapi = require("jenkins-api")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const notifier = require("node-notifier")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

export interface IBuildView {
	cli: meow.Result<meow.AnyFlags>
	jobs: string[]
	symbol: string
}

let jenkins: any = null

const BuildView: FC<IBuildView> = ({ cli, jobs, symbol }) => {
	// 设置
	const [setting, setSetting] = useState<{
		list?: ISetForm[]
		userInfo?: string
	}>()
	const [buildParams, setBuildParams] = useState<any>()
	const [tableData, setTableData] = useState<any[]>([])
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
				setTimeout(() => {
					process.exit(1)
				}, 0)
				return
			}

			// console.log("jobs", jobs, symbol)
			const jobsSet = new Set(jobs)
			const jobsParams: any = {}
			const tableData: any[] = []
			for (const job of jobsSet) {
				const params = job.split(symbol)
				if (params.length === 3) {
					jobsParams[params[2] as string] =
						jobsParams[params[2] as string] || {}
					jobsParams[params[2] as string][params[0] as string] = params[1]
					if (!tableData.find(item => item.job === params[2])) {
						tableData.push({ job: params[2], buildNumber: "", state: "DOING" })
					}
				} else {
					setTips({
						isShow: true,
						type: "info",
						message: `${job} 参数格式不正确，不进行构建。`,
					})
				}
			}
			// console.log("jobsParams", jobsParams)
			setBuildParams(jobsParams)
			setTableData(tableData)
		}
	}, [setting])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-extra-semi
		;(async () => {
			if (buildParams) {
				const jobNames = Object.keys(buildParams)
				const actionList = jobNames.map(item => actionBuild(item))
				const resultArr = await Promise.all(actionList)
				const buildInfoList = resultArr.map(item =>
					lastBuildInfo(item as string)
				)
				const buildInfoArr = await Promise.all(buildInfoList)
				buildInfoArr.map((item: any) => {
					startInterval(item.jobName, item.buildName)
				})
			}
		})()
	}, [buildParams])

	const actionBuild = (jobName: string) => {
		return new Promise((resolve, reject) => {
			jenkins.build_with_params(jobName, buildParams[jobName], (err: any) => {
				if (err) {
					setTips({
						isShow: true,
						type: "error",
						message: `[${jobName}]: ${err}`,
					})
					reject(err)
				} else {
					resolve(jobName)
				}
			})
		})
	}

	const lastBuildInfo = (jobName: string) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				jenkins.last_build_info(
					jobName,
					{},
					(err: any, lastBuildInfoData: any) => {
						// console.log("err", err, lastBuildInfoData)
						if (err) {
							setTips({
								isShow: true,
								type: "error",
								message: `[${jobName}]: ${err}`,
							})
							reject(err)
						}

						resolve({ jobName, buildName: lastBuildInfoData.number })
					}
				)
			}, 12000)
		})
	}

	const buildInfo = (jobName: string, buildNumber: number) => {
		return new Promise((resolve, reject) => {
			jenkins.build_info(
				jobName,
				buildNumber,
				{},
				(err: any, buildInfoData: any) => {
					if (err) {
						setTips({
							isShow: true,
							type: "error",
							message: `[${jobName}]: ${err}`,
						})
						reject(err)
					}

					// console.log("tableData-----------", jobName, tableData)
					const currentIndex = tableData.findIndex(item => item.job === jobName)
					tableData[currentIndex] = {
						job: jobName,
						buildNumber: buildInfoData.number,
						state: buildInfoData.result || "DOING",
					}
					setTableData([].concat(tableData as any))

					if (buildInfoData.result !== null) {
						notifier.notify(
							{
								title: "jks-cli 通知",
								message: `您的项目 ${jobName} ${
									buildInfoData.result === "SUCCESS"
										? "构建成功"
										: buildInfoData.result === "ABORTED"
										? "取消构建"
										: "构建失败"
								}`,
								icon: path.join(__dirname, "../../assets/icon.jpeg"),
								sound: true,
								wait: true,
							},
							(error: any) => {
								if (error) {
									setTips({
										isShow: true,
										type: "error",
										message: "发送通知出错",
									})
									reject(error)
								}
							}
						)
					}

					resolve(buildInfoData.result)
				}
			)
		})
	}

	const startInterval = (jobName: string, buildNumber: number) => {
		setTimeout(async () => {
			const result = await buildInfo(jobName, buildNumber)
			if (result === null) {
				startInterval(jobName, buildNumber)
			}
		}, 20000)
	}

	return (
		<Box flexDirection='column'>
			<Logo version={cli.pkg.version} />

			<Box marginBottom={1} flexDirection='column'>
				{tableData
					.filter(item => item.state === "DOING")
					.map(item => (
						<Loading key={item.job || ""}>
							{item.job}
							构建中...
						</Loading>
					))}
			</Box>

			{/* <Box flexDirection='column' width={80}></Box> */}
			{(tableData || []).length > 0 && (
				<MyTable title='构建列表' data={(tableData || []) as any}></MyTable>
			)}

			<Tips {...tips}></Tips>
		</Box>
	)
}

export default BuildView
