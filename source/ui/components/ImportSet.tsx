import React, { FC } from "react"
import Input from "./Input"

export interface IImportSet {
	initValue?: string
	onConfirm: (value: string) => any
}

const ImportSet: FC<IImportSet> = ({ initValue, onConfirm }) => {
	return (
		<Input
			label='导入设置'
			initValue={initValue}
			placeholder='请输入要导入的设置'
			onConfirm={onConfirm}
		></Input>
	)
}

export default ImportSet
