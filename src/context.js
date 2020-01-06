import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data'

const ProductContext = React.createContext()

class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct: detailProduct,
        modalOpen: false,
        modalProduct: detailProduct,
        cart: [],
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0
    }

    componentDidMount() {
        this.setProducts()
    }

    setProducts = () => {
        let products = []

        storeProducts.map(item => {
            const singleItem = { ...item }
            return products = [...products, singleItem]
        })

        this.setState({ products })
    }

    getByItemId = id => {
        const productId = this.state.products.find(p => p.id === id)
        return productId
    }

    handleDetail = id => {
        const detailProduct = this.getByItemId(id)
        this.setState({ detailProduct })
    }

    addToCart = id => {
        let tempProducts = [...this.state.products]
        const index = tempProducts.indexOf(this.getByItemId(id))
        const product = tempProducts[index]
        product.inCart = true
        product.count = 1
        const price = product.price
        product.total = price

        this.setState(() => {
            return {
                products: tempProducts,
                cart: [...this.state.cart, product]
            }
        }, () => {
            this.addTotals()
        })
    }

    openModal = id => {
        const product = this.getByItemId(id)
        this.setState({ modalProduct: product, modalOpen: true })
    }

    closeModal = () => {
        this.setState({ modalOpen: false })
    }

    increment = id => {
        let tempCart = [...this.state.cart]
        const selectProduct = tempCart.find(item => item.id === id)

        const index = tempCart.indexOf(selectProduct)
        const product = tempCart[index]
        product.count = product.count + 1
        product.total = product.count * product.price

        this.setState(() => {
            return { cart: [...tempCart] }
        }, () => {
            this.addTotals()
        })

    }

    decrement = id => {
        let tempCart = [...this.state.cart]
        const selectProduct = tempCart.find(item => item.id === id)

        const index = tempCart.indexOf(selectProduct)
        const product = tempCart[index]
        product.count = product.count - 1

        if (product.count === 0) this.removeItem(id)
        else {
            product.total = product.count * product.price

            this.setState(() => {
                return { cart: [...tempCart] }
            }, () => {
                this.addTotals()
            })
        }
    }

    removeItem = id => {
        let tempProducts = [...this.state.products]
        let tempCart = [...this.state.cart]

        tempCart = tempCart.filter(cart => cart.id !== id)

        const index = tempProducts.indexOf(this.getByItemId(id))
        let removeProduct = tempProducts[index]
        removeProduct.inCart = false
        removeProduct.count = 0
        removeProduct.total = 0

        this.setState({
            cart: [...tempCart],
            products: [...tempProducts]
        }, () => {
            this.addTotals()
        })
    }

    clearCart = () => {
        this.setState(() => {
            return { cart: [] }
        }, () => {
            this.setProducts()
            this.addTotals()
        })
    }

    addTotals = () => {
        let subTotal = 0
        this.state.cart.map(c => subTotal += c.total)
        const tempTax = subTotal * 0.1
        const tax = parseFloat(tempTax.toFixed(2))
        const total = subTotal + tax

        this.setState({
            cartSubTotal: subTotal,
            cartTax: tax,
            cartTotal: total
        })
    }

    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart,
            }}>
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer

export { ProductProvider, ProductConsumer }

