import React, { Component } from "react";
import { VictoryTheme, VictoryBar, VictoryAxis, VictoryChart, VictoryLegend, VictoryTooltip} from "victory";
import { BarLoader } from 'react-spinners';
import {makeCancelable} from '../makeCancelable'

class CustomTooltip extends React.Component {
  render() {
    return (
        <VictoryTooltip {...this.props} renderInPortal={false}/>
    );
  }
}

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

    componentWillUnmount() {
        if (this.state.cancelable) {
            this.state.cancelable.forEach((item) => item.cancel())
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
            const array = Object.keys(data).map((key, index) => ({ "x": this.state.months[index], "y": data[key], "label": data[key], "year": year }));
            return array;
        }).catch(({isCanceled, ...error}) => {
            if (isCanceled) {
                console.log('Fetching monthly counts was cancelled.')
            }
        });
    }

    async fetchData() {
        this.setState({isFetching: true});

        const counts2019 = await this.fetchCounts(2019);
        const counts2020 = await this.fetchCounts(2020);

        const promise =  Promise.all([counts2019, counts2020]);
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        cancelable
        .promise
        .then((data) => {
            // Calculate max value of both arrays
            const max = Math.max(...data[0].concat(data[1]).map(function(o) { return o.y; }))

            this.setState({data: {'2019': data[0], '2020': data[1]}, max: max, isFetching: false, cancelable: []});
        }).catch(({isCanceled, ...error}) => {
            if (isCanceled) {
                console.log('Fetching monthly chart data was cancelled.')
            }
        });
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
        const theme = {
            2019: {
                bar: {
                    normal: {
                        data: {
                            fill: '#2c3440',
                            cursor: 'auto'
                        },
                        labels: {
                            fill: '#89a', fontSize: 5,
                        }
                    },
                    mouseover: {
                        data: {
                            fill: '#40bcf4',
                            cursor: 'pointer'
                        },
                        labels: {
                            fill: '#40bcf4', fontSize: 5,
                        }
                    },
                },
                tooltip: { 
                    normal: {
                        padding: 1, fontSize: 6, fill: '#2c3440'
                    },
                    mouseover: {
                        padding: 1, fontSize: 6, fill: '#2c3440'
                    }
                },
                flyout :{
                    stroke: "none", fill: "#40bcf4"
                },
                colors: {
                    colorA: '#2c3440',
                    colorB: '#89a'
                }
            },
            2020: {
                bar: {
                    normal: {
                        data: {
                            fill: '#89a',
                            cursor: 'auto'
                        },
                        labels: {
                            fill: '#2c3440', fontSize: 5,
                        }
                    },
                    mouseover: {
                        data: {
                            fill: '#40bcf4',
                            cursor: 'pointer'
                        },
                        labels: {
                            fill: '#40bcf4', fontSize: 5,
                        }
                    }
                },
                tooltip: {
                    normal: {
                        padding: 1, fontSize: 6, fill: '#2c3440'
                    },
                    mouseover: {
                        padding: 1, fontSize: 6, fill: '#2c3440'
                    }
                },
                flyout: {
                    stroke: "none", fill: "#40bcf4"
                },
                colors: {
                    colorA: '#89a',
                    colorB: '#2c3440'
                }
            },
            colors: {
                colorDark: '#2c3440',
                colorLight: '#89a',
                colorBright: "#40bcf4",
            }
        }

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
                events={[
                {
                    childName: "legend",
                    target: "labels",
                    eventHandlers: {
                        onMouseOver: (event, props) => {
                            return [
                            {
                                childName: "legend",
                                target: "data",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, { fill: theme.colors.colorBright })
                                    }
                                }
                            },
                            {
                                childName: "legend",
                                target: "labels",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, { fill: theme.colors.colorBright })
                                    }
                                }
                            },
                            {
                                childName: `bars${props.datum.name}`,
                                target: "labels",
                                eventKey: "all",
                                mutation: () => ({active: true})
                            },
                            {
                                childName: `bars${props.datum.name}`,
                                target: "data",
                                eventKey: "all",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, theme[props.datum.year].bar.mouseover.data)
                                    }
                                }
                            }
                        ];
                        },
                        onMouseOut: (event, props) => {
                            return [
                            {
                                childName: "legend",
                                target: "data",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, { fill: theme[Number.parseInt(props.datum.name)].colors.colorA })
                                    }
                                }
                            },
                            {
                                childName: "legend",
                                target: "labels",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, { fill: theme.colors.colorLight })
                                    }
                                }
                            },
                            {
                                childName: `bars${props.datum.name}`,
                                target: "labels",
                                eventKey: "all",
                                mutation: () => ({active: false})
                            },
                            {
                                childName: `bars${props.datum.name}`,
                                target: "data",
                                eventKey: "all",
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, theme[props.datum.year].bar.normal.data)
                                    }
                                }
                            }
                        ];
                        },
                    }
                },
                {
                    childName: "bars2019",
                    target: "data",
                    eventHandlers: {
                        onClick: () => {
                            return [{
                                target: "data",
                                mutation: (props) => {
                                    window.open(`https://letterboxd.com/${this.props.userName}/films/diary/for/2019/${props.index+1}/`, '_blank');
                                }
                            }];
                        },
                        onMouseOver: (event, props) => {
                            return [
                                {
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, theme[2019].bar.mouseover.data)
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
                                        style: Object.assign({}, props.style, theme[2019].bar.normal.data)
                                    }
                                }
                                }, {
                                    target: "labels",
                                    mutation: () => ({active: false})
                                }
                            ]
                        }
                    }
                },
                {
                    childName: "bars2020",
                    eventHandlers: {
                        onClick: () => {
                            return [{
                            target: "data",
                            mutation: (props) => {
                                window.open(`https://letterboxd.com/${this.props.userName}/films/diary/for/2020/${props.index+1}/`, '_blank');
                            }
                            }];
                        },
                        onMouseOver: () => {
                            return [
                                {
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, theme[2020].bar.mouseover.data)
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
                                        style: Object.assign({}, props.style, theme[2020].bar.normal.data)
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
            >
                <VictoryLegend x={290} y={0}
                    name="legend"
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
                        { name: "2019", symbol: { fill: "#2c3440"} },
                        { name: "2020", symbol: { fill: "#89a" } },
                    ]}
                />
                <VictoryBar
                    name="bars2019"
                    height={100}
                    width={350}
                    data={this.state.data['2019']}
                    animate={{
                        onExit: {
                            duration: 500
                        }
                    }}
                    style={theme[2019].bar.normal}
                    alignment="start"
                    barWidth={10}
                    labelComponent={<CustomTooltip 
                        cornerRadius={1}
                        pointerLength={3}
                        width={10}
                        height={9}
                        dx={5}
                        dy={-8}
                        style={theme[2019].tooltip.normal}
                        flyoutStyle={theme[2019].flyout}
                        />
                    }
                /> 
                <VictoryBar
                    name="bars2020"
                    data={this.state.data['2020']}
                    animate={{
                        onExit: {
                            duration: 500
                        }
                    }}
                    style={theme[2020].bar.normal}
                    alignment="end"
                    barWidth={10}
                    labelComponent={<CustomTooltip 
                        cornerRadius={1}
                        pointerLength={3}
                        width={10}
                        height={9}
                        dx={-5}
                        dy={-8}
                        style={theme[2020].tooltip.normal}
                        flyoutStyle={theme[2020].flyout}
                        />
                    }
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