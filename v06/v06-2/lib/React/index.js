/**
 * React 包中主要实现creatElement，render方法
 */
import {PLACEMENT_TAG, REACT_TEXT, UPDATE_TAG} from "../../utils/constants.js";
import {isFunctionComponent} from "../../utils/tools.js";

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
            props: {
                nodeValue: element,
                children: []
            },
        }
    }
    return element
}

/**
 * 把属性同步到真实DOM上
 * @param dom 真实DOM元素
 * @param nextProps
 * @param prevProps
 */
function updateProps(dom, nextProps, prevProps) {
    // 处理删除掉的属性
    for(const key in prevProps) {
        if (key === 'children') continue
        if(!nextProps.hasOwnProperty(key)) {
            dom.removeAttribute(key)
        }
    }
    // 处理新增和修改的属性
    for(const key in nextProps) {
        // children属性单独处理，不在这里处理
        if(
            key === 'children' ||
            nextProps[key] === prevProps[key] // 老的props和新的相等 不做处理
        ) {
            continue;
        }
        // 处理绑定事件
        if (key.startsWith("on")) {
            const eventName = key.slice(2)?.toLowerCase()
            // 要先移除掉老的事件绑定，不然每次更新后之前的绑定事件还在，会重复触发
            dom.removeEventListener(eventName, prevProps[key])
            dom.addEventListener(eventName, nextProps[key])
            continue
        }
        if(key === 'style') {
            const styles = nextProps[key];
            for(const attr in styles) {
                if(styles.hasOwnProperty(attr)) {
                    dom.style[attr] = styles[attr]
                }
            }
            continue
        }
        dom[key] = nextProps[key]
    }
}

/**
 * 遍历每个child，将child渲染到父元素中
 * @param fiber 当前fiber节点
 * @param children
 */
function reconcileChildren(fiber, children) {
    if(!children?.length) return
    // 获取老的fiber节点
    let oldFiber = fiber.alternate?.child
    // 设置上一个兄弟fiber节点
    let prevChildFiber = null;
    children.forEach((child, index) => {
        let curChildFiber;
        const isSameType = oldFiber && oldFiber?.type === child?.type
        if(isSameType) {
            // 创建子节点的fiber
            curChildFiber = {
                type: child.type,
                props: child.props,
                dom: oldFiber.dom,
                parent: fiber,
                sibling: null,
                child: null,
                alternate: oldFiber,
                effectTag: UPDATE_TAG, // 更新tag
            }
        }else {
            // 只有当前child存在的时候才创建子fiber节点
            if(child) {
                // 创建子节点的fiber
                curChildFiber = {
                    type: child.type,
                    props: child.props,
                    dom: null,
                    parent: fiber,
                    sibling: null,
                    child: null,
                    effectTag: PLACEMENT_TAG, // 插入tag
                }
            }
            // 如果不是同一个类型并且有oldFiber，说明此时是更新状态，需要把老的节点移除掉
            if (oldFiber) {
                deletionNodes.push(oldFiber)
            }
        }
        // 从第二个元素开始，alternate 要指向兄弟fiber的sibling
        if(oldFiber) {
            oldFiber = oldFiber.sibling
        }
        // 如果不存在当前fiber节点就不走下面的逻辑
        // if(!curChildFiber) return
        // 要创建兄弟之间fiber节点的关联 要先获取上一个的子fiber
        if(index === 0) {
            // 如果是第一个子元素，将该子元素对应的fiber和父fiber关联
            fiber.child = curChildFiber
        }else {
            // 将上一次兄弟的fiber节点的sibling关联为当前子fiber节点
            prevChildFiber.sibling = curChildFiber
        }
        // 更新上一个兄弟fiber的值
        if(curChildFiber) {
            prevChildFiber = curChildFiber
        }
    })
    // 更新的时候，如果children遍历结束后还有oldFiber，那这个oldFiber就是要删除的节点
    // 防止有多个兄弟节点需要删除，所以要使用while循环
    while (oldFiber) {
        deletionNodes.push(oldFiber)
        oldFiber = oldFiber.sibling
    }
}
/**
 * 根据虚拟dom生成真实dom
 */
export const createRealDOM = (fiber) => {
    const { type, props } = fiber
    let realDom;
    if(type === REACT_TEXT) {
        realDom = document.createTextNode(props.nodeValue)
    }else {
        realDom = document.createElement(type);
    }
    // 创建dom后，将当前fiber节点的dom属性设置为dom
    fiber.dom = realDom;
    // 将当前dom append到父dom中
    // fiber.parent.dom.append(realDom)
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
    // 设置workInProgressFiber属性值
    workInProgressFiber = {
        type: vDom.type, //
        props: vDom.props ?? {},
        dom: el, // 当前fiber节点对应的真实dom
        parent: null, // 当前fiber节点的父fiber节点
        sibling: null, // 当前fiber节点的兄弟fiber节点
        child: null // 当前fiber节点的儿子fiber节点
    }
    nextWorkFiber = workInProgressFiber
}

/**
 * 更新函数组件
 * @param fiber
 */
const updateFunctionComponent = (fiber) => {
    // 初始化 stateHooks 和 stateHookIndex
    stateHooks = []
    stateHookIndex = 0
    curFunctionFiber = fiber
    const { type, props } = fiber
    const children = [type(props)]
    reconcileChildren(fiber, children)
}

/**
 * 更新文本组件
 * @param fiber
 */
const updateHostComponent = (fiber) => {
    // 1 创建dom
    // 将虚拟DOM转换成真实DOM
    if(!fiber.dom) {
        createRealDOM(fiber);
    }
    // 2. 处理props
    if(!!fiber.props) {
        updateProps(fiber.dom, fiber.props, {})
    }
    reconcileChildren(fiber, fiber.props.children)
}

