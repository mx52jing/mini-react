import {REACT_TEXT} from "./constants.js";
import {render} from "../lib/React/index.js";

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
        console.log(children, "children")
    }
    return realDom
}