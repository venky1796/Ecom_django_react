import React,{ useState } from 'react'
import {Button, Row,Col,Form} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'



function SearchBox() {

    const [keyword , setKeyword] = useState('')
    let history = useHistory()
    

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword){
        history.push(`/?keyword=${keyword}`)
    }
    else {
        history.push(history.push(history.location.pathname))
    }
    }

    return (
<div>
       <Form onSubmit={submitHandler} >
         <Row>
           <Col>
           <Form.Control
                type='text'
                
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5 large rounded'
            ></Form.Control>
           
           </Col> 
           <Col>
            <Button
                type='submit'
                variant='outline-success'
                className='p-2 rounded'
            >
                submit
            </Button>

           
           </Col> 
             </Row>   

                   </Form>
</div>

    )
}

export default SearchBox
