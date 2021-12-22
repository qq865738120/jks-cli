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
import dayjs from "dayjs"
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
	onFinish?: () => any
}

let jenkins: any = null

const BuildView: FC<IBuildView> = ({ cli, jobs, symbol, onFinish }) => {
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
		init()
	}, [setting])

	useEffect(() => {
		init()
	}, [setting, jobs, symbol])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-extra-semi
		;(async () => {
			try {
				if (buildParams) {
					const jobNames = Object.keys(buildParams)
					const actionList = jobNames.map(item => actionBuild(item))
					const resultArr = await Promise.all(actionList)
					resultArr.map((item: any) => {
						lastBuildInfo(item.jobName, item.queueId).then((res: any) => {
							buildInfo(res.jobName, res.buildName)
						})
					})
					// console.log('buildParams', buildParams);
				}
			} catch (error) {
				console.error(error)
			}
		})()
	}, [buildParams])

	useEffect(() => {
		if (
			tableData.filter(item => item.state !== "DOING").length ===
				tableData.length &&
			tableData.length > 0
		) {
			onFinish && onFinish()
		}
	}, [tableData])

	const init = () => {
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
						tableData.push({
							job: params[2],
							buildNumber: "",
							startTime: "",
							estimatedDuration: "",
							currentUseTime: "",
							state: "DOING",
						})
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
	}

	const actionBuild = (jobName: string) => {
		return new Promise((resolve, reject) => {
			// console.log(resolve, reject, jobName)

			jenkins.build_with_params(
				jobName,
				buildParams[jobName],
				(err: any, data: any) => {
					if (err) {
						setTips({
							isShow: true,
							type: "error",
							message: `[${jobName}]: ${err}`,
						})
						reject(err)
					} else {
						resolve({ jobName, queueId: data.queueId })
					}
				}
			)
		})
	}

	const lastBuildInfo = (jobName: string, queueId: number) => {
		return new Promise((resolve, reject) => {
			const timerId = setInterval(() => {
				jenkins.queue_item(queueId, {}, (err: any, lastBuildInfoData: any) => {
					// console.log("err", err, lastBuildInfoData)
					if (err) {
						setTips({
							isShow: true,
							type: "error",
							message: `[${jobName}]: ${err}`,
						})
						reject(err)
					} else if (
						lastBuildInfoData.executable &&
						lastBuildInfoData.executable.number
					) {
						resolve({ jobName, buildName: lastBuildInfoData.executable.number })
						clearInterval(timerId)
					}
				})
			}, 10000)
		})
	}

	const buildInfo = (jobName: string, buildNumber: number) => {
		return new Promise((resolve, reject) => {
			const timer = setInterval(() => {
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

						setTableData((preTableData: any[]) => {
							const currentIndex = preTableData.findIndex(
								item => item.job === jobName
							)
							preTableData[currentIndex] = {
								job: jobName,
								buildNumber: buildInfoData.number,
								startTime: dayjs(buildInfoData.timestamp).format("HH:mm:ss"),
								estimatedDuration: (
									buildInfoData.estimatedDuration /
									1000 /
									60
								).toFixed(2),
								currentUseTime: (
									(new Date().getTime() - buildInfoData.timestamp) /
									1000 /
									60
								).toFixed(2),
								state: buildInfoData.result || "DOING",
							}
							return [].concat(preTableData as any)
						})
						// console.log(buildInfoData, "buildInfoData")

						if (buildInfoData.result !== null) {
							doNotify(jobName, buildInfoData.result)
								.then(() => {
									resolve(buildInfoData.result)
									clearInterval(timer)
								})
								.catch(err => {
									reject(err)
									clearInterval(timer)
								})
						}
					}
				)
			}, 20000)
		})
	}

	const doNotify = (jobName: string, result: string) => {
		return new Promise((resolve, reject) => {
			notifier.notify(
				{
					title: "jks-cli 通知",
					message: `您的项目 ${jobName} ${
						result === "SUCCESS"
							? "构建成功"
							: result === "ABORTED"
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
					} else {
						resolve("")
					}
				}
			)
		})
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
							{item.buildNumber ? "构建中" : "等待中"}...
						</Loading>
					))}
			</Box>

			{(tableData || []).length > 0 && (
				<MyTable
					title='构建列表'
					headerText={[
						"项目",
						"构建序列",
						"开始时间",
						"预计耗时（分钟）",
						"已耗时（分钟）",
						"状态",
					]}
					data={(tableData || []) as any}
				></MyTable>
			)}

			<Tips {...tips}></Tips>
		</Box>
	)
}

export default BuildView
