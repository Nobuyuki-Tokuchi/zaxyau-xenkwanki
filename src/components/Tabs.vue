<template lang="pug">
    .tabs(@click="changeSelected")
        button.tab(v-select="selectedTab", data-select-value="kyori") 距離
        button.tab(v-select="selectedTab", data-select-value="menseki") 面積
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    model: {
        prop: "selectedTab",
        event: "click",
    }
})
export default class CommonSetting extends Vue {
    @Prop() selectedTab!: string;

    constructor() {
        super();
    }

    changeSelected(event: Event) {
        const el = event.target;

        if (el instanceof HTMLElement) {
            const value = el.getAttribute("data-select-value");

            if (value != null) {
                this.$emit("click", value);
            }
        }
    }
}
</script>
