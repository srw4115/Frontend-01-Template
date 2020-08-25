import { createElement, Wrapper, Text } from './createElement';
import { TimeLine, Animation, linear, ease } from './animation';
import { Panel } from './Panel';
import { TabPanel } from './TabPanel';
import { ListView } from './ListView';

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
        this.timeLine = timeLine;
        this.nextPickStopHandler = null;
        this.onStart = () => {
            timeLine.pause();
            clearTimeout(this.nextPickStopHandler);
        };
        this.onPan = (event) => {};

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
                (v) => `translateX(${v * 5}px)`,
            );

            let nextAnimation = new Animation(
                next.style,
                'transform',
                100 - 100 * nextPosition,
                -100 * nextPosition,
                500,
                0,
                ease,
                (v) => `translateX(${v * 5}px)`,
            );

            timeLine.add(currentAnimation);
            timeLine.add(nextAnimation);
            timeLine.start();

            this.nextPickStopHandler = setTimeout(() => {
                position = nextPosition;
            }, 16);
            this.nextPickStopHandler = setTimeout(nextPic, 3000);
        };
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

                current.style.transition = '';
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
        let position = 0;
        let timeLine = new TimeLine();
        this.timeLine = timeLine;
        this.nextPickStopHandler = null;

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
                (v) => `translateX(${v * 5}px)`,
            );

            let nextAnimation = new Animation(
                next.style,
                'transform',
                100 - 100 * nextPosition,
                -100 * nextPosition,
                500,
                0,
                ease,
                (v) => `translateX(${v * 5}px)`,
            );

            timeLine.add(currentAnimation);
            timeLine.add(nextAnimation);
            timeLine.start();
            this.nextPickStopHandler = setTimeout(() => {

                position = nextPosition;
            }, 16);

            this.nextPickStopHandler = setTimeout(nextPic, 3000);
        };

        this.nextPickStopHandler = setTimeout(nextPic, 3000);

        let children = this.data.map((url, currentPosition) => {
            let lastPosition =
                (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;

            let offset = 0;

            this.onStart = () => {
                timeLine.pause();
                clearTimeout(this.nextPickStopHandler);

                let currentElement = children[currentPosition];

                console.log(currentElement.style.transform);
                let currentTransformValue = Number(
                    currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1],
                );
                offset = currentTransformValue + 500 * currentPosition;
            };

            this.onPan = (event) => {
                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let dx = event.clientX - event.startX;

                let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

                lastElement.style.transform = `translateX(${lastTransformValue}px)`;
                currentElement.style.transform = `translateX(${currentTransformValue}px)`;
                nextElement.style.transform = `translateX(${nextTransformValue}px)`;
            };

            this.onPanend = (event) => {
                let direction = 0;
                let dx = event.clientX - event.startX;

                if (dx + offset > 250) {
                    direction = 1;
                } else if (dx + offset < -250) {
                    direction = -1;
                }

                timeLine.reset();
                timeLine.start();

                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let lastAnimation = new Animation(
                    lastElement.style,
                    'transform',
                    -500 - 500 * lastPosition + offset + dx,
                    -500 - 500 * lastPosition + direction * 500,
                    500,
                    0,
                    ease,
                    (v) => `translateX(${v}px)`,
                );

                let currentAnimation = new Animation(
                    currentElement.style,
                    'transform',
                    -500 * currentPosition + offset + dx,
                    -500 * currentPosition + direction * 500,
                    500,
                    0,
                    ease,
                    (v) => `translateX(${v}px)`,
                );

                let nextAnimation = new Animation(
                    nextElement.style,
                    'transform',
                    500 - 500 * nextPosition + offset + dx,
                    500 - 500 * nextPosition + direction * 500,
                    500,
                    0,
                    ease,
                    (v) => `translateX(${v}px)`,
                );

                timeLine.add(lastAnimation);
                timeLine.add(currentAnimation);
                timeLine.add(nextAnimation);

                position = (position - direction + this.data.length) % this.data.length;
                this.nextPickStopHandler = setTimeout(nextPic, 3000);
            };

            let element = (
                <img
          src={url}
          style={{
            transform: 'translateX(0px)',
          }}
          onStart={this.onStart}
          onPan={this.onPan}
          onPanend={this.onPanend}
          enableGesture={true}
        />
            );
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

let component = (
    <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
);

let panel = (
    <Panel title={'this is my panel'}>
    <span title='title1'>This is content1</span>
    <span title='title2'>This is content2</span>
    <span title='title3'>This is content3</span>
    <span title='title4'>This is content4</span>
  </Panel>
);

let tabPanel = (
    <TabPanel title={'this is my panel'}>
    <span title='title1'>This is content1</span>
    <span title='title2'>This is content2</span>
    <span title='title3'>This is content3</span>
    <span title='title4'>This is content4</span>
  </TabPanel>
);

let data = [{
        title: '蓝猫',
        url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    },
    {
        title: '橘猫加白',
        url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    },
    {
        title: '狸花加白',
        url: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    },
    {
        title: '橘猫',
        url: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    },
];

let list = (
    <ListView data={data}>
    {(record) => {
      return (
        <figure>
          <img src={record.url} />
          <figcaption>{record.title}</figcaption>
        </figure>
      );
    }}
  </ListView>
);

component.mountTo(document.querySelector('#root'));