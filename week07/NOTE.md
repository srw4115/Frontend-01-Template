## css

### @rules
* @charset
* @import
* @media
* @page
* @counter-style
* @keyframes
* @fontface
* @supports
* @namespace

### 筛标准代码
```javascript
let list = document.getElementById("container").children

let result = [];

for(let li of list) {
  if(li.getAttribute('data-tag').match(/css/))
    result.push({
      name:li.children[1].innerText,
      url:li.children[1].children[0].href
    });
}
console.log(result);


let iframe = document.createElement('iframe');
document.body.innerHTML = "";
document.body.appendChild(iframe);

function happen (element, event) {
  return new Promise((resolve) => {
    let handler = () => {
      resolve();
      element.removeEventListene(event, handler)
    }
    element.addEventListener(event, handler)
  });
}

void async function () {
  for(let stand of result){
    iframe.src = stand.url;
    await happen(iframe, 'load')
  }
}();
```