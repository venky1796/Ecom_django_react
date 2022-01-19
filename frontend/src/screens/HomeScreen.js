import React , {  useEffect} from 'react'
import {  Row ,Col  } from 'react-bootstrap'
import Product from '../components/Product'
import { useDispatch , useSelector } from 'react-redux'


import { ListProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'

function HomeScreen({history}) {

    const dispatch = useDispatch()

    const productList = useSelector( state => state.productList )

    const {error ,loading , products} = productList
   let keyword = history.location.search

    useEffect(() => {
        dispatch(ListProducts(keyword))
         
    },[dispatch,keyword])

   

    return (
        <div>
           {!keyword && <ProductCarousel />}
            <h1> Latest Products </h1>

            { loading ? <Loader/>
              : error ? <Message variant="danger">{error}</Message>
            :     (<Row>
                { 
                    products.map( product => (

                        <Col key={product._id} sm={12} md={6} lg={4} xl={3} > <Product  product= {product} />
                        </Col>
                    )
                    )
                }
            </Row>)                          }
            
        </div>
    )
}

export default HomeScreen
