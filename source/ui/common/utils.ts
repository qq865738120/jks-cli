const settingKeys = ["list"]
const settingListType = {
	title: (item: any, key: string) => typeof item[key] === "string",
	message: (item: any, key: string) => typeof item[key] === "string",
	cycle: (item: any, key: string) => ["day", "week", "custom"].includes(item[key]),
	week: (item: any, key: string) => [1, 2, 3, 4, 5, 6, 7].includes(item[key]),
	time: (item: any, key: string) => {
		if (item['cycle'] !== 'custom') {
			return /([0-1]\d|2[0-4]):[0-5]\d:[0-5]\d/.test(item[key])
		} else {
			return true
		}
	},
	isTurnOn: (item: any, key: string) => typeof item[key] === "boolean",
	remark: (item: any, key: string) => typeof item[key] === "string",
	schedule: (item: any, key: string) => {
		if (item['cycle'] === 'custom') {
			return new RegExp(
				`(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01]) )|([1-7] )|( )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7])|([1-7])|(\\?)|(\\*)|(([1-7])|([1-7]\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01]) )|([1-7] )|( )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7] )|([1-7] )|(\\? )|(\\* )|(([1-7] )|([1-7]\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\-(19[789][0-9]|20[0-9][0-9])))`
			).test(item[key])
		} else {
			return true
		}
	}
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
