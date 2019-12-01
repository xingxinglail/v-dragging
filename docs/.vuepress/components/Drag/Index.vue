<template>
    <div>
        <drag
            handle="draggable"
            :value="list"
            :columns="columns">
            <div class="item"
                 v-for="item in list"
                 :class="item.disabled ? 'disabled' : 'draggable'"
                 :key="item.name">
                <div class="inner">
                    <div class="disabled" v-if="item.disabled">Disabled</div>
                    <img :src="item.img" width="100%">
                </div>
            </div>
        </drag>
        <div class="control">
            columns:{{ columns }}
            <input
                type="range"
                name="columns"
                :value="columns"
                min="1"
                max="8"
                @change="rangeChange">
        </div>
    </div>
</template>

<script>
import Drag from '../../../../src/Drag.vue';

export default {
    name: 'Index',
    data () {
        return {
            columns: 4,
            list: [
                {
                    name: '0',
                    img: require('./imgs/1.png')
                },
                {
                    name: '1',
                    img: require('./imgs/2.png')
                },
                {
                    name: '2',
                    img: require('./imgs/3.png'),
                    disabled: true
                },
                {
                    name: '3',
                    img: require('./imgs/4.png')
                },
                {
                    name: '4',
                    img: require('./imgs/5.png')
                },
                {
                    name: '5',
                    img: require('./imgs/6.png')
                },
                {
                    name: '6',
                    img: require('./imgs/7.png')
                },
                {
                    name: '7',
                    img: require('./imgs/8.png'),
                    disabled: true
                },
                {
                    name: '8',
                    img: require('./imgs/9.png')
                },
                {
                    name: '9',
                    img: require('./imgs/10.png')
                }
            ]
        };
    },methods: {
        rangeChange ({ target }) {
            this.columns = target.value * 1;
        },
        add () {
            this.list.push({
                name: `${this._count}`
            });
            this._count++;
        },
        remove (index) {
            this.list.splice(index, 1);
        },
        update (val) {
            // console.log(val);
        },
        change (val) {
            // this.list = val;
        },
        end (val) {
            console.log('end');
            // console.log(val);
        }
    },
    components: {
        Drag
    }
};
</script>

<style lang="scss" scoped>
.control {
    padding: 20px 0;
}
.item {
    width: 23.5%;
    text-align: center;
    font-size: 32px;
    color: #fff;
    padding: 0 2% 2% 0;

    .inner {
        padding-top: 100%;
        height: 0;
        position: relative;

        img, .disabled {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    &.disabled {

        .disabled {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            opacity: 0.7;
            background-color: #7f7f7f;
            font-size: 1rem;
        }

        img {
            filter: grayscale(1);
        }
    }
}
</style>
