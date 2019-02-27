import React from 'react';


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

const FilmPoster = (props) => {
    return(
        <div className="poster-container">
            <div className="poster">
                <img 
                    className="image"
                    alt={props.name}
                    src={props.src}
                    // style={{width: props.width, height: props.height}}
                />
                <a className="frame" href={props.href} target="_blank" rel="noopener noreferrer">
                    <span className="overlay"></span>
                </a>
            </div>
            <p class="poster-viewingdata">
                <span itemscope="" itemtype="http://schema.org/Rating" class={'rating rated-' + props.rating}> {getStarRating(Number.parseFloat(props.rating))}
                    <meta itemprop="ratingValue" content={props.rating}/><meta itemprop="worstRating" content="1"/><meta itemprop="bestRating" content="10"/>
                </span>
            </p>
        </div>
    )
}

export default FilmPoster;