# 简单选择器
  * div svg | a (namespace?)
  * .class
  * #id
  * [attr=value] （~ | ）（[arrt]）
  * :hover
  * ::before
* 复合选择器(与的关系)
  * <简单选择器><简单选择器><简单选择器>
  * `*` 或者div必须写在最前面
* 复杂选择器
  * <复合选择器><sp><复合选择器>   子孙关系
  * <复合选择器>">"<复合选择器>       父子关系
  * <复合选择器>"~"<复合选择器>       sibling
  * <复合选择器>"+"<复合选择器>       sibling
  * <复合选择器>"||"<复合选择器>       leve4，兼容性不好
* 选择器列表
  * 使用“，”分隔

# 伪类

  * 链接/行为
    * :any-link
    * :link      :visited
    * :hover
    * :active
    * :focus
    * :target
  * 树结构
    * :empty           没有子元素
    * :nth-child()
    * :nth-last-child()
    * :first-child :last-child :only-child
  * 逻辑型
    * :not伪类
    * :where      :has
* 伪元素
  * ::before
  * ::after
  * ::first-line   选中已有内容的第一行（第一行与回车没有关系，只是显示）
    * font系列
    * color系列
    * background系列
    * word-spacing
    * letter-spacing
    * text-decorating
    * text-transform
    * line-height
  * ::first-letter
    * font系列
    * color系列
    * background系列
    * word-spacing
    * letter-spacing
    * text-decorating
    * text-transform
    * line-height
    * float
    * vertical-align
    * 盒模型系列：margin、padding、border
