import React, { Component } from "react";
import FilmPoster from './FilmPoster';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BarLoader } from 'react-spinners';

class MonthlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [ 
                {
                    name: '',
                    link: '',
                    rewatch: '',
                    rating: '',
                    like: '',
                    poster: {
                        width: 0,
                        height: 0,
                        url: ''
                    }
                }
            ],
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
        const response = await fetch(`/api/v1/user/${this.props.userId}/log-entries/top5/${this.props.year}`);
        const data = await response.json();
        this.setState({data: data, isFetching: false});
      } catch(e) {
        this.setState({isFetching: false});
      }
    }

    render() {
        var filmPosters = this.state.data.map(function(film, index){
            return <FilmPoster
                name={film.name}
                src={film.poster.url}
                height={film.poster.height}
                width={film.poster.width}
                rating={film.rating}
                href={film.link}
                className="poster"
            />
        });

        return (
            this.state.isFetching === false ? 
            <div className="poster-list">
                { filmPosters.length !== 0 ? filmPosters : <span>No film ratings found.</span>}
            </div>
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