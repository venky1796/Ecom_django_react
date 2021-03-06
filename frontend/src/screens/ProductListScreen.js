import React,{ useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {Form , Row ,Col , Button, Table } from 'react-bootstrap'
import {useDispatch , useSelector } from 'react-redux'
import { ListProducts ,deleteProduct ,createProduct} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
// import { PRODUCT_CREATE_RESET } from '../constants/productConstants'


function ProductListScreen({ history ,match }) {
    const dispatch = useDispatch()
    
    
    const productList = useSelector(state => state.productList)
    const {loading , error , products } = productList
    
    const productDelete = useSelector(state => state.productDelete)
    const {loading:loadingDelete , error:errorDelete , success:successDelete } = productDelete
    
    const productCreate = useSelector(state => state.productCreate)
    const {loading : loadingCreate , error:errorCreate ,success: successCreate,product:productCreated } = productCreate
    
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
   

    useEffect( () => {

        if(userInfo && userInfo.isAdmin){ 
            dispatch(ListProducts())
        }
        
        else{
            history.push('login/')
        }
    },[dispatch,history ,successDelete,userInfo])

    const deleteHandler = (id) => {

        if(window.confirm('Are you sure!! You want to delete this product !!!! ')){
           dispatch(deleteProduct(id))

        }

    }

    const createproductListHandler = ( product ) => {
        dispatch(createProduct())
    }
    return (
        <div>

        <Row className="align-items-center">
        <Col className="hello" >
            <h1> Products</h1>
        </Col>
        <Col className='text-right' >
        <Button className='my-3' onClick={createproductListHandler} >
        <i className='fas fa-plus'></i> Create Product

        </Button>
        </Col>
        </Row>
        <Row>
        {loadingDelete && <Loader/> }
        { errorDelete && <Message variant='danger' > {error}</Message>}

        {loadingCreate && <Loader/> }
        { errorCreate && <Message variant='danger' > {error}</Message>}
        {
            loading ? <Loader />
            : error ? <Message variant='danger' > {error}</Message>
            : (
                <Table striped hover bordered  responsive size="small" >
                     <thead>
                         <tr>
                         <th> ID </th>
                         <th> NAME </th>
                         <th> PRICE </th>
                         <th> CATEGORY </th>
                         <th> BRAND </th>
                         <th>  </th>
                         </tr>
                     </thead>

                     <tbody>
                        {
                            products.map( product => 
                                <tr key={product._id}>
                                     <td> {product._id}</td> 
                                     <td> {product.name}</td> 
                                     <td> {product.price}</td> 
                                     <td> {product.category}</td> 
                                     <td> {product.brand}</td> 
                                
                                     <td>
                                         <LinkContainer to={`/admin/product/${product._id}/edit`} >
                                            <Button varint='light' className='btn-sm' >
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                         </LinkContainer>
                                      <Button variant='danger' className='btn-sm' onClick={()=> deleteHandler(product._id)}  >
                                        <i className='fas fa-trash'></i>
                                      </Button>
                                     </td>
                                
                                     </tr>)
                        }

                     </tbody>
                </Table>
            )     }
            </Row>
        </div>
    )
}

export default ProductListScreen
