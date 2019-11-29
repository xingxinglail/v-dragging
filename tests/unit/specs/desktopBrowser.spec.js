import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Syn from 'syn';
import { wait, Component } from '../util';

let wrapper;

describe('DesktopBrowserDrag', () => {

    beforeEach(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    });

    afterEach(() => wrapper.destroy());

    it('正序拖动', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(300)
            .then(() => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 0;
                const firstItem = items.at(itemIndex).element;
                Syn.drag(
                    firstItem,
                    {
                        from: { pageX: 40, pageY: 40 },
                        to: { pageX: 740, pageY: 300 }
                    },
                    async () => {
                        await wait(350);
                        const emitted = wrapper.emitted();
                        expect(emitted.choose[0][0]).to.deep.eq({
                            event: 'choose', oldIndex: itemIndex, newIndex: null, item: firstItem
                        });
                        expect(emitted.start[0][0]).to.deep.eq({
                            event: 'start', oldIndex: itemIndex, newIndex: null, item: firstItem
                        });
                        expect(emitted.change[0][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 1, item: firstItem
                        });
                        expect(emitted.change[1][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 5, item: firstItem
                        });
                        expect(emitted.change[2][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 6, item: firstItem
                        });
                        expect(emitted.change[3][0]).to.deep.eq({
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
                        expect(wrapper.emittedByOrder().map(e => e.name)).to.deep.eq(['choose', 'start', 'change', 'change', 'change', 'change', 'un-choose', 'end', 'update']);
                        done();
                    }
                );
            });
    });

    it('倒序拖动', done => {
        wrapper = mount(Component, {
            attachToDocument: true
        });
        wait(300)
            .then(() => {
                const items = wrapper.findAll('.drag__item');
                const itemIndex = 7;
                const firstItem = items.at(itemIndex).element;
                Syn.drag(
                    firstItem,
                    {
                        from: { pageX: 740, pageY: 300 },
                        to: { pageX: 40, pageY: 40 }
                    },
                    async () => {
                        await wait(350);
                        const emitted = wrapper.emitted();
                        expect(emitted.choose[0][0]).to.deep.eq({
                            event: 'choose', oldIndex: itemIndex, newIndex: null, item: firstItem
                        });
                        expect(emitted.start[0][0]).to.deep.eq({
                            event: 'start', oldIndex: itemIndex, newIndex: null, item: firstItem
                        });
                        expect(emitted.change[0][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 6, item: firstItem
                        });
                        expect(emitted.change[1][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 1, item: firstItem
                        });
                        expect(emitted.change[2][0]).to.deep.eq({
                            event: 'change', oldIndex: itemIndex, newIndex: 0, item: firstItem
                        });
                        expect(emitted['un-choose'][0][0]).to.deep.eq({
                            event: 'un-choose', oldIndex: itemIndex, newIndex: null, item: firstItem
                        });
                        expect(emitted.end[0][0]).to.deep.eq({
                            event: 'end', oldIndex: itemIndex, newIndex: 0, item: firstItem
                        });
                        expect(emitted.update[0][0]).to.deep.eq({
                            event: 'update', oldIndex: itemIndex, newIndex: 0, item: firstItem
                        });
                        expect(wrapper.emittedByOrder().map(e => e.name)).to.deep.eq(['choose', 'start', 'change', 'change', 'change', 'un-choose', 'end', 'update']);
                        done();
                    }
                );
            });
    });
});
