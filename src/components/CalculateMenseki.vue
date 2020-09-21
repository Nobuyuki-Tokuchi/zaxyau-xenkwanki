<template lang="pug">
    .calculate-content(v-select="selectedTab", data-select-value="menseki")
        h2 面積を概算
        .d-flex
            .text 左上
            .control
                .text X位置
                input.input(type="number", min="0", step="0.001", v-model.number="startX")
                .text px
            .control
                .text Y位置
                input.input(type="number", min="0", step="0.001", v-model.number="startY")
                .text px
        .d-flex
            .text 長さ
            .control
                .text 幅
                input.input(type="number", min="0", step="0.001", v-model.number="width")
                .text px
            .control
                .text 高さ
                input.input(type="number", min="0", step="0.001", v-model.number="height")
                .text px
        .d-flex
            .text 右下
            .control
                .text X位置
                input.input(type="number", min="0", step="0.001", v-model.number="endX")
                .text px
            .control
                .text Y位置
                input.input(type="number", min="0", step="0.001", v-model.number="endY")
                .text px
        hr
        h2 計算結果
        .d-flex
            .text 経度
            .control
                .text 西側
                input.input(type="text", readonly, :value="displayWestLongitude")
                .text 度
            .control
                .text 東側
                input.input(type="text", readonly, :value="displayEastLongitude")
                .text 度
        .d-flex
            .text 緯度
            .control
                .text 北側
                input.input(type="text", readonly, :value="displayNorthLatitude")
                .text 度
            .control
                .text 南側
                input.input(type="text", readonly, :value="displaySouthLatitude")
                .text 度
        .d-flex
            .text 幅
            .control.quot
                .text 北側
                input.input(type="text", readonly, :value="displayNorthLongitudeLength")
                .text km
            .control.quot
                .text 南側
                input.input(type="text", readonly, :value="displaySouthLongitudeLength")
                .text km
            .control.quot
                .text 高さ
                input.input(type="text", readonly, :value="displayLatitudeLength")
                .text km
        .d-flex
            .text 面積
            .control
                .text 通常
                input.input(type="text", readonly, :value="displayArea")
                .text km
                    sup 2
</template>

<script lang="ts">
import Calculator from '@/libs/calculator';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CalculateMenseki extends Vue {
    @Prop() selectedTab!: string;
    @Prop() calculator!: Calculator;
    @Prop() precision!: boolean;

    startX: number;
    startY: number;
    width: number;
    height: number;

    constructor() {
        super();

        this.startX = 0;
        this.startY = 0;
        this.width = 0;
        this.height = 0;
    }

    get startLatitude(): number {
        return this.calculator.getLatitude(this.startY);
    }

    get startLongitude(): number {
        return this.calculator.getLongitude(this.startX);
    }

    get endLatitude(): number {
        return this.calculator.getLatitude(this.endY);
    }

    get endLongitude(): number {
        return this.calculator.getLongitude(this.endX);
    }

    get endY(): number {
        return this.startY + this.height; 
    }

    set endY(value: number) {
        this.height = value - this.startY;
    }

    get endX(): number {
        return this.startX + this.width;
    }

    set endX(value: number) {
        this.width = value - this.startX;
    }

    get displayNorthLatitude(): string {
        return this.displayLatitude(this.startLatitude, this.precision);
    }

    get displayWestLongitude(): string {
        return this.displayLongitude(this.startLongitude, this.precision);
    }
    
    get displaySouthLatitude(): string {
        return this.displayLatitude(this.endLatitude, this.precision);
    }

    get displayEastLongitude(): string {
        return this.displayLongitude(this.endLongitude, this.precision);
    }

    get displayNorthLongitudeLength(): string {
        return this.calculateLongitudeLength(this.startLatitude);
    }

    get displaySouthLongitudeLength(): string {
        return this.calculateLongitudeLength(this.endLatitude);
    }

    get displayLatitudeLength(): string {
        const f1 = 90 - this.startLatitude;
        const f2 = 90 - this.endLatitude;
        const r = Calculator.RAD * this.calculator.round / (2 * Math.PI);

        const ret = Math.abs(f1 - f2) * r;

        return this.precision ? ret.toPrecision(6) : ret.toString();
    }

    get displayArea(): string {
        const north = this.startLatitude;
        const south = this.endLatitude;
        const west = this.startLongitude;
        const east = this.endLongitude;

        const ret = Math.pow(this.calculator.round / (2 * Math.PI), 2) * Math.abs(east - west) * Calculator.RAD
            * Math.abs(Math.cos((90 - north) * Calculator.RAD) - Math.cos((90 - south) * Calculator.RAD));

        return this.precision ? ret.toPrecision(6) : ret.toString();
    }

    private displayLatitude(latitude: number, precision: boolean): string {
        if (latitude === latitude) {
            if (precision) {
                return latitude <= 0 ? ("N" + (-latitude).toPrecision(6)) : ("S" + latitude.toPrecision(6));
            }
            else {
                return latitude <= 0 ? ("N" + (-latitude)) : ("S" + latitude);
            }
        }
        else {
            return "" + latitude;
        }
    }

    private displayLongitude(longitude: number, precision: boolean): string {
        if(longitude === longitude) {
            if(precision) {
                return longitude >= 0 ? ("E"+ longitude.toPrecision(6)) : ("W"+ (-longitude).toPrecision(6));
            }
            else {
                return longitude >= 0 ? ("E"+ longitude) : ("W"+ (-longitude));
            }
        }
        else {
            return "" + longitude;
        }
    }

    private calculateLongitudeLength (latitude: number): string {
        const ret = Math.abs(Math.sin((90 - latitude) * Calculator.RAD)
            * Math.abs(this.startLongitude - this.endLongitude) * Calculator.RAD
            * this.calculator.round / (2 * Math.PI));

        return this.precision ? ret.toPrecision(6) : ret.toString();
    }

}
</script>

<style lang="scss" scoped>
.control {
    flex-basis: 100% * 1 / 3;
    &.quot {
        flex-basis: 100% * 1 / 4;
    }
}
</style>
