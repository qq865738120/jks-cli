import React, { FC, useState } from "react"
import { Box } from "ink"
import Input from "./Input"

export interface ISetForm {
	title: string
	command: string
	remark: string
}

export interface ISetFormProps {
	initForm?: ISetForm
	onConfirm: (form: ISetForm) => any
	onError: (errorMsg: string) => any
	onHideError: () => any
	onInfo: (infoMsg: string) => any
}

const SetForm: FC<ISetFormProps> = ({
	initForm,
	onError,
	onConfirm,
	onHideError,
	onInfo,
}) => {
	const [setup, setSetup] = useState(0)
	const [title, setTitle] = useState(initForm?.title || "")
	const [command, setCommand] = useState(initForm?.command || "")
	const [remark, setRemark] = useState(initForm?.remark || "")

	const onTitleConfirm = (value: string) => {
		if (value) {
			onHideError()
			setTitle(value)
			setSetup(1)
			onInfo('输入需要运行的命令，不同平台命令不同，例如：jks-cli')
		} else {
			onError("标题不能为空")
		}
	}

	const onCommandConfirm = (value: string) => {
		if (value) {
			onHideError()
			setCommand(value)
			setSetup(2)
		} else {
			onError("命令不能为空")
		}
	}

	const onRemarkConfirm = (value: string) => {
		onHideError()
		setRemark(value)
		setSetup(-1)
		onConfirm({
			title,
			command,
			remark: value,
		})
	}

	return (
		<Box flexDirection='column'>
			{setup === 0 && (
				<Input
					label='标题'
					initValue={title}
					placeholder='请输入标题'
					onConfirm={onTitleConfirm}
				></Input>
			)}
			{setup === 1 && (
				<Input
					label='命令'
					initValue={command}
					placeholder='请输入命令'
					onConfirm={onCommandConfirm}
				></Input>
			)}
			{setup === 2 && (
				<Input
					label='备注'
					initValue={remark}
					placeholder='请输入备注'
					onConfirm={onRemarkConfirm}
				></Input>
			)}
		</Box>
	)
}

export default SetForm
