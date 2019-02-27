import React, { Component } from "react";
import { VictoryTheme, VictoryBar, VictoryAxis, VictoryChart, VictoryLegend, VictoryTooltip} from "victory";
import { BarLoader } from 'react-spinners';
import {makeCancelable} from '../makeCancelable'

class MonthlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            max: 0,
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            isFetching: true,
            cancelable: []
        }
    }

    async componentDidMount() {
        this.fetchData();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.userId !== this.props.userId) {
            if (this.state.cancelable) {
                this.state.cancelable.forEach((item) => item.cancel())
            }
            this.setState({cancelable: []});
            this.fetchData();
        }
    }

    async fetchCounts(year) {
        const promise = fetch(`/api/v1/user/${this.props.userId}/log-entries/${year}/monthly-counts`);
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        return cancelable
        .promise
        .then((res) => {
            return res.json();
        }).then((data) => {
            const array = Object.keys(data).map((key, index) => ({"x": this.state.months[index], "y": data[key], "label": data[key]}));
            return array;
        }).catch(({isCanceled, ...error}) => console.log('isCanceled', isCanceled));
    }

    async fetchData() {
      try {
        this.setState({isFetching: true});

        let counts = {}

        counts['2019'] = await this.fetchCounts(2019);
        counts['2018'] = await this.fetchCounts(2018);
        this.setState({cancelable: []});

        // Calculate max value of both arrays
        const max = Math.max(...counts['2018'].concat(counts['2019']).map(function(o) { return o.y; }))

        this.setState({data: {'2018': counts['2018'], '2019': counts['2019']}, max: max, isFetching: false});
      } catch(error) {
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
                domain={{x: [1, 12], y: [0, this.state.max || 5]}}
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
                    data={this.state.data['2018']}
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
                                        window.open("https://letterboxd.com/heikai/films/diary/for/2019/" + (props.index + 1) + "/", '_blank');
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
                    data={this.state.data['2019']}
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
                                        window.open("https://letterboxd.com/heikai/films/diary/for/2018/" + (props.index + 1) + "/", '_blank');
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