import { mapGetters, mapActions } from 'vuex';
import mvtChart from '@/common/components/mvtchart/mvt-chart.vue';
import TrendItem from './ratetrend.presentational.vue';

//http://www.freddiemac.com/pmms/docs/historicalweeklydata.xls data source

let columnsMapper = {
    "FRM-30" : '30-Year FRM',
    "FRM-15" : '15-Year FRM',
    "ARM-51" : '5/1 Year ARM'
};

export default {
    name: 'mvtRateTrend',
    inject: ['$eventBus'],
    components: {
        mvtChart,
        TrendItem,
    },
    data() {
        return {
            chartData: null,
            sumData: [],
            filters: [
                { key: '1M', count: 4, gap: 1 },
                { key: '3M', count: 12, gap: 1 },
                { key: '6M', count: 12, gap: 2 },
                { key: '1Y', count: 12, gap: 4 },
                { key: '5Y', count: 5, gap: 52 },
                { key: '10Y', count: 10, gap: 52 },
                { key: '30Y', count: 30, gap: 52 },
            ],
            filterIndex: -1,
            maxCount: 20,
            mortgageRates: null,
        };
    },
    methods: {
        ...mapActions('glb', ['fetchMortgageRates']),
        toggleData(i) {
            if (this.filterIndex !== i) {
                this.filterIndex = i;
                var data = this.getChartData(this.filterIndex);
                this.chartData = data.chartData;
                this.sumData = data.sumData;
            }
        },
        show3rdPartyForm() {
            this.$eventBus.$emit('eventbus-pop-3rdparty', {
                id: 'preapprovalpage',
                url: 'preapprove',
                trigger: this.$options.name,
            });
        },
        getChartData(index) {
            let self = this;
            var sum = [];
            var filter = this.filters[index];
            var end = filter.count * filter.gap;
            var start = 0;
            var yAxisController = [
                {
                    display: true,
                    ticks: {
                        beginAtZero: true,
                    },
                    gridLines: {
                        color: 'rgba(255, 255, 255, 1)',
                    },
                },
            ];

            var datasets = [];
            let labels = [];
            var colors = ['#fbc02d', '#0E6959', '#B51851'];
            var dotClass = ['tip', 'main', 'danger'];
            ['FRM-30', 'FRM-15', 'ARM-51'].forEach(function (value, index) {
                let data = self.mortgageRates[value] || [];
                let count = data.length;
                let endCount = count < end ? count : end;
                let zeroFilledArr = end - count > 0 ? new Array(end - count).fill(0) : [];
                let filterData = data.slice(start, endCount).concat(zeroFilledArr).reverse();
                let recentDateIndex = filterData.length - 1;
                var itemData = filterData.filter(function (val, i) {
                    return (recentDateIndex - i) % filter.gap == 0;
                });
                if (labels.length === 0) {
                    labels = itemData.map(function (val) {
                        return val.date && val.date.replaceAll('-', '/');
                    });
                }
                var valueData = itemData.map(function (val) {
                    return val.rate || 0;
                });
                var subData = itemData.map(function (val) {
                    return val.points || 0;
                });
                var subCount = 0;
                var subSum = subData.reduce(function (prev, next) {
                    if (next > 0) {
                        subCount++;
                        prev += next;
                    }
                    return prev;
                }, 0);
                let subValue = subSum / subCount;
                sum.push({
                    title: columnsMapper[value],
                    value: valueData && valueData[valueData.length - 1].toFixed(2) + '%',
                    sub: subValue > 0 ? `${subValue.toFixed(2)} Fees/Points` : '',
                    dotClass: dotClass[index],
                });
                datasets.push({
                    label: columnsMapper[value], // Name the series
                    data: valueData, // Specify the data values array
                    fill: false,
                    borderColor: colors[index], // Add custom color border (Line)
                    backgroundColor: colors[index], // Add custom color background (Points and Fill)
                    borderWidth: 1, // Specify bar border width
                    radius: 2,
                });
            });
            return {
                chartData: {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: datasets,
                    },
                    options: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            onClick: (e) => e.stopPropagation(),
                        },
                        responsive: true, // Instruct chart js to respond nicely.
                        maintainAspectRatio: false,
                        // Add to prevent default behaviour of full-width/height
                        scales: {
                            yAxes: yAxisController,
                            xAxes: [
                                {
                                    display: true,
                                    gridLines: {
                                        color: 'rgba(232, 232, 232, 1)',
                                    },
                                    //barPercentage: 0.5,
                                    //categoryPercentage: 0.5
                                },
                            ],
                        },
                        tooltips: {
                            enabled: true,
                            titleAlign: 'center',
                        },
                    },
                },
                sumData: sum,
            };
        },
    },
    computed: {
        ...mapGetters('glb', ['glb']),
    },
    mounted() {
        this.fetchMortgageRates().then((res) => {
            this.mortgageRates = res || {};
            this.toggleData(3);
        });
    },
};
