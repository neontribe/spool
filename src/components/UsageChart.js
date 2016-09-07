import React, { Component } from 'react';
import { Line as LineChart } from 'react-chartjs-2';

export class UsageChart extends Component {
    /*    static propTypes = {
        data: React.PropTypes.array.isRequired
        label: React.PropTypes.string,
    } */
    render() {
        return (
            <div>
                <LineChart data={{
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "All Users",
            fill: false,
            lineTension: 0.0,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [5, 6, 8, 5, 6, 2, 4],
            spanGaps: false,
        }
    ]
}} options={{}} width={600} height={250} />
            </div>
        );
    }
};
