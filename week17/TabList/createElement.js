export function createElement(Cls, attributes, ...children) {
  let element
  
  if (typeof Cls === 'string') {
    element = new Wrapper(Cls)
  } else {
    element = new Cls
  }
  for (const name in attributes) {
    element.setAttribute(name, attributes[name])
  }

  let visit = (children) => {
    for (const child of children) {
      if (typeof child === 'string') {
        child = new Text(child)
      }
      if (typeof child === 'object' && child instanceof Array) {
        visit(child)
        continue
      }
      element.appendChild(child)
    }
  }

  visit(children)
  
  return element
}

export class Text {
  constructor(text) {
    this.children = [] 
    this.root = document.createTextNode(text)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

export class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
      this.addEventListener(eventName, value)
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name)
  }

  appendChild(child) {
    this.children.push(child)
  }

  addEventListener() {
    this.root.addEventListener(...arguments)
  }

  get style() {
    return this.root.style
  }

  get classList() {
    return this.root.classList
  }

  mountTo(parent) {
    parent.appendChild(this.root)

    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}