import React from 'react'

const CreateCategoryForm = ({value, handleSubmit,setValue}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>

                <input type="text" className="form-control" placeholder='Enter a New Category' 
                value={value} onChange={(e)=>setValue(e.target.value)} />
            <button type='submit' className='btn btn-primary'>Submit</button>
            </div>

            </form>
        </>
    )
}

export default CreateCategoryForm