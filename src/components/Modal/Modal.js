import React from 'react'; 
import "./Modal.css";


const Modal = () => {
    return (
        <div className='mainbackground'>
        <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
        </div>
        <div className="title">
          <h1>Make sure that your wallet is connected to</h1>
          <h1>the Polygon network</h1>
        </div>
        <div className="footer">
          <button
            className='btn'>
            Got it!
          </button>
        </div>
      </div>
    </div>
    </div>
    )
}

export default Modal;