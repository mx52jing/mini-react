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
 * 根据虚拟dom生成真实dom
 */
export const createRealDOM = (vDom) => {
    const { type, props } = vDom
    let realDom;
    if(type === REACT_TEXT) {
        realDom = document.createTextNode(props)
    }else {
        realDom = document.createElement(type);
    }
    if(!!props) {
        // 为dom属性赋值
        for (let key in props) {
            if (key === 'children') {
                continue
            }
            if(props.hasOwnProperty(key)) {
                realDom[key] = props[key]
            }
        }
        // 处理children
        const {children}=props
        if(!children) return realDom
        children.forEach(child => {
            render(realDom, child)
        })
    }
    return realDom
}
/**
 * 创建虚拟dom
 * @param type
 * @param props
 * @param children
 */
export const createElement = (type, props, ...children) => {
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
    // 将虚拟DOM转换成真实DOM
    const realDOM = createRealDOM(vDom);
    el.appendChild(realDOM)
}

const React = {
    createElement,
    render
}

export default React