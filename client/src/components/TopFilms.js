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
        function getStarRating(rating) {
            var stars = '';

            if (rating < 0 || rating > 5) {
                return stars;
            }

            for (var i = 0; i < Math.floor(rating); i++) {
                // stars += '⭐';
                stars += '★';
            }

            if (rating % 1 !== 0) {
                stars += '½';
            }

            return stars;
        }

        var filmPosters = this.state.data.map(function(film, index){
            return <Col xs={12} sm={6} md={4} xl={2} key={index}>
                <FilmPoster
                    name={film.name}
                    src={film.poster.url}
                    height={film.poster.height}
                    width={film.poster.width}
                    className="poster"
                />
                <p class="poster-viewingdata">
                    <span itemscope="" itemtype="http://schema.org/Rating" class={'rating rated-' + film.rating}> {getStarRating(Number.parseFloat(film.rating))}
                        <meta itemprop="ratingValue" content={film.rating}/><meta itemprop="worstRating" content="1"/><meta itemprop="bestRating" content="10"/>
                    </span>
                </p>
            </Col>
        });

        return (
            this.state.isFetching === false ? 
            <Row className="poster-container">
                { filmPosters.length !== 0 ? filmPosters : <span>No film ratings found.</span>}
            </Row>
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