import React from 'react';

const FilmPoster = (props) => {
    return(
        <div className="poster">
            <img 
                className="image"
                alt={props.name}
                src={props.src}
                // style={{width: props.width, height: props.height}}
            />
            {/* <div className="attribution-block"></div>
            <a className="frame">LOL</a> */}
        </div>
    )
}

export default FilmPoster;