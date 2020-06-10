function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }

  return element.style;
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  const elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") return;

  const items = element.children.filter((e) => e.type === "element");

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  let style = {
    flexDirection: "row",
    alignItems: "stretch",
    flexWrap: "nowrap",
    alignContent: "stretch",
    justifyContent: "flex-start",
    ...elementStyle,
    width:
      elementStyle.width === "" || elementStyle.width === "auto"
        ? null
        : elementStyle.width,
    height:
      elementStyle.height === "" || elementStyle.height === "auto"
        ? null
        : elementStyle.height,
  };

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;

  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "column") {
    mainSize = "width";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexDirection === "column-reverse") {
    mainSize = "width";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === "wrap-reverse") {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;

  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;

    items.forEach((el) => {
      const itemStyle = getStyle(el);

      elementStyle[mainSize] =
        elementStyle[mainSize] + itemStyle[mainSize] || 0;
    });

    isAutoMainSize = true;
  }

  const flexLine = [];
  const flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize]; //剩余空间
  let crossSpace = 0;

  items.forEach((item) => {
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      crossSpace = Math.max(crossSpace, itemStyle[crossSize] || 0);
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize] || 0);
      }

      mainSpace -= itemStyle[mainSize];
    }

    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === "nowrap" || isAutoMainSize) {
      flexLine.crossSpace =
        style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
      flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
      let scale = style[mainSize] / (style[mainSize] - mainSpace);
      let currentMain = mainBase;
      items.forEach((item) => {
        const itemStyle = getStyle(item);

        if (itemStyle.flex) {
          itemStyle.mainSize = 0;
        }

        itemStyle[mainSize] = itemStyle[mainSize] * scale;
        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSign * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd];
      });
    } else {
      flexLines.forEach((items) => {
        let flexTotal = 0;
        let mainSpace = items.mainSpace;

        items.forEach((item) => {
          const itemStyle = getStyle(item);
          if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
            flexTotal += item.flex;
            return;
          }
        });

        if (flexTotal > 0) {
          let currentMain = mainBase;

          items.forEach((item) => {
            const itemStyle = getStyle(item);
            if (itemStyle.flex) {
              itemStyle[mainSize] = (mainSize / flexTotal) * itemStyle.flex;
            }

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
          });
        } else {
          let currentMain = mainBase;
          let step = 0;

          if (style.justifyContent === "flex-start") {
            step = 0;
          }
          if (style.justifyContent === "flex-end") {
            currentMain = mainSpace * mainSign + mainBase;
            step = 0;
          }

          if (style.justifyContent === "center") {
            currentMain = (mainSpace / 2) * mainSign + mainBase;
            step = 0;
          }

          if (style.justifyContent === "space-between") {
            step = (mainSpace / (items.length - 1)) * mainSign;
            currentMain = mainBase;
          }

          if (style.justifyContent === "space-around") {
            step = (mainSpace / items.length) * mainSign;
            currentMain = step / 2 + mainBase;
          }

          items.forEach((item) => {
            itemStyle[(mainStart, currentMain)];
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd] + step;
          });
        }
      });
    }
  });

  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;

    flexLines.forEach((line) => {
      elementStyle[crossSize] = elementStyle[crossSize] + line.crossSpace;
    });
  } else {
    crossSpace = style[crossSize];

    flexLines.forEach((line) => {
      crossSpace -= line.crossSpace;
    });
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length;
  let step;

  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  }

  if (style.alignContent === "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }

  if (style.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  }

  if (style.alignContent === "stretch") {
    crossBase = crossBase + 0;
    step = 0;
  }

  flexLines.forEach((items) => {
    let lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;

    items.forEach((item) => {
      const itemStyle = getStyle(item);
      const align = itemStyle.alignSelf || style.alignItems;

      if (item === null) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }

      if (align === "flex-start") {
        itemStyle[crossSize] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossEnd] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }

      if (align === "center") {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined
              ? itemStyle[crossSize]
              : lineCrossSize);
      }
    });

    crossBase += crossSign * (lineCrossSize + step);
  });
}

module.exports = layout;
