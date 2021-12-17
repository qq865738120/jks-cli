const settingKeys = ["list"]
const settingListType = {
	title: (item: any, key: string) => typeof item[key] === "string",
	command: (item: any, key: string) => typeof item[key] === "string",
	remark: (item: any, key: string) => typeof item[key] === "string",
}

const checkSetting = (obj: any) => {
	let result = true
	const keys = Object.keys(obj)
	settingKeys.map(key => {
		if (!keys.includes(key)) {
			result = false
		} else {
			if (key === "list") {
				// eslint-disable-next-line @typescript-eslint/no-extra-semi
				;(obj[key] || []).map((item: any) => {
					const settingListKey = Object.keys(settingListType)
					settingListKey.map(listKey => {
						if (!(settingListType as any)[listKey](item, listKey)) {
							result = false
						}
					})
				})
			}
		}
	})
	return result
}

export { checkSetting }
