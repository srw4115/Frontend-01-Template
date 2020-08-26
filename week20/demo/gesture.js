export function enableGesture(element) {
    let contexts = Object.create(null)
    let MOUSE_SYMBOL = Symbol("mouse")

    if (document.ontouchstart !== null)
        element.addEventListener("mousedown", e => {
            contexts[MOUSE_SYMBOL] = Object.create(null)
            start(e, contexts[MOUSE_SYMBOL])

            let mousemove = e => {
                move(e, contexts[MOUSE_SYMBOL])
            }
            let mouseup = e => {
                end(e, contexts[MOUSE_SYMBOL])
                document.removeEventListener("mousemove", mousemove)
                document.removeEventListener("mouseup", mouseup)
            }

            document.addEventListener("mousemove", mousemove)
            document.addEventListener("mouseup", mouseup)
        })


    element.addEventListener("touchstart", e => {

        for (let touch of e.changedTouches) {
            contexts[touch.identifier] = Object.create(null)
            start(touch, contexts[touch.identifier])
        }
    })

    element.addEventListener("touchmove", e => {
        for (let touch of e.changedTouches)
            move(touch, contexts[touch.identifier])
    })

    element.addEventListener("touchend", e => {
        for (let touch of e.changedTouches)
            end(touch, contexts[touch.identifier])
    })


    element.addEventListener("touchcancel", e => {
        for (let touch of e.changedTouches)
            cancel(touch, contexts[touch.identifier])
    })

    const emit = ({
        type,
        point,
        context,
        extra = {}
    }) => {
        if (!type || !point || !context) throw new TypeError("type | point | context is required parameter")
        element.dispatchEvent(new CustomEvent(type, {
            detail: Object.assign({
                clientX: point.clientX,
                clientY: point.clientY,
                startX: context.startX,
                startY: context.startY
            }, extra)
        }))
    }

    let start = (point, context) => {
        context.startX = point.clientX
        context.startY = point.clientX
        context.moves = []
        context.isTap = true
        context.isPan = false
        context.isPress = false
        context.timeoutHandler = setTimeout(() => {
            if (context.isPress) return
            context.isTap = false
            context.isPan = false
            context.isPress = true
            emit({ type: "pressstart", point, context })
        }, 500)
        emit({ type: "start", point, context })
    }

    let move = (point, context) => {
        let dx = point.clientX - context.startX,
            dy = point.clientY - context.startY

        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress)
                emit({ type: "presscancel", point, context })
            context.isTap = false
            context.isPan = true
            context.isPress = false
            emit({ type: "panstart", point, context })
        }

        if (context.isPan) {
            context.moves.push({ dx, dy, t: Date.now() })
            context.moves = context.moves.filter(record => Date.now() - record.t < 300)
            emit({ type: "pan", point, context })
        }
    }

    let end = (point, context) => {
        if (context.isPan) {
            let dx = point.clientX - context.startX,
                dy = point.clientY - context.startY;
            let record = context.moves[0]
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t)
            console.log('speed', speed)
            let isFlick = speed > 2.5
            isFlick && emit({ type: "flick", point, context, extra: { speed } })
            emit({ type: "panend", point, context, extra: { speed, isFlick } })
        }

        context.isTap && emit({ type: "tap", point, context })
        context.isPress && emit({ type: "pressend", point, context })

        clearTimeout(context.timeoutHandler)
    }

    let cancel = (point, context) => {
        emit({ type: "cancel", point, context })
        clearTimeout(context.timeoutHandler)
    }
}