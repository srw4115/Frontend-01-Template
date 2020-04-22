# 课后作业：

## 写一个正则表达式 匹配所有 Number 直接量
      /^(-?(0|[1-9]\d*)(\.\d+)?(e-?(0|[1-9]\d*))?|0x[0-9a-f]+|^0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+)$/g
     
## 写一个UTF-8 Encoding的函数
      const EncodingUTF8 = str => str.split('').map(item => `\\u${item.charCodeAt().toString(16)}`.join(''))

## 写一个正则表达式， 匹配所有的字符串直接量，单引号和双引号

      /[\x21-\x7E]{6,16}|[\u0021-\u007E]{6,16}|(['"])(?:(?!\1).)*?\1/g;
