import React, { useEffect } from 'react'
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '@highcharts/dashboards/es-modules/DataGrid/DataGrid';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin';
import DataGridPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/DataGridPlugin';

import './chart.css'

HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(DataGridPlugin);

function Chart(columns) {

    const { DATE, TICKETS_CREATED_IN_A_DAY, TICKETS_CLOSED_IN_A_DAY, TICKETS_TO_BE_ADDRESSED, TOTAL_ES_QUEUE } = columns.dataObject;

    console.log(DATE)
    const formattedDate = DATE.map(date => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    });
    const formattedDates = formattedDate.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    });

    const config = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Tickets',
            align: 'left'
        },
        xAxis: [{
            categories: formattedDates,

            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '',
                style: {
                    color: '#113353',
                }
            },
            title: {
                text: '',
                style: {
                    color: '#fd3353',
                }
            },
            opposite: true

        }, { // Secondary yAxis


        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Tickets Created in a day',
            type: 'column',
            color: '#fd5e53',
            yAxis: 1,
            data: TICKETS_CREATED_IN_A_DAY,
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Tickets Closed in a day',
            type: 'column',
            yAxis: 1,
            data: TICKETS_CLOSED_IN_A_DAY,
            tooltip: {
                valueSuffix: ''
            }

        },
        {
            name: 'Tickets to be addressed',
            type: 'spline',
            color: Highcharts.getOptions().colors[1],
            data: TICKETS_TO_BE_ADDRESSED,
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Total ES Queue',
            type: 'spline',
            color: Highcharts.getOptions().colors[0],
            data: TOTAL_ES_QUEUE,
            tooltip: {
                valueSuffix: ''
            }
        }
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        floating: false,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        x: 0,
                        y: 0
                    },
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: 0,
                            y: -6
                        },
                        showLastLabel: false
                    }, {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -6
                        },
                        showLastLabel: false
                    }, {
                        visible: false
                    }]
                }
            }]
        }
    }
    useEffect(() => {
        Highcharts.chart('container', config);
    }, [config]);

    return (
        <div id='container'></div>
    )
}

export default Chart
