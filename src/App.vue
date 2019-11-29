<template>
    <div id="app">
        <div class="container">
            <draggable
                    handle="draggable"
                    :value="list"
                    :columns="columns"
                    @update="update"
                    @change="change"
                    @end="end">
                <div class="item"
                     style="width: 200px;height: 200px;background-color: #09f;"
                     v-for="(item) in list"
                     :class="item.disabled || item.upload ? 'disabled' : 'draggable'"
                     :key="item.name">
                    {{ item.name }}
<!--                    <div class="inner">-->
<!--                        <div class="content" v-if="item.upload">-->
<!--                            上传-->
<!--                        </div>-->
<!--                        <div class="content" v-else>-->
<!--                            {{ item.name }}-->
<!--                            <p @click="remove(index)">删除</p>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </draggable>
        </div>
        <div @click="add">增加</div>
        <div @click="columns = columns === 4 ? 2 : 4">修改columns</div>
        <!--        <div class="container2">-->
        <!--            <draggable-->
        <!--                    handle="draggable"-->
        <!--                    :value="list"-->
        <!--                    :columns="2"-->
        <!--                    @update="update"-->
        <!--                    @change="change"-->
        <!--                    @end="end">-->
        <!--                <div class="item2"-->
        <!--                     v-for="(item) in list"-->
        <!--                     :class="item.disabled || item.upload ? 'disabled' : 'draggable'"-->
        <!--                     :key="item.name">-->
        <!--                    <div class="inner2">-->
        <!--                        <div class="content2" v-if="item.upload">-->
        <!--                            上传-->
        <!--                        </div>-->
        <!--                        <div class="content2" v-else>-->
        <!--                            {{ item.name }}-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </draggable>-->
        <!--        </div>-->
    </div>
</template>

<script>
/* eslint-disable */
import syn from 'syn';
import Draggable from './components/Drag.vue';

export default {
    name: 'app',
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
    created () {
        this._count = 9;
        setTimeout(() => {
            const item = document.querySelectorAll('.drag__item')[0]
            syn.drag(
                item,
                {
                    from: { pageX: 40, pageY: 40 },
                    to: { pageX: 740, pageY: 40 }
                }
            );
        }, 600)
        // setTimeout(() => {
        //     this.list = [
        //         {
        //             name: '0'
        //         },
        //         {
        //             name: '1',
        //             disabled: true
        //         },
        //         {
        //             name: '2'
        //         },
        //         {
        //             name: '3'
        //         },
        //         {
        //             name: '4',
        //             disabled: true
        //         },
        //         {
        //             name: '5'
        //         },
        //         {
        //             name: '6'
        //         },
        //         {
        //             name: '7'
        //         },
        //         {
        //             name: '8',
        //             upload: true
        //         }
        //     ]
        // }, 300)
    },
    methods: {
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
        Draggable
    }
};
</script>

<style lang="scss">
/** {*/
/*    margin: 0;*/
/*    padding: 0;*/
/*}*/

.container {
    min-height: 70vh;
}

.container2 {
    display: flex;
    flex-wrap: wrap;

    .item2 {
        width: 340px;
        height: 120px;
        border: 1px solid red;

        &.disabled {
            border-color: #ddd;
        }
    }
}

.item {
    /*width: 23.5%;*/
    /*text-align: center;*/
    /*font-size: 32px;*/
    /*color: #fff;*/
    /*padding: 0 2% 2% 0;*/
    width: 200px;
    height: 200px;

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
