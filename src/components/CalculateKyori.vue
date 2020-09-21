<template lang="pug">
    .calculate-content(v-select="selectedTab", data-select-value="kyori")
        h2 二点間の長さを概算
        .d-flex
            .text 始点
            .control
                .text X位置
                input.input(type="number", min="0", step="0.001", v-model.number="startX")
                .text px
            .control
                .text Y位置
                input.input(type="number", min="0", step="0.001", v-model.number="startY")
                .text px
        .d-flex
            .text 終点
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
            .text 始点
            .control
                .text 経度
                input.input(type="text", readonly, :value="displayStartLongitude")
                .text 度
            .control
                .text 緯度
                input.input(type="text", readonly, :value="displayStartLatitude")
                .text 度
        .d-flex
            .text 終点
            .control
                .text 経度
                input.input(type="text", readonly, :value="displayEndLongitude")
                .text 度
            .control
                .text 緯度
                input.input(type="text", readonly, :value="displayEndLatitude")
                .text 度
        .d-flex
            .text 距離
            .control
                .text 通常
                input.input(type="text", readonly, :value="displayLength")
                .text km
            .control
                .text haversine関数
                input.input(type="text", readonly, :value="displayLengthHaversine")
                .text km
</template>

<script lang="ts">
import Calculator from '@/libs/calculator';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CalculateKyori extends Vue {
    @Prop() selectedTab!: string;
    @Prop() calculator!: Calculator;
    @Prop() precision!: boolean;

    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor() {
        super();

        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
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

    get displayStartLatitude(): string {
        return this.displayLatitude(this.startLatitude, this.precision);
    }

    get displayStartLongitude(): string {
        return this.displayLongitude(this.startLongitude, this.precision);
    }
    
    get displayEndLatitude(): string {
        return this.displayLatitude(this.endLatitude, this.precision);
    }

    get displayEndLongitude(): string {
        return this.displayLongitude(this.endLongitude, this.precision);
    }

    get displayLength(): string {
        const startLatRad = this.startLatitude * Calculator.RAD;
        const startLonRad = this.startLongitude * Calculator.RAD;
        const endLatRad = this.endLatitude * Calculator.RAD;
        const endLonRad = this.endLongitude * Calculator.RAD;

        const x = Math.cos(endLatRad) * Math.cos(endLonRad) - Math.cos(startLatRad) * Math.cos(startLonRad);
        const y = Math.cos(endLatRad) * Math.sin(endLonRad) - Math.cos(startLatRad) * Math.sin(startLonRad);
        const z = Math.sin(endLatRad) - Math.sin(startLatRad);

        const ret = 2 * Math.asin(Math.hypot(Math.hypot(x, y), z) / 2) * this.calculator.round / (2 * Math.PI);
        
        return this.precision ? ret.toPrecision(6) : ret.toString();
    }

    get displayLengthHaversine(): string {
        const startLatRad = this.startLatitude * Calculator.RAD;
        const endLatRad = this.endLatitude * Calculator.RAD;
        const dLatRad = Math.abs(this.endLatitude - this.startLatitude) * Calculator.RAD;
        const dLonRad = Math.abs(this.endLongitude - this.startLongitude) * Calculator.RAD;

        const x = Math.pow(Math.sin(dLatRad / 2), 2);
        const y = Math.cos(startLatRad) * Math.cos(endLatRad) * Math.pow(Math.sin(dLonRad / 2), 2);

        const ret = 2 * Math.asin(Math.sqrt(x + y)) * this.calculator.round / (2 * Math.PI);

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
}
</script>

<style lang="scss" scoped>
.control {
    flex-basis: 100% * 1 / 3;
}
</style>
