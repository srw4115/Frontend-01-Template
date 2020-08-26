var page = require('webpage').create();
var url = 'http://localhost:5111/'





page.open(url, function (status) {

    if (status === 'success') {
        var html = page.evaluate(function () {

            function toString(pad, element) {
            	var children = element.childNodes;
                var childrenString = '';

                for (var i = 0; i < children.length; i++) {
                    childrenString = childrenString + toString("    " + pad, children[i]) + "\n";
                }

                var name = element.tagName ||  '#text ' + element.textContent

                return pad + name + (childrenString ? "\n" + childrenString : "");
            }

            return toString("", document.body);
        });

        console.log(html)
    }

    phantom.exit();
});