import Drag from '../../src/components/Drag';

export const Component = {
    template: `
        <drag
            ref="drag"
            handle="draggable"
            :value="list"
            :columns="columns"
            @choose="event('choose', $event)"
            @start="event('start', $event)"
            @change="event('change', $event)"
            @un-choose="event('un-choose', $event)"
            @end="event('end', $event)"
            @update="event('update', $event)">
            <div class="item"
                 style="width: 200px;height: 200px;"
                 v-for="(item, index) in list"
                 :class="item.disabled || item.upload ? 'disabled' : 'draggable'"
                 :key="item.name">
                {{ item.name }}
            </div>
        </drag>
    `,
    data () {
        return {
            columns: 4,
            list: [
                {
                    name: '0'
                },
                {
                    name: '1'
                },
                {
                    name: '2',
                    disabled: true
                },
                {
                    name: '3'
                },
                {
                    name: '4',
                    upload: true
                },
                {
                    name: '5'
                },
                {
                    name: '6'
                },
                {
                    name: '7'
                }
            ]
        };
    },
    methods: {
        event (name, data) {
            this.$emit(name, data);
        }
    },
    components: {
        Drag
    }
};

export const wait = (ms = 50) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const sendTouchEvent = (x, y, element, eventType) => {
    const touchObj = new Touch({
        identifier: 0,
        target: element,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5
    });

    const touchEvent = new TouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true
    });

    element.dispatchEvent(touchEvent);
};
