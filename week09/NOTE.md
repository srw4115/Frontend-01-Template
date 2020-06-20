##### CSS动画与绘制


1. Animation
    * @keyframes：
        ```css
            @keyframes mykf
            {
                from {background: red;}
                to {background: yellow;}
            }
        ```
       
        ```css
            div {
                animation: kf 5s infinite;
            }
        ```
    * animation props：
        * animation-name
        * animation-duration
        * animation-timing-function
        * animation-delay
        * animation-iteration-count
        * animation-direction
    * keyframes
        ```css
            @keyframes kf
            {
                0% {top: 0; transition: top ease;}
                50% {top: 30px; transition: top ease-in;}
                75% {top: 10px; transition: top ease-out;}
                100% {top: 0; transition: top linear;}
            }
        ```
        
2. Transition
    * transition animation：
        * transition-property
        * transition-duration
        * transition-timing-function
        * transition-delay
    * [cubic-bezier](https://cubic-bezier.com/#.17,.67,.83,.67)

##### HTML语义

* hgroup： 标题组
* abbr： 缩写
* hr： 故事走向的转变或话题的转变
* blockquote： 段落级引述内容
* q： 行内引述内容
* cite： 引述的作品名
* adress： 文章作者的联系方式
* figure, figcaption：插入文章中的内容，如图片、代码、表格等，可以用figure包裹起来，用figcaption表示内容的标题
* dfn：包裹被定义的名词
* nav：包裹链接到文章各个章节的目录
* samp：示例
* aside： 跟文章主体不相关的部分，比如导航、广告等工具性质的内容

##### HTML语法

* 合法元素
    * Element: <tagname>...</tagname>
    * Text: text
    * Comment: <!-- comments -->
    * DocumentType: <!Doctype html>
    * ProcessingInstruction: <?a 1?>
    * CDATA: <![CDATA[]]>
* 字符引用
    * \&#161;
    * \&amp;
    * \&lt;
    * \&quot;

* Browser API
    * DOM
        * DOM Tree
        * Events
        * Range
        * ~~Traversal~~
    * CSSOM
    * BOM
    * Web Animation
    * Crypto
    * ......

* Node
    * Element：元素型节点，跟标签相对应
        * HTMLElement
        * SVGElement
    * Document：文档根节点
    * CharacterData：字符数据
        * Text：文本节点
        * Comment：注释
        * ProcessingInstruction：处理信息
    * DocumentFragment：文档片段
    * DocumentType：文档类型
