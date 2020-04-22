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
		```
		NumericLiteral :: DecimalLiteral
BinaryIntegerLiteral OctalIntegerLiteral HexIntegerLiteral
DecimalLiteral ::
DecimalIntegerLiteral . DecimalDigitsopt ExponentPartopt . DecimalDigits ExponentPartopt
DecimalIntegerLiteral ExponentPartopt
DecimalIntegerLiteral :: 0
166
© Ecma International 2019
NonZeroDigit DecimalDigitsopt
DecimalDigits :: DecimalDigit
DecimalDigits DecimalDigit DecimalDigit :: one of
0123456789
NonZeroDigit :: one of 123456789
ExponentPart ::
ExponentIndicator SignedInteger
ExponentIndicator :: one of eE
SignedInteger :: DecimalDigits
+ DecimalDigits - DecimalDigits
BinaryIntegerLiteral :: 0b BinaryDigits 0B BinaryDigits
BinaryDigits :: BinaryDigit
BinaryDigits BinaryDigit BinaryDigit :: one of
01
OctalIntegerLiteral :: 0o OctalDigits 0O OctalDigits
OctalDigits :: OctalDigit
OctalDigits OctalDigit OctalDigit :: one of
01234567
HexIntegerLiteral :: 0x HexDigits 0X HexDigits
HexDigits :: HexDigit
HexDigits HexDigit HexDigit :: one of
© Ecma International 2019 167

The MV of The MV of The MV of The MV of The MV of The MV of
(the MV of The MV of
NumericLiteral :: DecimalLiteral is the MV of DecimalLiteral.
NumericLiteral :: BinaryIntegerLiteral is the MV of BinaryIntegerLiteral.
NumericLiteral :: OctalIntegerLiteral is the MV of OctalIntegerLiteral.
NumericLiteral :: HexIntegerLiteral is the MV of HexIntegerLiteral.
DecimalLiteral :: DecimalIntegerLiteral . is the MV of DecimalIntegerLiteral.
DecimalLiteral :: DecimalIntegerLiteral . DecimalDigits is the MV of DecimalIntegerLiteral plus
DecimalDigits × 10-n), where n is the number of code points in DecimalDigits.
DecimalLiteral :: DecimalIntegerLiteral . ExponentPart is the MV of DecimalIntegerLiteral × 10 ,
The MV of
The MV of
0123456789abcdefABCDEF
The SourceCharacter immediately following a NumericLiteral must not be an IdentifierStart or DecimalDigit.
		```
		- String
