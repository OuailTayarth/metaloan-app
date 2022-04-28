import React from "react";

const CreatePlan = ({createPlan}) => {
    return (
        <div>
            <button onClick={(e)=> {
                e.preventDefault();
                createPlan();
            }}>
                Create Plan
             </button>
        </div>
    )
}


export default CreatePlan;