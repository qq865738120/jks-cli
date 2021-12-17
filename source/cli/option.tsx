import { AnyFlags, Options } from "meow"

const option: Options<AnyFlags> = {
	flags: {
		job: { // 构建参数 a,b,c a标识key，b标识value，c对应job
			type: "string",
			isMultiple: true,
			alias: "j",
		},
		symbol: { // 构建参数分割符
			type: "string",
			alias: "s",
			default: ","
		},
		quick: {
			type: "string",
			alias: "q",
		},
		help: {
			type: "boolean",
			default: false,
			alias: "h",
		},
		version: {
			type: "boolean",
			default: false,
			alias: "v",
		},
	},
}

export default option
