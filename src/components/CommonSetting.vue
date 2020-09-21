<template lang="pug">
    div
        h2 地図・惑星の共通設定
        .d-flex
            .control
                .text 世界地図の幅
                input.input(type="number", min="0", step="0.001", :value="calculator.width", @change="$emit('change-value', 'width', parseFloat($event.target.value))")
                .text px
            .control
                .text 世界地図の高さ
                input.input(type="number", min="0", step="0.001", :value="calculator.height", @change="$emit('change-value', 'height', parseFloat($event.target.value))")
                .text px
            .control
                .text 惑星の円周
                input.input(type="number", min="0", step="0.001", :value="calculator.round", @change="$emit('change-value', 'round', parseFloat($event.target.value))")
                .text km
        .d-flex
            .control
                .text 有効桁数を6桁にする：
                input(type="checkbox", :checked="precision", @change="$emit('change-precision', $event.target.checked)")
</template>

<script lang="ts">
import Calculator from '@/libs/calculator';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CommonSetting extends Vue {
    @Prop() calculator!: Calculator;
    @Prop() precision!: boolean;

    constructor() {
        super();
    }
}
</script>

<style lang="scss" scoped>
.control {
    flex-basis: 100% * 1 / 3;
}
</style>