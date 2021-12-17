import chalk from "chalk"
import theme from "../ui/common/theme"

const title = (str: string) => chalk.hex(theme.mainColor).bold(str)
const name = chalk.hex(theme.secondColor)(`jks-cli`)
const prompt = chalk.gray("$")
const label = (str: string) => chalk.hex(theme.secondColor)(str)

export default `
${title("使用：")}
  ${prompt} ${name} ${chalk.gray('[--version|--v] [--help|--h] <command> [<args>]')}

${title("例子：")}
  ${prompt} ${name} ${chalk.hex(theme.lastColor)("set")}

${title("参数：")}
  ${label("job | j")}       ${chalk.gray('项目以及参数化构建携带的参数。如果是build命令，则格式为：<params-key>,<params-value>,<jenkins-job>。如果是stop命令，则格式为：<build-number>,<jenkins-job>。可以指定多个。')}
  ${label("symbol | s ")}   ${chalk.gray('job参数的分隔符，默认使用‘,’。')}
  ${label("quick | q ")}    ${chalk.gray('快捷方式title。run命令可以选择携带该参数。')}
  ${label("help | h ")}     ${chalk.gray('查看帮助文档。')}
  ${label("version | v")}   ${chalk.gray('查看版本号。')}

${title("命令：")}
  ${label("set")}           ${chalk.gray('设置。使用该命令可以设置Jenkins用户信息以及快捷方式等。')}
  ${label("build")}         ${chalk.gray('构建项目。')}
  ${label("run")}           ${chalk.gray('运行快捷方式。')}
  ${label("stop")}          ${chalk.gray('取消构建任务')}
  ${label("about")}         ${chalk.gray('关于我们。')}
`
