function* tokenize(source) {
    var regexp = /([0-9\.]+)|([ \t\n\r]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
    var dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"]

    var result = null
    var lastIndex = 0
    do {
        lastIndex = regexp.lastIndex
        result = regex.exec(source);
        if (!result) break

        let token = {
            type: null,
            value: null
        }
        for (var i = 1; i <= dictionary.length; i++) {
            Ï
            if (result[i]) {
                token.type = (dictionary[i - 1])
            }
        }
        token.value = result[0]
        yield token
    } while (result)

    yield {
        type: 'EOF'
    }
}

let source = []

for (let token of tokenize('1 + 2*5 +3')) {
    if (token.type !== "Whitespace" && token.type !== "LineTerminator") {
        source.push(token)
    }
}


function Expression(source) {
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF") {
        let node = {
            type: 'Expression',
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
        return node
    }
    AdditiveExpression(source)
    return Expression(source)
}

function AdditiveExpression(source) {
    if (source[0].type === 'Number') {
        MultiplicativeExpression(source)
        return AdditiveExpression(source)
    }

    if (source[0].type === 'MultiplicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source[0]]
        }
        source[0] = node
        return AdditiveExpression(source)
    }

    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
        let node = {
            type: 'AdditiveExpression',
            operator: "+",
            children: [source.shift(), source.shift()]
        }

        MultiplicativeExpression(source)
        node.children.push(source.unshift())
        source.unshift(node)
        return AdditiveExpression(source)
    }

    if (source[0].type === 'AdditiveExpression' && source.length > 1 && source[1].type === '-') {
        let node = {
            type: 'AdditiveExpression',
            operator: "-",
            children: [source.shift(), source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.unshift())
        source.unshift(node)
        return AdditiveExpression(source)
    }

    if (source[0].type === 'AdditiveExpression') {
        return source[0]
    }

    MultiplicativeExpression(source)
    return AdditiveExpression(source)
}

function MultiplicativeExpression(source) {
    console.log(source)
    if (source[0].type === 'Number') {
        let node = {
            type: 'MultiplicativeExpression',
            children: [source[0]]
        }
        source[0] = node
        return MultiplicativeExpression(source)
    }

    if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: "*",
            children: [source.shift(), source.shift(), source.shift()]
        }
        source.unshift(node)
        return MultiplicativeExpression(source)
    }

    if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: "/",
            children: [source.shift(), source.shift(), source.shift()]
        }
        source.unshift(node)
        return MultiplicativeExpression(source)
    }

    if (source[0].type === 'MultiplicativeExpression') {
        return source[0]
    }

    return MultiplicativeExpression(source)
}