# 每周总结可以写在这里



###  有限状态机----一种逻辑思想

每一个状态都是一个机器（可以理解为状态一致的函数）
每个机器都可以做计算、存储、输出。。。
所有机器接收输入是一致的

状态机每一个机器本身没有状态，如果用函数表示，他应该是纯函数
每一个机器知道下一个状态
每个机器都有确定的下一个状态（Moore）
每个机器根据输入决定下一个状态（Mealy）


### css

当startTag的时候，调用CSS parser计算css规则
创建元素后，立即计算CSS
分析元素时，所有规则已经收集完毕
遇到写在body里面的style标签需要重新计算CSS
