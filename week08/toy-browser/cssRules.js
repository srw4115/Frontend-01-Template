const css = require("css");

let rules = [];

function addCssRule(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!selector || !element.attributes) return false;

  if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter((attr) => attr.name === "id")[0];

    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    let attr = element.attributes.filter((attr) => attr.name === "class")[0];

    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else if (element.tagName === selector) {
    return true;
  }

  return false;
}

function isMatchRules(parents, selectorParts) {
  let index = 1;

  parents.forEach((element) => {
    if (match(element, selectorParts[index])) {
      index = index + 1;
    }
  });

  return index >= selectorParts.length;
}

function specificity(selector) {
  const p = [0, 0, 0, 0];

  const selectors = selector.split(" ");

  selectors.forEach((s) => {
    if (s.charAt[0] === "#") {
      p[1] = p[1] + 1;
    } else if (s.charAt[0] === ".") {
      p[2] = p[2] + 1;
    } else {
      p[3] = p[3] + 1;
    }
  });

  return p;
}

function compareSpec(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];

  return sp1[3] - sp2[3];
}

function computeCSS(element, parents) {
  if (!element.computedStyle) {
    element.computedStyle = {};

    rules.forEach((rule) => {
      let selectorParts = rule.selectors[0].split(" ").reverse();

      if (!match(element, selectorParts[0])) {
        return;
      }

      const isMatched = isMatchRules(parents, selectorParts);

      if (isMatched) {
        const sp = specificity(rule.selectors[0]);
        let computedStyle = element.computedStyle;

        rule.declarations.forEach((declaration) => {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
          }

          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].specificity = sp;
            computedStyle[declaration.property].value = declaration.value;
          } else if (
            compareSpec(computedStyle[declaration.property].specificity, sp) < 0
          ) {
            computedStyle[declaration.property].value = declaration.value;
          }
        });
      }
    });
  }

  // console.log("has css rule element", element);
}

module.exports = {
  addCssRule,
  computeCSS,
};
