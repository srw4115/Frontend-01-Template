import { enableGesture } from './gesture';

export function createElement(Cls, attributes, ...children) {

    let element;

    if (typeof Cls === 'string') {
        element = new Wrapper(Cls, {
            config: 'wrapperConfig',
        });
    } else {
        element = new Cls({
            config: 'elementConfig',
        });
    }

    for (const name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    let visit = (children) => {
        for (const child of children) {
            if (typeof child === 'object' && child instanceof Array) {
                visit(child);
            } else if (typeof child === 'string') {
                child = new Text(child);
            }
            if (!Array.isArray(child)) {
                element.appendChild(child);
            }
        }
    };

    visit(children);

    return element;
}

export class Wrapper {
    constructor(type, config) {
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        if (name === 'style' && typeof value === 'object') {
            for (const prop in value) {
                this.root.style[prop] = value[prop];
            }
        } else {
            this.root.setAttribute(name, value);

            if (name.match(/^on([\s\S]+)$/)) {
                let eventName = RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase());
                this.addEventListener(eventName, value);
            }

            if (name === 'enableGesture') {
                enableGesture(this.root);
            }
        }
    }
    getAttribute(name) {
        return this.root.getAttribute(name);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    get style() {
        return this.root.style;
    }

    get classList() {
        return this.root.classList;
    }

    set innerText(text) {
        return (this.root.innerText = text);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo(parent) {
        parent.appendChild(this.root);

        for (const child of this.children) {
            child.mountTo(this.root);
        }
    }
}

export class Text {
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }

    geAttribute(name) {
        return name;
    }
}