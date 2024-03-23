import {REACT_TEXT} from "./constants.js";

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