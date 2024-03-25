/**
 * React 包中主要实现creatElement，render方法
 */
import {REACT_TEXT} from "../../utils/constants.js";

/**
 * 生成虚拟dom
 * @param element
 * @return {{children: *[], type: string, props}|*}
 */
export const toVDom = (element) => {
    const elementType = typeof element
    // 证明当前element是数字或者是字符串
    if(!!~["string", "number"].indexOf(elementType)) {
        return {
            type: REACT_TEXT,
            props: element,
            children: []
        }
    }
    return element
}

/**
 * 把属性同步到真实DOM上
 * @param dom 真实DOM元素
 * @param props
 */
function updateProps(dom, props) {
    // 处理新增和删除的属性
    for(const key in props) {
        // children属性单独处理，不在这里处理
        if(key === 'children') {
            continue;
        }
        if(key === 'style') {
            const styles = props[key];
            for(const attr in styles) {
                if(styles.hasOwnProperty(attr)) {
                    dom.style[attr] = styles[attr]
                }
            }
        }else {
            dom[key] = props[key]
        }
    }
}

/**
 * 遍历每个child，将child渲染到父元素中
 * @param fiber 当前fiber节点
 */
function reconcileChildren(fiber) {
    const children = fiber.props.children;
    if(!children?.length) return
    // 设置上一个兄弟fiber节点
    let prevChildFiber = null;
    children.forEach((child, index) => {
        // 创建子节点的fiber
        const curChildFiber = {
            type: child.type,
            props: child.props,
            dom: null,
            parent: fiber,
            sibling: null,
            child: null
        }
        // 要创建兄弟之间fiber节点的关联 要先获取上一个的子fiber
        if(index === 0) {
            // 如果是第一个子元素，将该子元素对应的fiber和父fiber关联
            fiber.child = curChildFiber
        }else {
            // 将上一次兄弟的fiber节点的sibling关联为当前子fiber节点
            prevChildFiber.sibling = curChildFiber
        }
        // 更新上一个兄弟fiber的值
        prevChildFiber = curChildFiber
    })
}
/**
 * 根据虚拟dom生成真实dom
 */
export const createRealDOM = (fiber) => {
    const { type, props } = fiber
    let realDom;
    if(type === REACT_TEXT) {
        realDom = document.createTextNode(props)
    }else {
        realDom = document.createElement(type);
    }
    // 创建dom后，将当前fiber节点的dom属性设置为dom
    fiber.dom = realDom;
    // 将当前dom append到父dom中
    fiber.parent.dom.append(realDom)
}
/**
 * 创建虚拟dom
 * @param type
 * @param props
 * @param children
 */
export const createElement = (type, props, ...children) => {
    /**
     * 如果元素没有设置属性 props在React Runtime为Classic时可能为null
     */
    if(!props) {
        props = {}
    }
    // 生成children
    props.children = children.map(element => toVDom(element))
    return {
        type,
        props
    }
}

/**
 * render方法主要是将虚拟dom转化为实际的dom，然后渲染到页面中
 * @param el
 * @param vDom
 */
export const render = (el, vDom) => {
    // 设置fiber 属性值
    fiber = {
        type: vDom.type, //
        props: vDom.props ?? {},
        dom: el, // 当前fiber节点对应的真实dom
        parent: null, // 当前fiber节点的父fiber节点
        sibling: null, // 当前fiber节点的兄弟fiber节点
        child: null // 当前fiber节点的儿子fiber节点
    }
}

/**
 * 开始渲染工作流
 * @param fiber
 * @return fiber
 */
const performWorkOfUnit = (fiber) => {
    // 1 创建dom
    // 将虚拟DOM转换成真实DOM
    if(!fiber.dom) {
        createRealDOM(fiber);
        // 2. 处理props
        if(!!fiber.props) {
            updateProps(fiber.dom, fiber.props)
        }
    }
    // 3 创建节点之间的关联
    reconcileChildren(fiber)
    // 4 返回下一个要处理的fiber节点
    if (!!fiber.child) return fiber.child
    // 这里要处理一下复杂的嵌套dom
    let nextFiber = fiber
    // 遍历到最后一个元素后，要一直向上寻找，直到找到有兄弟节点的fiber为止
    while (!!nextFiber) {
        if(!!nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
}

// 声明fiber节点
let fiber = null
/**
 * 实现任务调度器
 * @param deadline
 */
const workLoop = (deadline) => {
    // 当前任务是否需要等待
    let shouldYield = false
    if(!shouldYield && !!fiber) {
        // 如果有空闲时间 就开始工作 渲染我们的页面
        fiber = performWorkOfUnit(fiber)
        // 是否应该等待
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}


requestIdleCallback(workLoop)

const React = {
    createElement,
    render
}

export default React