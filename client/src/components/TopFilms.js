import React, { Component } from "react";
import FilmPoster from './FilmPoster';
import { BarLoader } from 'react-spinners';
import {makeCancelable} from '../makeCancelable'

class TopFilms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [ 
                {
                    name: '',
                    link: '',
                    rating: '',
                    like: '',
                    poster: {
                        width: 0,
                        height: 0,
                        url: ''
                    }
                }
            ],
            cancelable: [],
            isFetching: true,
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
            this.fetchData();
        }
    }

    componentWillUnmount() {
        if (this.state.cancelable) {
            this.state.cancelable.forEach((item) => item.cancel())
        }
    }

    async fetchData() {
        this.setState({isFetching: true});

        const promise = fetch(`/api/v1/user/${this.props.userId}/log-entries/top5/${this.props.year}`);
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        cancelable
        .promise
        .then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({data: data, isFetching: false});
        }).catch(({isCanceled, ...error}) => {
            this.setState({isFetching: false});
            if (isCanceled) {
                console.log('Fetching top films was cancelled.')
            }
        });
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
                key={film.link}
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

export default TopFilms;