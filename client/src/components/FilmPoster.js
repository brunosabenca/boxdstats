import React from 'react';
import ReactTooltip from 'react-tooltip'

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
            <div className="poster" data-tip={`${props.name} (${props.year})`}>
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
            <p className="poster-viewingdata">
                <span itemScope="" itemType="http://schema.org/Rating" className={'rating rated-' + props.rating}> {getStarRating(Number.parseFloat(props.rating))}
                    <meta itemProp="ratingValue" content={props.rating}/><meta itemProp="worstRating" content="1"/><meta itemProp="bestRating" content="10"/>
                </span>
            </p>
            <ReactTooltip place="top" effect="solid" type="light"/>
        </div>
    )
}

export default FilmPoster;