import React from 'react'

const SingleClient = ({src, text, infoTitle, infoJob}) => {
    return (
        <article className="person">
        <div className="person-img">
            <img src={src} alt={infoTitle}/>    
        </div>

        <p className="text">{text}</p>
        
        <div  className="info">
            <h1>{infoTitle}</h1>
            <h5> {infoJob}</h5>
        </div>
    </article> 
       
    )
}

export default SingleClient


{/* <article className="person">
                    <div className="person-img">
                        <img src="./images/image-thomas.jpg" alt="thomas"/>    
                    </div>

                    <p className="text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni velit corporis incidunt enim delectus quibusdam beatae voluptas sunt exercitationem, mollitia dolores possimus a tempora, quas fugit optio tenetur doloribus inventore?</p>
                    
                    <div  className="info">
                        <h1> Thomas S.</h1>
                        <h5> Chief Operating Officer</h5>
                    </div>
                    
                </article> */}