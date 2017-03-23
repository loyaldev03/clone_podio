var Dashboard = function() {

    return {
        initCharts: function() {
            if (!jQuery.plot) {
                return;
            }
        },

        drawCharts: function(id, value){
            $(id).highcharts({
                  chart: { type: 'gauge', plotBackgroundColor: null, plotBackgroundImage: null, plotBorderWidth: 0, plotShadow: false },
                        title: null,
                        exporting: { enabled: false },
                        pane: { center: ['50%', '50%'], size: '40%', startAngle: 115, endAngle: -115, background: null },
                        plotOptions: {
                            gauge: {
                                dataLabels: { enabled: true, style: { 'fontSize': '16px' }, y: 50, borderWidth: 0 },
                                dial: { backgroundColor: '#c72424', borderColor: '#c72424', radius: '130%', baseLength: '0%' }, // dial arrow
                                pivot: { backgroundColor: '#c72424', radius: '4', }, // dial arrow dot
                                tooltip: {followTouchMove: true}
                            }
                        },
                        yAxis: {
                            pane: 0,
                            min: 0,
                            max: 100,
                            lineColor: null,
                            reversed: true,
                            //minorTickInterval: 1,
                            //tickPixelInterval: 10,
                            //minorTickPosition: 'outside',
                            //tickPosition: 'outside',
                            tickWidth: 0,
                            //tickPositions: [0, 1000, 2000, 3000],
                            labels: { enabled: false, step: 1, distance: 15, rotation: 'auto' },
                            title: { text: value.toString()+"%", align: 'middle', style: { 'fontSize': '12px', 'text-transform': 'none' }, y: 0 }, // Y Title
                            plotBands: [
                                { innerRadius: '150%', outerRadius: '180%', from: 0, to: 33, color: '#55BF3B' }, // green
                                { innerRadius: '150%', outerRadius: '180%', from: 33, to: 66, color: '#ffcc00' }, // yellow
                                { innerRadius: '150%', outerRadius: '180%', from: 66, to: 100, color: '#DF5353' } // red
                            ],
                        },
                        tooltip: { followTouchMove: true },
                  series: [
                        {
                            name: '%',
                            data: [value]
                        }
                    ],
	    });
        },       

        init: function() {

            this.initCharts();
            
        }
    };

}();

if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        Dashboard.init(); // init metronic core componets
    });
}
