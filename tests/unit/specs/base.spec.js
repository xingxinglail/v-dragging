import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { wait, Component } from '../util';
import Syn from 'syn';

let wrapper;

describe('Base', () => {

    beforeEach(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    });

    afterEach(() => wrapper.destroy());

    it('可以正确渲染', async () => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        await wait();
        const items = wrapper.findAll('.drag__item');
        const { $el, list, columns, $refs } = wrapper.vm;
        expect($el).to.be.ok;
        expect(list.length).to.eq(items.length);
        const rows = Math.ceil(list.length / columns);
        const parentHeight = rows * items.at(0).element.offsetHeight;
        expect(parentHeight).to.eq(parseInt($refs.drag.wrapperHeight));
    });

    it('动态改变 columns', async () => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        await wait();
        const items = wrapper.findAll('.drag__item');
        const { list, $refs } = wrapper.vm;
        wrapper.vm.columns = 2;
        await wait();
        const rows = Math.ceil(list.length / wrapper.vm.columns);
        const parentHeight = rows * items.at(0).element.offsetHeight;
        expect(parentHeight).to.eq(parseInt($refs.drag.wrapperHeight));
    });

    it('没有设置 handle 的元素无法拖拽', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(300)
            .then(() => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 2;
                const disableItem = items.at(itemIndex).element;
                const item = document.querySelectorAll('.drag__item')[2];
                const { x, y } = disableItem.getBoundingClientRect();
                Syn.drag(
                    disableItem,
                    {
                        from: { pageX: x + 10, pageY: y + 10 },
                        to: { pageX: 740, pageY: 300 }
                    },
                    async () => {
                        await wait(100);
                        const emitted = wrapper.emitted();
                        expect(emitted.choose).to.not.exist;
                        expect(emitted.start).to.not.exist;
                        expect(emitted.change).to.not.exist;
                        expect(emitted['un-choose']).to.not.exist;
                        expect(emitted.end).to.not.exist;
                        expect(emitted.update).to.not.exist;
                        done();
                    }
                );
            });
    });

    it('没有设置 handle 的元素无法交换位置', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(300)
            .then(() => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 0;
                const disabledItemIndex = 2;
                const firstItem = items.at(itemIndex).element;
                const disabledItem = items.at(disabledItemIndex).element;
                Syn.drag(
                    firstItem,
                    {
                        from: { pageX: 40, pageY: 40 },
                        to: { pageX: 740, pageY: 40 }
                    },
                    async () => {
                        await wait(350);
                        const newDisabledItem = wrapper.element.querySelectorAll('.drag__item')[disabledItemIndex];
                        expect(newDisabledItem).to.eq(disabledItem);
                        done();
                    }
                );
            });
    });
});
