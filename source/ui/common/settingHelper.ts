// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fsPath = require("fs-path")
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require("fs")
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require("path")
import Conf from "conf"

const conf = new Conf()
// const filePath = path.join(__dirname, `../../../../.cache/jks-cli/setting.json`)

const saveSetting = (obj: any) => {
	// fsPath.writeFileSync(filePath, JSON.stringify(obj))
	conf.set('setting', JSON.stringify(obj))
}

const readSetting = () => {
	// return fs.existsSync(filePath)
	// 	? JSON.parse(fs.readFileSync(filePath).toString())
	// 	: null
	const result: any = conf.get('setting')
	return result ? JSON.parse(result) : null
}

export { saveSetting, readSetting }
