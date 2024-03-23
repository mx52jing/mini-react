/**
 * React 包中主要实现creatElement，render方法
 */

import {toVDom} from "../../utils/toVDom.js";
import {createRealDOM} from "../../utils/toRealDom.js";

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