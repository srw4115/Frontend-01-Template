### Range Api
- var range = new Range()
- range.setStart(element, 9)
- range.setEnd(element, 4)
- var range = document.getSelection().getRangeAt(0)
- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents
- var fragment = range.extractContents()
- range.insertNode(document.createTextNode('aaa'))

### document.styleSheets
- document.styleSheets

### getComputedStyld

### window

### view
- element.getClientRects()
- element.getBoundingClientRect()

## DataUrl
- data:text/html,xxxxx
- data:text/css,p%7Bcolor:blue%7D
- data:image/svg+xml,xxxxx
- data:image/svg+xml;base64,xxxxx

### Rules
- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule('p{color: pink}', 0)
- document.styleSheets[0].removeRule(0)
