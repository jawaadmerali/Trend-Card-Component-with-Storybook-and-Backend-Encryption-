<template>
    <div class="grid fixed fixed-max-sm grid-xs-1">
        <div class="text-center">
            <h2 class="f3 text-bold">Mortgage Rate Trends</h2>
        </div>
        <ul class="grid grid-xs-1 grid-sm-3">
            <li class="bg-default inline corner" v-for="(item, index) in sumData">
                <TrendItem
                    :iconColor="item.dotClass"
                    :header="item.title"
                    :description="item.value"
                    :footer="item.sub"
                    :onClick="show3rdPartyForm"
                />
            </li>
        </ul>
        <ul class="tab tab-bookmark">
            <li v-for="(item,i) in filters">
                <a @click="toggleData(i)" :class="{active: i === filterIndex}">{{ item.key }}</a>
            </li>
        </ul>
        <mvtChart v-if="chartData" :data="chartData"></mvtChart>
    </div>
</template>
<script src="./mvt-ratetrend.js"></script>
