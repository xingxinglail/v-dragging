<template>
    <div class="drag-wrapper" ref="wrapper" :style="{ height: wrapperHeight }">
        <slot/>
    </div>
</template>

<script>
import { isSupportTouch, addClass, removeClass, hasClass } from '../helper';

export default {
    name: 'Drag',
    props: {
        handle: {
            type: String,
            required: true
        },
        columns: {
            type: Number,
            default: 1
        },
        value: {
            type: Array
        }
    },
    data () {
        return {
            wrapperHeight: '0px', // 动态计算父级元素高度
            overOnePage: false // 整个区域是否超过一个屏幕
        };
    },
    beforeCreate () {
        this._zIndex = 5;
        this._innerList = [];
    },
    created () {
        this._isSupportTouch = isSupportTouch();
        this._cur = -1; // 当前激活的元素
        this._dragging = false; // 是否拖拽中
        this._isMove = false; // 是否触发 touchmove
        this._startTranX = 0; // 当前激活元素的初始 X轴 偏移量
        this._startTranY = 0; // 当前激活元素的初始 Y轴 偏移量
        this._preOriginKey = -1; // 前一次排序时候的起始 key 值
        this._itemDom = { // 每一项 item 的 dom 信息, 由于大小一样所以只存储一个
            width: 0,
            height: 0,
            left: 0,
            top: 0
        };
        this._startTouch = { // 初始触摸点信息
            pageX: 0,
            pageY: 0,
            identifier: 0
        };
        this._timer = null;
        this._oldIndex = -1;
        this._newIndex = -1;
        this._isEmitStarted = false; // 是否触发了 start 事件
        this._currentTarget = null; // 缓存被拖拽的元素
    },
    mounted () {
        window.addEventListener('resize', this.resize);
        if (!this._isSupportTouch) {
            document.addEventListener('mousemove', this.mousemove);
            document.addEventListener('mouseup', this.mouseup);
        }
    },
    beforeDestroy () {
        this.cleanUp();
        window.removeEventListener('resize', this.resize);
        if (!this._isSupportTouch) {
            document.removeEventListener('mousemove', this.mousemove);
            document.removeEventListener('mouseup', this.mouseup);
        }
    },
    methods: {
        emitEvent (data) {
            this._oldIndex = data.oldIndex;
            this.$emit(data.event, data);
        },
        touchstart (e) {
            const { pageX, pageY, identifier } = e.touches[0];
            this.startHandle(e, pageX, pageY, identifier);
        },
        touchmove (e) {
            e.preventDefault();
            const { pageX, pageY, identifier } = e.touches[0];
            this.moveHandle(pageX, pageY, identifier);
        },
        touchend () {
            this.endHandle();
        },
        mousedown (e) {
            const { pageX, pageY } = e;
            this.startHandle(e, pageX, pageY);
        },
        mousemove (e) {
            e.preventDefault();
            const { pageX, pageY } = e;
            this.moveHandle(pageX, pageY);
        },
        mouseup () {
            this.endHandle(true);
        },
        transitionend () {
            // if (!this._dragging) return;
            const { _innerList, value, _newIndex, _oldIndex, _currentTarget, transitionend } = this;
            if (_newIndex !== _oldIndex) {
                _innerList.forEach(({ key, data }) => {
                    value.splice(key, 1, data);
                });
                this.emitEvent({
                    event: 'update',
                    oldIndex: _oldIndex,
                    newIndex: _newIndex,
                    item: _currentTarget
                });
            }
            _currentTarget.removeEventListener('transitionend', transitionend);
            this.clearData();
        },
        startHandle (e, startPageX, startPageY, identifier) {
            const { currentTarget } = e;
            if (!hasClass(currentTarget, this.handle)) return;
            if (this._dragging) return;
            this._currentTarget = currentTarget;
            this._dragging = true;
            let startTranX = 0;
            let startTranY = 0;
            let index = -1;
            const { _innerList, _itemDom } = this;
            for (let i = 0; i < _innerList.length; i++) {
                if (_innerList[i].el === currentTarget) {
                    index = i;
                    startTranX = _innerList[i].x * _itemDom.width;
                    startTranY = _innerList[i].y * _itemDom.height;
                    break;
                }
            }
            this.emitEvent({
                event: 'choose',
                oldIndex: index,
                newIndex: null,
                item: e.currentTarget
            });
            this._startTranX = startTranX;
            this._startTranY = startTranY;
            currentTarget.style.transitionDuration = '0ms';
            currentTarget.style.zIndex = this._zIndex;
            this._cur = index;
            this._zIndex++;
            this._startTouch = { pageX: startPageX, pageY: startPageY, identifier };
        },
        moveHandle (currentPageX, currentPageY, currentId) {
            if (!this._dragging) return;
            if (!this._isEmitStarted) {
                // 添加事件
                this._currentTarget.addEventListener('transitionend', this.transitionend);
                document.body.style.userSelect = 'none';
                this._isEmitStarted = true;
                this.emitEvent({
                    event: 'start',
                    oldIndex: this._oldIndex,
                    newIndex: null,
                    item: this._currentTarget
                });
            }

            this._isMove = true;
            const {
                _startTouch,
                _startTranX,
                _startTranY,
                _preOriginKey
            } = this;
            const {
                pageX: startPageX,
                pageY: startPageY,
                identifier: startId
            } = _startTouch;

            // 如果不是同一个触发点则返回
            if (currentId !== undefined && startId !== currentId) return;
            // 通过 当前坐标点, 初始坐标点, 初始偏移量 来计算当前偏移量
            let tranX = currentPageX - startPageX + _startTranX;
            const tranY = currentPageY - startPageY + _startTranY;

            // 单列时候X轴初始不做位移
            if (this.columns === 1) tranX = 0;
            const { _innerList, _cur } = this;
            const originKey = _innerList[_cur].key;
            // 获取 originKey 和 endKey
            // 设置当前激活元素偏移量
            _innerList[_cur].el.style.transform = `translate3d(${tranX}px, ${tranY}px, 0)`;
            const endKey = this.calculateMoving(tranX, tranY);
            // 如果是固定 item 则 return
            if (!hasClass(_innerList[endKey].el, this.handle)) return;
            // 防止拖拽过程中发生乱序问题
            if (originKey === endKey || _preOriginKey === originKey) return;
            this._preOriginKey = originKey;
            // 触发排序
            this.insert(originKey, endKey);
        },
        endHandle (isMouse) {
            if (this._dragging) {
                this.emitEvent({
                    event: 'un-choose',
                    oldIndex: this._oldIndex,
                    newIndex: null, // 还没排序，所以拿不到
                    item: this._currentTarget
                });
            }
            if (!this._isMove) {
                this.clearData();
                return;
            }
            if (!this._dragging) return;
            if (isMouse) this._dragging = false;
            const { _innerList, _cur } = this;
            if (_cur >= 0) {
                const currentItem = _innerList[_cur];
                currentItem.el.style.transitionDuration = '';
                currentItem.el.style.transform = `translate3d(${currentItem.x * 100}%, ${currentItem.y * 100}%, 0)`;
            }
            if (this._isEmitStarted) {
                document.body.style.userSelect = '';
                const newIndex = _innerList.find(c => c.el === this._currentTarget).key;
                this.emitEvent({
                    event: 'end',
                    oldIndex: this._oldIndex,
                    newIndex,
                    item: this._currentTarget
                });
                this._newIndex = newIndex;
                this._isEmitStarted = false;
            }
        },
        resize () {
            clearTimeout(this._timer);
            this._timer = setTimeout(this.init, 240);
        },
        init () {
            this.cleanUp();
            const { value, handle, touchstart, mousedown, touchmove, touchend } = this;
            if (!value) this._innerList = [];
            const wrapper = this.$refs.wrapper;
            const children = [].slice.call(wrapper.children);
            this._innerList = children.map((child, index) => {
                const el = child;
                let fixed = false;
                removeClass(el, 'drag__item'); // 删除、增加时移除过度效果
                if (hasClass(el, handle)) {
                    if (this._isSupportTouch) {
                        el.addEventListener('touchstart', touchstart);
                        el.addEventListener('touchmove', touchmove);
                        el.addEventListener('touchend', touchend);
                    } else {
                        el.addEventListener('mousedown', mousedown);
                    }
                } else {
                    fixed = true;
                }

                if (index === 0) {
                    const { width, height, left, top } = el.getBoundingClientRect();
                    this._itemDom = {
                        width, height, left, top
                    };
                    const rows = Math.ceil(children.length / this.columns);
                    this.wrapperHeight = `${rows * height}px`;
                }
                return {
                    key: index,
                    x: 0,
                    y: 0,
                    fixed,
                    data: value[index],
                    el
                };
            });
            this.getPosition(this._innerList, false);
            this.$nextTick(() => {
                children.forEach(child => {
                    addClass(child, 'drag__item');
                });
            });
        },
        /**
         * 根据排序后 list 数据进行位移计算
         */
        getPosition (data, vibrate = true) {
            const { columns, _cur, _currentTarget } = this;
            let newIndex = null;
            data.forEach((item, index) => {
                const { key, el } = item;
                const x = key % columns;
                const y = Math.floor(key / columns);
                item.x = x;
                item.y = y;
                if (_cur !== index) el.style.transform = `translate3d(${x * 100}%, ${y * 100}%, 0)`;
                if (el === _currentTarget) newIndex = key;
            });

            if (!vibrate) return;
            this.emitEvent({
                event: 'change',
                oldIndex: this._oldIndex,
                newIndex,
                item: this._currentTarget
            });
        },
        /**
         * 根据当前的手指偏移量计算目标key
         */
        calculateMoving (tranX, tranY) {
            const { _innerList, _itemDom, columns } = this;

            let rows = Math.ceil(_innerList.length / columns) - 1,
                i = Math.round(tranX / _itemDom.width),
                j = Math.round(tranY / _itemDom.height);

            i = i > (columns - 1) ? (columns - 1) : i;
            i = i < 0 ? 0 : i;
            j = j < 0 ? 0 : j;
            j = j > rows ? rows : j;

            let endKey = i + columns * j;
            endKey = endKey >= _innerList.length ? _innerList.length - 1 : endKey;
            return endKey;
        },
        /**
         * 清除参数
         */
        clearData () {
            const { _innerList, _cur } = this;
            if (_cur >= 0) _innerList[_cur].el.style.zIndex = '';
            this._preOriginKey = -1;
            this._dragging = false;
            this._cur = -1;
            this._currentTarget = null;
            this._isMove = false;
            this._newIndex = -1;
            this._oldIndex = -1;
        },
        cleanUp () {
            this.clearData();
            const { touchstart, touchmove, touchend, mousedown } = this;
            this._innerList.forEach(({ el }) => {
                el.removeEventListener('touchstart', touchstart);
                el.removeEventListener('touchmove', touchmove);
                el.removeEventListener('touchend', touchend);
                el.removeEventListener('mousedown', mousedown);
            });
        },
        /**
         * 根据起始key和目标key去重新计算每一项的新的key
         */
        insert (origin, end) {
            const { _innerList } = this;
            if (origin < end) { // 正序拖动
                _innerList.forEach((item) => {
                    if (item.fixed) return item;
                    if (item.key > origin && item.key <= end) {
                        item.key = this.l2r(item.key - 1, origin);
                    } else if (item.key === origin) {
                        item.key = end;
                    }
                });
                this.getPosition(_innerList);
            } else if (origin > end) { // 倒序拖动
                _innerList.forEach((item) => {
                    if (item.fixed) return item;
                    if (item.key >= end && item.key < origin) {
                        item.key = this.r2l(item.key + 1, origin);
                    } else if (item.key === origin) {
                        item.key = end;
                    }
                });
                this.getPosition(_innerList);
            }
        },
        /**
         * 正序拖动 key 值和固定项判断逻辑
         */
        l2r (key, origin) {
            if (key === origin) return origin;
            if (this._innerList[key].fixed) {
                return this.l2r(key - 1, origin);
            } else {
                return key;
            }
        },
        /**
         * 倒序拖动 key 值和固定项判断逻辑
         */
        r2l (key, origin) {
            if (key === origin) return origin;
            if (this._innerList[key].fixed) {
                return this.r2l(key + 1, origin);
            } else {
                return key;
            }
        }
    },
    watch: {
        value: {
            immediate: true,
            handler () {
                this.$nextTick(this.init);
            }
        },
        columns () {
            this.$nextTick(this.init);
        }
    }
};
</script>

<style lang="scss">
    .drag-wrapper {
        position: relative;
        width: 100%;
        transform: translateZ(0);

        .drag__item {
            position: absolute;
            transition: transform 0.3s;

            &.z-index {
                z-index: 10;
            }
        }
    }
</style>
