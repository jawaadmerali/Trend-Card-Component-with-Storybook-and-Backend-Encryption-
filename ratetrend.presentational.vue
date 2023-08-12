<template>
    <div class="ratetrend-presentational bg-default inline corner">
        <a @click="onClick">
            <div>
                <i v-if="iconColor && iconColor.length" :class="`dot small bg-${iconColor}`"></i>
                <b class="f7">{{ header }}</b>
            </div>
            <div>
                <h3 class="text-bold f3">{{ description }}</h3>
            </div>
            <div v-if="footer" :class="`f7`"> {{ footer }}</div>
        </a>
    </div>
 </template>

<script>
export default {
    name: 'TrendItem',
    props: {
        iconColor: String,
        header: String,
        description: String,
        footer: String,
        onClick: Function,
    },
};
</script>
