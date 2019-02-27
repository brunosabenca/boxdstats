import React, { Component } from "react";
import { VictoryTheme, VictoryBar, VictoryAxis, VictoryChart, VictoryLegend, VictoryTooltip} from "victory";
import { BarLoader } from 'react-spinners';

class MonthlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            prevData: [],
            max: 0,
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

        // Calculate max value of both arrays
        const max = Math.max(...arr.concat(prevarr).map(function(o) { return o.y; }))

        this.setState({prevData: prevarr, max: max, isFetching: false});
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
                fontSize: 6,
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                fill: "#89a",
                fillOpacity: 1,
                margin: 0,
                padding: 2,
            },
        };
        return (
            this.state.isFetching ===  false ?
            <VictoryChart
                theme={VictoryTheme.grayscale}
                domain={{x: [1, 12], y: [0, this.state.max]}}
                domainPadding={{x: [2, 2], y: 0}}
                padding={10}
                height={100}
                width={350}
                horizontal={false}
            >
                <VictoryLegend x={290} y={0}
                    width={100}
                    orientation="horizontal"
                    style={{
                        data: {
                            fill: '#89a',
                        },
                        labels: {
                            fill: '#89a',
                            fontSize: 6 
                        },
                    }}

                    data={[
                        { name: "2018", symbol: { fill: "#2c3440"} },
                        { name: "2019", symbol: { fill: "#89a" } },
                    ]}
                />
                <VictoryBar

                    height={100}
                    width={350}
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
                            fontSize: 6,
                        }
                    }}
                    alignment="start"
                    barWidth={10}
                    labelComponent={<VictoryTooltip 
                        cornerRadius={1}
                        pointerLength={3}
                        width={11}
                        height={11}
                        dx={4}
                        dy={-8}
                        style={{
                            fill: '#2c3440',
                            padding: 1,
                            fontSize: 6,
                        }}
                        flyoutStyle={{
                            stroke: "none",
                            fill: "#89a"
                        }}
                        />
                    }
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: () => {
                                    return [{
                                    target: "data",
                                    mutation: (props) => {
                                        window.open("https://letterboxd.com/heikai/films/diary/for/2019/" + (props.index + 1), '_blank');
                                        console.log(props.index);
                                    }
                                    }];
                                },
                                onMouseOver: () => {
                                return [
                                    {
                                    mutation: (props) => {
                                        return {
                                        style: Object.assign({}, props.style, { cursor: 'pointer', opacity: 0.8 })
                                        }
                                    }
                                    }, {
                                    target: "labels",
                                    mutation: () => ({active: true})
                                    }
                                ]
                                },
                                onMouseOut: () => {
                                return [
                                    {
                                    mutation: (props) => {
                                        return {
                                        style: Object.assign({}, props.style, { cursor: 'auto', opacity: 1})
                                        }
                                    }
                                    }, {
                                    target: "labels",
                                    mutation: () => ({active: false})
                                    }
                                ]
                                }
                            }
                        }
                    ]}
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
                            fontSize: 6,
                        }
                    }}
                    alignment="end"
                    barWidth={10}
                    labelComponent={<VictoryTooltip 
                        cornerRadius={1}
                        pointerLength={3}
                        width={11}
                        height={11}
                        dx={-4}
                        dy={-8}
                        style={{
                            fill: '#89a',
                            padding: 1,
                            fontSize: 6,
                        }}
                        flyoutStyle={{
                            stroke: "none",
                            fill: "#2c3440"
                        }}
                        />
                    }
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: () => {
                                    return [{
                                    target: "data",
                                    mutation: (props) => {
                                        window.open("https://letterboxd.com/heikai/films/diary/for/2018/" + (props.index + 1), '_blank');
                                        console.log(props.index);
                                    }
                                    }];
                                },
                                onMouseOver: () => {
                                return [
                                    {
                                    mutation: (props) => {
                                        return {
                                        style: Object.assign({}, props.style, { cursor: 'pointer', opacity: 0.8 })
                                        }
                                    }
                                    }, {
                                    target: "labels",
                                    mutation: () => ({active: true})
                                    }
                                ]
                                },
                                onMouseOut: () => {
                                return [
                                    {
                                    mutation: (props) => {
                                        return {
                                        style: Object.assign({}, props.style, { cursor: 'auto', opacity: 1})
                                        }
                                    }
                                    }, {
                                    target: "labels",
                                    mutation: () => ({active: false})
                                    }
                                ]
                                }
                            }
                        }
                    ]}
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