/**
 * ReactDom 包主要实现createRoot 方法
 */
import {render} from "../React/index.js";

export const createRoot = (el) => {
    return {
        render(vDom) {
            return render(el, vDom)
        }
    }
}

const ReactDom = {
    createRoot,
}

export default ReactDom