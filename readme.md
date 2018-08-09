# cli 制作流程

## 1. commander插件来处理命令行  
``` js
const program = require('commander');

program
    .version(require('../package').version)
    .option('-t, --test', 'Add unit test for components')
    .usage('<command> [options]')
    .command('-init', 'Generate a new project')
    .parse(process.argv);
```
## 2. download-git-repo插件来下载模板并引入
``` js
download(template, name, {clone: false}, err => {
    if (err) {
        logger.fatal("download template [" + template + "] error ");
    }
    generate(name, template, to, err => {
        if (err) {
            logger.fatal(err);
        } else {
            console.log()
            logger.success('Generated "%s".', name)
        }
    })
})
```

### 问题汇总
#### 1. 获取当前目录文件名的方法：  
    需要使用node的path对象，path对象中有一个relation的方法
``` js
    path.relation('../', process.pwd());
```
#### 2. 获取当前Git用户：
    需要使用git命令，要用到node的child_process提供衍生子进程的功能
``` nodejs
const exec = require('child_process').execSync

module.exports = () => {
  let name
  let email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')
  return (name || '') + (email || '')
}
```
#### 3. 使用metadata读取meta文件的时候需要将template模板先读取到本地，然后再在本地读取文件：

