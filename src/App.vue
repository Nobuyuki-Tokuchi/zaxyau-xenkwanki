<template lang="pug">
    #app
        h1 座標変換器（正距円筒図法用）
        hr
        CommonSetting(:calculator="calculator", @change-precision="changeprecision", @change-value="changeValue")
        Tabs(v-model="selectedTab")
        div
            CalculateKyori(:selectedTab="selectedTab", :calculator="calculator", :precision="precision")
            CalculateMenseki(:selectedTab="selectedTab", :calculator="calculator", :precision="precision")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonSetting from "./components/CommonSetting.vue";
import Tabs from "./components/Tabs.vue";
import CalculateKyori from "./components/CalculateKyori.vue";
import CalculateMenseki from "./components/CalculateMenseki.vue";
import Calculator from "@/libs/calculator";

@Component({
    components: {
        CommonSetting,
        Tabs,
        CalculateKyori,
        CalculateMenseki,
    },
})
export default class App extends Vue {
    calculator: Calculator;
    precision: boolean;
    selectedTab: string;

    constructor() {
        super();
        this.calculator = new Calculator();
        this.precision = false;
        this.selectedTab = "kyori";

        this.calculator.round = 40000;
    }

    changeValue(propertyName: string, value: number) {
        switch (propertyName) {
            case "width":
                this.calculator.width = value;
                break;
            case "height":
                this.calculator.height = value;
                break;
            case "round":
                this.calculator.round = value;
                break;
        }
    }

    changeprecision(precision: boolean) {
        this.precision = precision;
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-align: left;
    color: #2c3e50;
    margin-top: 10px;
    font-size: 12px;
}

h1, h2 {
    margin-top: 10px;
    margin-bottom: 10px;
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
}

.d-flex {
    display: flex;
    & > * {
        margin: 5px;
    }

    &.flex-column {
        flex-direction: column;
    }
}

.calculate-content {
    display: none;

    &.selected {
        display: inherit;
    }
}

.control {
    box-sizing: border-box;
    display: flex;
    margin-left: 5px;
    margin-right: 5px;

    > .text,
    > .input {
        margin-left: 2px;
        margin-right: 2px;
    }

    > .text {
        flex-grow: 0;
        flex-shrink: 0;
    }

    > .input {
        flex-grow: 1;
        flex-shrink: 1;
    }
}
</style>
