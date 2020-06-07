const images = require("images");

let viewport = images(800, 600);

function render(element) {
  if (element.style) {
    const img = images(element.style.width, element.style.height);

    console.log(element.style);

    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0,0,0)";
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);

      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children) {
    for (let child of element.children) {
      render(child);
    }
  }
}

module.exports = {
  render: (element) => {
    render(element);
    return viewport;
  },
};
