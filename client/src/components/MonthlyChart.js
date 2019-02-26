import React, { Component, View } from "react";
import { VictoryTheme, VictoryLabel,VictoryBar, VictoryAxis, VictoryChart, VictoryLegend } from "victory";
import { BarLoader } from 'react-spinners';

class MonthlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            prevData: [],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            isFetching: true,
        }
    }

    async componentDidMount() {
        this.fetchData();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.userId !== this.props.userId) {
            this.fetchData();
        }
    }

    async fetchData() {
      try {
        this.setState({isFetching: true});
        const response = await fetch(`/api/v1/user/${this.props.userId}/log-entries/2019/monthly-counts`);
        const data = await response.json();
        const arr = Object.keys(data).map((key, index) => ({"x": this.state.months[index], "y": data[key], "label": data[key]}));
        this.setState({data: arr});
        const prevresponse = await fetch(`/api/v1/user/${this.props.userId}/log-entries/2018/monthly-counts`);
        const prevdata = await prevresponse.json();
        const prevarr = Object.keys(prevdata).map((key, index) => ({"x": this.state.months[index], "y": prevdata[key], "label": prevdata[key]}));
        this.setState({prevData: prevarr, isFetching: false});
      } catch(e) {
        this.setState({isFetching: false});
      }
    }




    render() {
        const tickStyle = {
            axis: {
                strokeWidth: 0,
            },
            ticks: {
                size: 2,
                stroke: '#89a',
                strokeOpacity: 0.1
            },
            grid: {
                stroke: 'rgba(0, 0, 0, 0.1)',
                strokeWidth: 0,
                strokeDasharray: '6, 6',
            },
            tickLabels: {
                fontSize: '10px',
                fontFamily: 'inherit',
                fill: "#89a",
                fillOpacity: 1,
                margin: 0,
                padding: 0,
            },
            axisLabel: {
                fontsize: '10px', 
            }
        };
        return (
            this.state.isFetching ===  false ?
            <VictoryChart
                theme={VictoryTheme.grayscale}
                height={100}
                domain={{ x: [1, 12] }}
                domainPadding={{x: [15, 15], y: 20}}
                padding={15}
                horizontal={false}
            >
                <VictoryLegend x={350} y={0}
                    width={100}
                    orientation="horizontal"
                    style={{
                        data: {
                            fill: '#89a',
                        },
                        labels: {
                            fill: '#89a',
                            fontSize: 8 
                        },
                    }}

                    data={[
                        { name: "2018", symbol: { fill: "#2c3440"} },
                        { name: "2019", symbol: { fill: "#89a" } },
                    ]}
                />
                <VictoryBar
                    data={this.state.data}
                    animate={{
                        onExit: {
                            duration: 500
                        }
                    }}
                    style={{
                        data: {
                            fill: '#89a'
                        },
                        labels: {
                            fill: '#89a',
                            fontSize: '10px',
                        }
                    }}
                    alignment="start"
                    barWidth={12}
                    labelComponent={<VictoryLabel dx={7}/>}
                /> 
                <VictoryBar
                    data={this.state.prevData}
                    animate={{
                        onExit: {
                            duration: 500
                        }
                    }}
                    style={{
                        data: {
                            fill: '#2c3440',
                        },
                        labels: {
                            fill: '#2c3440',
                            fontSize: '8px',
                        }
                    }}
                    alignment="end"
                    barWidth={8}
                    labelComponent={<VictoryLabel dx={-6}/>}
                /> 
                <VictoryAxis
                    tickFormat={ (t, i) => { return this.state.months[i]} }   
                    style={tickStyle}
                />
            </VictoryChart>
            :
            <BarLoader
                widthUnit="%"
                width={100}
                color={'#24303c'}
                loading={this.state.isFetching}
                className="loading"
            />
        )
    }
}

export default MonthlyChart;