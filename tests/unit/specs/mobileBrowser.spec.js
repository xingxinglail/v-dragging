import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { wait, sendTouchEvent, Component } from '../util';

let wrapper;

describe('MobileBrowserDrag', () => {

    beforeEach(() => {
        window.ontouchstart = true;
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    });

    afterEach(() => {
        window.ontouchstart = false;
        wrapper.destroy();
    });

    it('正序拖动', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(50)
            .then(async () => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 0;
                const firstItem = items.at(itemIndex).element;
                sendTouchEvent(40, 40, firstItem, 'touchstart');
                sendTouchEvent(740, 300, firstItem, 'touchmove');
                await wait(100);
                sendTouchEvent(0, 0, firstItem, 'touchend');
                await wait(350);
                const emitted = wrapper.emitted();
                expect(emitted.choose[0][0]).to.deep.eq({
                    event: 'choose', oldIndex: itemIndex, newIndex: null, item: firstItem
                });
                expect(emitted.start[0][0]).to.deep.eq({
                    event: 'start', oldIndex: itemIndex, newIndex: null, item: firstItem
                });
                expect(emitted.change[0][0]).to.deep.eq({
                    event: 'change', oldIndex: itemIndex, newIndex: 7, item: firstItem
                });
                expect(emitted['un-choose'][0][0]).to.deep.eq({
                    event: 'un-choose', oldIndex: itemIndex, newIndex: null, item: firstItem
                });
                expect(emitted.end[0][0]).to.deep.eq({
                    event: 'end', oldIndex: itemIndex, newIndex: 7, item: firstItem
                });
                expect(emitted.update[0][0]).to.deep.eq({
                    event: 'update', oldIndex: itemIndex, newIndex: 7, item: firstItem
                });
                expect(wrapper.emittedByOrder().map(e => e.name)).to.deep.eq(['choose', 'start', 'change', 'un-choose', 'end', 'update']);
                done();
            });
    });

    it('倒序拖动', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(300)
            .then(async () => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 7;
                const lastItem = items.at(itemIndex).element;
                sendTouchEvent(740, 300, lastItem, 'touchstart');
                sendTouchEvent(40, 40, lastItem, 'touchmove');
                await wait(100);
                sendTouchEvent(0, 0, lastItem, 'touchend');
                await wait(350);
                const emitted = wrapper.emitted();
                expect(emitted.choose[0][0]).to.deep.eq({
                    event: 'choose', oldIndex: itemIndex, newIndex: null, item: lastItem
                });
                expect(emitted.start[0][0]).to.deep.eq({
                    event: 'start', oldIndex: itemIndex, newIndex: null, item: lastItem
                });
                {
                    const { event, oldIndex, newIndex, item } = emitted.change[0][0];
                    expect(event).to.eq('change');
                    expect(oldIndex).to.eq(itemIndex);
                    expect(newIndex).to.eq(0);
                    expect(item).to.eq(lastItem);
                }
                expect(emitted['un-choose'][0][0]).to.deep.eq({
                    event: 'un-choose', oldIndex: itemIndex, newIndex: null, item: lastItem
                });
                {
                    const { event, oldIndex, newIndex, item } = emitted.end[0][0];
                    expect(event).to.eq('end');
                    expect(oldIndex).to.eq(itemIndex);
                    expect(newIndex).to.eq(0);
                    expect(item).to.eq(lastItem);
                }
                {
                    const { event, oldIndex, newIndex, item } = emitted.update[0][0];
                    expect(event).to.eq('update');
                    expect(oldIndex).to.eq(itemIndex);
                    expect(newIndex).to.eq(0);
                    expect(item).to.eq(lastItem);
                }
                expect(wrapper.emittedByOrder().map(e => e.name)).to.deep.eq(['choose', 'start', 'change', 'un-choose', 'end', 'update']);
                done();
            });
    });
});
