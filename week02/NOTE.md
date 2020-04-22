# 总结

## 编程语言通识

- 非形式语言
	- 各种自然语言比如：英语 中文...
- 乔姆斯基谱系形式语言
	- 0型 无限制文法 递归可枚举语言 图灵机
	- 1型 上下文相关文法
	- 2型 上下文无关文法
	- 3型 正则文法
  
- 图灵完备性
- 命令式——图灵机
- goto
- if和while
- 声明式——lambda
- 递归


## 词法和类型

- Atom 
- whiteSpace
	- [unicode表](https://www.fileformat.info/info/unicode/category/Zs/list.htm)
- LineTerminator 
  	- 比如LR：'\n' CR：'\r' 
- Token
	- Punctuator：符号 ><=
	- Keywords：if switch async await等
	- Literal：直接量（其实就是变量或者属性这些的值）
		- Null
		- Boolean
		- Number
		- String
