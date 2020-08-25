import { createElement, Wrapper, Text } from './createElement';
import { TimeLine, Animation, linear, ease } from './animation';
import { enableGesture } from './gesture';

export class Carousel {
    constructor() {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    appendChild(child) {
        this.children.push(child);
    }

    loop(root, children) {
        let position = 0;
        let timeLine = new TimeLine();
        window.timeLine = timeLine;

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;
            let current = children[position];
            let next = children[nextPosition];

            let currentAnimation = new Animation(
                current.style,
                'transform',
                -100 * position,
                -100 - 100 * position,
                500,
                0,
                ease,
                (v) => `translate(${v}%)`,
            );

            let nextAnimation = new Animation(
                next.style,
                'transform',
                100 - 100 * nextPosition,
                -100 * nextPosition,
                500,
                0,
                ease,
                (v) => `translate(${v}%)`,
            );

            timeLine.add(currentAnimation);
            timeLine.add(nextAnimation);
            timeLine.start();

            window.clearTimer = setTimeout(() => {

                position = nextPosition;
            }, 16);

            window.clearTimer = setTimeout(nextPic, 3000);
        };

        window.clearTimer = setTimeout(nextPic, 3000);
    }

    drag(root, children) {
        let position = 0;

        root.addEventListener('mousedown', () => {
            let startX = event.clientX;

            let nextPosition = (position + 1) % this.data.length;
            let lastPosition = (position - 1 + this.data.length) % this.data.length;

            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];

            current.style.transition = 'ease 0s';
            last.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';

            current.style.transform = `translateX(${-500 * position}px)`;
            last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
            next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

            let move = (event) => {
                current.style.transform = `translateX(${
          event.clientX - startX - 500 * position
        }px)`;
                last.style.transform = `translateX(${
          event.clientX - startX - 500 - 500 * lastPosition
        }px)`;
                next.style.transform = `translateX(${
          event.clientX - startX + 500 - 500 * nextPosition
        }px)`;
            };

            let up = (event) => {
                let offset = 0;

                if (event.clientX - startX > 250) {
                    offset = 1;
                } else if (event.clientX - startX < -250) {
                    offset = -1;
                }

                current.style.transition = ''; // 打开transition
                last.style.transition = '';
                next.style.transition = '';

                current.style.transform = `translateX(${
          offset * 500 - 500 * position
        }px)`;
                last.style.transform = `translateX(${
          offset * 500 - 500 - 500 * lastPosition
        }px)`;
                next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPosition
        }px)`;

                position = (position - offset + this.data.length) % this.data.length;

                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }

    render() {
        let children = this.data.map((url) => {
            let element = <img src={url} onStart={timeLine.pause()} />;
            element.addEventListener('dragstart', (event) => event.preventDefault());
            return element;
        });
        let root = <div class={'carousel'}>{children}</div>;

        this.loop(root, children);

        return root;
    }

    mountTo(parent) {
        this.slot = <div></div>;

        for (const child of this.children) {
            this.slot.appendChild(child);
        }

        this.render().mountTo(parent);
    }
}