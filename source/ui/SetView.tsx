import React, { FC, useEffect, useRef, useState } from "react"
import { Box, Text } from "ink"
import Logo from "./components/Logo"
import SetForm, { ISetForm } from "./components/SetForm"
import Select from "./components/Select"
import Tips, { ITipsProps } from "./components/Tips"
import { readSetting, saveSetting } from "./common/settingHelper"
import MyTable from "./components/MyTable"
import ImportSet from "./components/ImportSet"
import { checkSetting } from "./common/utils"
import theme from "./common/theme"
import Input from "./components/Input"
import meow from "meow"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ncp = require("copy-paste")

export interface ISetView {
	cli: meow.Result<meow.AnyFlags>
}

const SetView: FC<ISetView> = ({ cli }) => {
	// 步骤
	const [setup, setSetup] = useState(4)
	// 设置内容
	const [item, setItem] = useState(-1)
	const [userInfo, setUserInfo] = useState<string>()
	// 操作类型
	const [actionType, setActionType] = useState("add")
	// 设置
	const [setting, setSetting] = useState<{ list?: ISetForm[], userInfo?: string }>({})
	// 更新的快捷方式索引
	const [updateIndex, setUpdateIndex] = useState<number>()
	// 导入配置
	const [importText, setImportText] = useState("")
	// 提示
	const [tips, setTips] = useState<ITipsProps>({
		isShow: false,
		type: "success",
		message: "",
	})
	const tipsRef = useRef<any>()

	useEffect(() => {
		setSetting((readSetting() || {}) as any)
	}, [])

  useEffect(() => {
    setUserInfo(setting.userInfo || '')
  }, [setting])

	const onSelectAction = (item: any) => {
		setTips({ isShow: false })
		tipsRef.current.clear()
		setActionType(item.value)
		if (item.value === "add") {
			setSetup(2)
		} else if (["delete", "update"].includes(item.value)) {
			if ((setting.list || []).length === 0) {
				setTips({
					isShow: true,
					type: "info",
					message: "您还没有快捷方式，请先添加一个吧。",
				})
			} else {
				setSetup(1)
			}
		} else if (["import"].includes(item.value)) {
			setSetup(3)
		} else if (item.value === "export") {
			setSetup(3)
			ncp.copy(JSON.stringify(setting), () => {
				setTips({
					isShow: true,
					type: "success",
					message: "导出成功，已经帮您复制到剪切板。",
				})
			})
		} else if (item.value === "query") {
			setSetup(3)
			if ((setting.list || []).length === 0) {
				setTips({
					isShow: true,
					type: "info",
					message: "您还没有设置快捷方式，请先添加一条快捷方式吧。",
				})
			}
		}
	}

	const onSetFormConfirm = (form: ISetForm) => {
		if (actionType === "add") {
			tipsRef.current.clear()
			const settings = setting?.list || []
			settings.push(form)
			setting.list = settings
			setSetting(setting)
			saveSetting(setting)
			setTips({
				isShow: true,
				type: "success",
				message: "新增成功",
			})
		} else if (actionType === "update") {
			tipsRef.current.clear()
			// eslint-disable-next-line @typescript-eslint/no-extra-semi
			;(setting?.list || [])[updateIndex || 0] = form
			setSetting(setting)
			saveSetting(setting)
			setTips({
				isShow: true,
				type: "success",
				message: "修改成功",
			})
		}
	}

	const onSetFormError = (errorMsg: string) => {
		setTips({
			isShow: true,
			type: "error",
			message: errorMsg,
		})
	}

	const onSetFormInfo = (infoMsg: string) => {
		setTips({
			isShow: true,
			type: "info",
			message: infoMsg,
		})
	}

	const onSelectSetting = (item: any) => {
		if (actionType === "delete") {
			// eslint-disable-next-line @typescript-eslint/no-extra-semi
			;(setting?.list || []).splice(item.value, 1)
			setSetting(setting)
			saveSetting(setting)
			setSetup(-1)
			setTips({
				isShow: true,
				type: "success",
				message: "删除成功",
			})
		} else if (actionType === "update") {
			setUpdateIndex(item.value)
			setSetup(2)
		}
	}

	const onImportConfirm = (value: string) => {
		setImportText(value)
		setSetup(-1)
		try {
			const settingObj = JSON.parse(value)
			if (checkSetting(settingObj)) {
				setSetting(settingObj)
				setTips({
					isShow: true,
					type: "success",
					message: "导入成功",
				})
				saveSetting(settingObj)
			} else {
				setTips({
					isShow: true,
					type: "error",
					message: "导入失败，请检查设置是否正确。",
				})
			}
		} catch (error) {
			console.error(error)
			setTips({
				isShow: true,
				type: "error",
				message: "导入失败，请检查设置是否正确。",
			})
		}
	}

	const onSelectItem = (item: any) => {
		if (item.value === 0) {
      setSetup(-1)
			setTips({
				isShow: true,
				type: "info",
				message:
					"格式举例：https://username:token@jenkins.company.com 。其中 username 为 Jenkins 的用户名，token 需要在 Jenkins 的个人中心页面的设置选项卡里的API Token中设置，“@”后面为 Jenkins 域名。",
			})
		} else if (item.value === 1) {
      setSetup(0)
    }
		setItem(item.value)
	}

	const onUserInfoConfirm = (value: string) => {
		setUserInfo(value)
    setting['userInfo'] = value
    setSetting(setting)
    saveSetting(setting)
    setItem(-1)
    setTips({
      isShow: true,
      type: "success",
      message: "设置成功",
    })
	}

	return (
		<Box flexDirection='column'>
			<Logo version={cli.pkg.version} />

			{setup === 4 && (
				<Select
					label='您要设置什么？'
					items={[
						{
							label: "用户登录",
							value: 0,
						},
						{
							label: "快捷方式",
							value: 1,
						}
					]}
					onConfirm={onSelectItem}
				/>
			)}

			{item === 0 && (
				<Input
					label='用户信息及域名'
					initValue={userInfo}
					placeholder='请输入标题'
					onConfirm={onUserInfoConfirm}
				></Input>
			)}

			{item === 1 && (
				<>
					{setup === 0 && (
						<Select
							label='您要怎么操作快捷方式？'
							items={[
								{
									label: "新增",
									value: "add",
								},
								{
									label: "修改",
									value: "update",
								},
								{
									label: "删除",
									value: "delete",
								},
								{
									label: "查看",
									value: "query",
								},
								{
									label: "导入",
									value: "import",
								},
								{
									label: "导出",
									value: "export",
								},
							]}
							onConfirm={onSelectAction}
						/>
					)}

					{setup === 1 && (
						<Select
							label={`您要${
								actionType === "update" ? "修改" : "删除"
							}哪个快捷方式？`}
							items={(setting.list || []).map((item, index) => {
								return {
									label: item.title,
									value: index,
									subLabel: item.remark
								}
							})}
							onConfirm={onSelectSetting}
						/>
					)}

					{setup === 2 && (actionType === "add" || actionType === "update") && (
						<SetForm
							initForm={
								actionType === "update"
									? (setting?.list || [])[updateIndex || 0]
									: undefined
							}
							onConfirm={onSetFormConfirm}
							onError={onSetFormError}
							onHideError={() => setTips({ isShow: false })}
							onInfo={onSetFormInfo}
						></SetForm>
					)}

					{setup === 3 &&
						actionType === "query" &&
						((setting.list || []).length > 0 ? (
							<MyTable
								title='快捷方式配置列表'
								data={(setting.list || []) as any}
							></MyTable>
						) : null)}

					{setup === 3 && actionType === "import" && (
						<ImportSet
							initValue={importText}
							onConfirm={onImportConfirm}
						></ImportSet>
					)}

					{setup === 3 && actionType === "export" && (
						<Box
							marginTop={1}
							borderStyle='classic'
							borderColor={theme.mainColor}
							padding={1}
						>
							<Text>{JSON.stringify(setting)}</Text>
						</Box>
					)}
				</>
			)}

			<Tips ref={tipsRef} {...tips}></Tips>
		</Box>
	)
}

export default SetView