/**
 * 开始渲染工作流
 * @param fiber
 * @return fiber
 */
const performWorkOfUnit = (fiber) => {
    const { type } = fiber
    // 如果是函数组件就调用函数，并且将props传入进去
    if(isFunctionComponent(type)) {
        updateFunctionComponent(fiber)
    }else {
        updateHostComponent(fiber)
    }
    // 3 创建节点之间的关联
    // reconcileChildren(fiber, children)
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

/**
 * 删除多余的节点
 * 这里可能包括函数组件，要考虑全面
 * @param fiber
 */
const commitDeletion = fiber => {
    // 删除的时候 函数组件要使用函数组件的parent的dom 移除函数组件child的dom
    if(fiber.dom) {
        let parentFiber = fiber.parent
        while (!parentFiber.dom) {
            parentFiber = parentFiber.parent
        }
        parentFiber.dom.removeChild(fiber.dom)
        return
    }
    commitDeletion(fiber.child)
}

/**
 * 统一提交
 */
const commitRoot = () => {
    // 在统一提交之前处理要删除的节点
    deletionNodes.forEach(commitDeletion)
    commitWork(workInProgressFiber.child)
    currentRootFiber = workInProgressFiber
    workInProgressFiber  = null
    // 条之后要还原deletionNodes
    deletionNodes = []
}

/**
 * 提交函数的具体执行
 */
const commitWork = (fiber) => {
    if(!fiber) return
    // fiber.parent.dom.append(fiber.dom)
    // 找到当前fiber节点的父节点，然后将将dom插入父dom中
    let parentFiber = fiber.parent
    while(!parentFiber.dom) {
        parentFiber = parentFiber.parent
    }
    // 判断是更新还是插入
    if(fiber.effectTag === PLACEMENT_TAG) { // 插入
        if(fiber.dom) {
            parentFiber.dom.append(fiber.dom)
        }
    }else {// 更新
        updateProps(fiber.dom, fiber.props ?? {}, fiber.alternate?.props ?? {})
    }
    // 然后处理子节点和兄弟节点
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

// 声明下一个将要处理的fiber节点
let nextWorkFiber = null
// 声明workInProgressFiber节点
let workInProgressFiber  = null
// 当前rootFiber 为了在更新的时候创建alternate关联使用
let currentRootFiber = null
// 记录每个函数组件的fiber
let curFunctionFiber = null
// 当前要删除的节点数组
let deletionNodes = []
/**
 * 实现任务调度器
 * @param deadline
 */
const workLoop = (deadline) => {
    // 当前任务是否需要等待
    let shouldYield = false
    if(!shouldYield && !!nextWorkFiber) {
        // 如果有空闲时间 就开始工作 渲染我们的页面
        nextWorkFiber = performWorkOfUnit(nextWorkFiber)
        // 如果当前函数组件需要更新更新当前函数组件，不要多余更新其他组件
        if(workInProgressFiber?.sibling?.type === nextWorkFiber?.type) {
            nextWorkFiber = null
        }
        // 是否应该等待
        shouldYield = deadline.timeRemaining() < 1
    }
    // 当fiber为不存在的时候，说明所有的节点都遍历到了，
    // 并且每个dom都创建了对应的fiber节点，而且fiber节点之间的关联也已经创建成功
    // 如果nextWorkFiber为null 证明已经全部提交完毕了
    if(!nextWorkFiber && workInProgressFiber) {
        // 可以统一提交 创建dom
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

/**
 * 更新函数
 */
const update = () => {
    // 记录每个函数节点的fiber
    let willUpdateFiber = curFunctionFiber
    return () => {
        // 设置workInProgressFiber属性值
        // workInProgressFiber = {
        //     type: currentRootFiber.type, //
        //     props: currentRootFiber.props ?? {},
        //     dom: currentRootFiber.dom, // 当前fiber节点对应的真实dom
        //     parent: null, // 当前fiber节点的父fiber节点
        //     sibling: null, // 当前fiber节点的兄弟fiber节点
        //     child: null, // 当前fiber节点的儿子fiber节点
        //     alternate: currentRootFiber
        // }
        workInProgressFiber = {
            ...willUpdateFiber,
            alternate: willUpdateFiber
        }
        nextWorkFiber = workInProgressFiber
    }
}

/**
 * 实现useState
 * @param initialValue
 */
// hook存放的数组
let stateHooks
// 当前的hook 索引index
let stateHookIndex
function useState(initialValue) {
    // 记录每个函数节点的fiber
    let willUpdateFiber = curFunctionFiber
    const oldStateHook = willUpdateFiber?.alternate?.stateHooks?.[stateHookIndex]
    const stateHook = {
        state: oldStateHook ? oldStateHook.state : initialValue,
        queue: oldStateHook ? oldStateHook.queue : []
    }
    stateHook.queue.forEach(action => {
        stateHook.state = action(stateHook.state)
    })
    // 循环结束后一定要将queue清空
    stateHook.queue = []
    stateHooks.push(stateHook)
    stateHookIndex++
    willUpdateFiber.stateHooks = stateHooks
    function setState(action) {
        const eagerState = typeof action === 'function' ? action(stateHook.state) : action
        if(eagerState === stateHook.state) return
        stateHook.queue.push(() => eagerState)
        workInProgressFiber = {
            ...willUpdateFiber,
            alternate: willUpdateFiber
        }
        nextWorkFiber =  workInProgressFiber
    }
    return [stateHook.state, setState]
}

const React = {
    createElement,
    render,
    update,
    useState
}

export default React