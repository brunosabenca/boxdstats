import React, { Component } from "react";
import { VictoryChart, VictoryTheme, VictoryBar } from "victory";

class MonthlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            isFetching: false,
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
        const response = await fetch(`/api/v1/user/${this.props.userId}/log-entries/2018/monthly-counts`);
        const data = await response.json();
        console.log(data);
        const arr = Object.keys(data).map((key, index) => ({"x": parseInt(key), "y": data[key], "label": this.state.months[index]}));
        this.setState({data: arr, isFetching: false});
        console.log(this.state);
      } catch(e) {
        this.setState({isFetching: false});
        console.log(e);
      }
    }


    render() {
        return (
            this.state.isFetching ===  false ? <VictoryBar
                theme={VictoryTheme.material}
                alignment="start"
                data={this.state.data}
                height={200}
            /> 
            : 'Fetching...'
        )
    }
}

export default MonthlyChart;