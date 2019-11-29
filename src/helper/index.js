export const isSupportTouch = () => {
    return ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
};

const getClass = elem => {
    return elem.getAttribute && elem.getAttribute('class') || '';
};

const stripAndCollapse = value => {
    const tokens = value.match(/[^\x20\t\r\n\f]+/g) || [];
    return tokens.join(' ');
};

export const addClass = (element, className) => {
    if (element && typeof className === 'string') {
        const curClass = getClass(element);
        let cur = element.nodeType === 1 && (' ' + stripAndCollapse(curClass) + ' ');
        if (cur) {
            if (cur.indexOf(' ' + className + ' ') < 0) {
                cur += className + ' ';
            }
            const finalValue = stripAndCollapse(cur);
            if (curClass !== finalValue) {
                element.setAttribute('class', finalValue);
            }
        }
    }
};

export const removeClass = (element, className) => {
    if (element && typeof className === 'string') {
        const curClass = getClass(element);
        let cur = element.nodeType === 1 && (' ' + stripAndCollapse(curClass) + ' ');
        if (cur) {
            while (cur.indexOf(' ' + className + ' ') > -1) {
                cur = cur.replace(' ' + className + ' ', ' ');
            }
            const finalValue = stripAndCollapse(cur);
            if (curClass !== finalValue) {
                element.setAttribute('class', finalValue);
            }
        }
    }
};

export const hasClass = (element, className) => {
    if (element && typeof className === 'string') {
        className = ' ' + className + ' ';
        return element.nodeType === 1 && (' ' + stripAndCollapse(getClass(element)) + ' ').indexOf(className) > -1;
    }
    return false;
};
