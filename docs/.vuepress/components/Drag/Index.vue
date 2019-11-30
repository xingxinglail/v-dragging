<template>
    <div>
        <drag
                handle="draggable"
                :value="list"
                :columns="columns">
            <div class="item"
                 v-for="(item, index) in list"
                 :class="item.disabled || item.upload ? 'disabled' : 'draggable'"
                 :key="item.name">
                    <div class="inner">
                        <div class="content" v-if="item.upload">
                            上传
                        </div>
                        <div class="content" v-else>
                            {{ item.name }}
                            <p @click="remove(index)">删除</p>
                        </div>
                    </div>
            </div>
        </drag>
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
    },methods: {
        unChoose (v) {
            console.log(v);
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

        .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #09f;
        }
    }

    &.disabled {

        .inner .content {
            background-color: #eee;
        }
    }

    p {
        cursor: pointer;
    }
}
</style>
