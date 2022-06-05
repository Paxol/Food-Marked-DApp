import React, { useState, useCallback, useEffect } from "react"
import { Button, Modal, Form } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";

import { useLoadingContext } from "../context/LoadingContext";
import { useNotificationsContext } from "../context/NotificationsContext";

import { useMarketplaceContract } from "../hooks";

import { Product } from "./Product";
import { addProduct, buyProduct, getProduct, getProducts } from "../utils/marketplace";
import { getAllowance, numberToBigNumber } from "../utils";
import { useBalanceContext } from "../context/BalanceContext";

export const MainPage = () => {
    const { kit, performActions } = useContractKit();
    const marketplaceContract = useMarketplaceContract();

    const [modalOpen, setModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState();

    const [, incLoading, decLoading] = useLoadingContext();
    const [, insertNotification] = useNotificationsContext();
    const [, refreshBalance] = useBalanceContext();

    useEffect(() => {
        if (!marketplaceContract) return;
        if (loading) return;
        if (products) return;

        if (incLoading && decLoading) {
            setLoading(true);
            incLoading();
            getProducts(marketplaceContract).then(products => {
                setProducts(products);
                setLoading(false);
                decLoading();
            });
        }
    }, [marketplaceContract, loading, setLoading, incLoading, decLoading, products]);

    const handleAddProduct = useCallback((product) => {
        if (!marketplaceContract) return;

        if (incLoading && decLoading) {
            incLoading();
            addProduct(marketplaceContract, performActions, product).then(() => {
                insertNotification({
                    status: "success",
                    text: `${product.name} added to marketplace`
                });
                setProducts(undefined);
            }).catch((error) => {
                insertNotification({
                    status: "error",
                    text: error.message
                });
            }).finally(() => {
                decLoading();
            });
        }
    }, [marketplaceContract, performActions, incLoading, decLoading, insertNotification]);

    window.handleAddProduct = handleAddProduct;
    window.getAllowance = () => getAllowance(kit);


    const handleBuyProduct = useCallback((index) => {
        if (!marketplaceContract) return;

        if (incLoading && decLoading) {
            incLoading();
            buyProduct(marketplaceContract, performActions, index, products[index].price).then(() => {
                insertNotification({
                    status: "success",
                    text: `🎉 You successfully bought "${products[index].name}".`
                });

                // Refresh balance
                refreshBalance();

                // refresh current product
                getProduct(marketplaceContract, index).then(updated => {
                    setProducts(prev => prev.map((product, i) => {
                        if (i === index) {
                            return updated;
                        }
                        return product;
                    }));
                }).catch(() => setProducts());
            }).catch((error) => {
                insertNotification({
                    status: "error",
                    text: error.message
                });
            }).finally(() => {
                decLoading();
            });
        }
    }, [marketplaceContract, performActions, refreshBalance, products, incLoading, decLoading, insertNotification]);

    return (
        <>
            <div className="d-flex justify-content-end my-4">
                <Button variant="dark" className="rounded-pill" onClick={() => {
                    setModalOpen(true)
                }}>Add product</Button>
            </div>

            <main className="row">
                {products && products.map(product =>
                    <div key={product.index} className="col-sm-6 col-md-4">
                        <Product {...product} handleBuy={handleBuyProduct} />
                    </div>
                )}
            </main>

            {
                modalOpen && <AddProductModal isOpen={modalOpen}
                    close={setModalOpen}
                    onProductAdded={handleAddProduct} />
            }
        </>
    );
};

const AddProductModal = ({ isOpen, close, onProductAdded }) => {
    const [product, setProduct] = useState({
        name: "aaa",
        image: "bbb",
        description: "ccc",
        location: "ddd",
        price: 123,
        sold: 0,
    });

    const handleChange = useCallback(
        ({ target }) => {
            setProduct(prev => ({
                ...prev,

                // If the target is price, convert to number
                [target.name]: target.name === "price" ? numberToBigNumber(target.value) : target.value,
            }));
        }, [setProduct],
    )

    return <Modal show={isOpen} onHide={() => close()}>
        <Modal.Header closeButton>
            <Modal.Title>New product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="productName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} placeholder="Name of the product" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="productImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="text" name="image" onChange={handleChange} placeholder="Image url of the product" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="productDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" onChange={handleChange} placeholder="Description of the product" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="productLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" onChange={handleChange} placeholder="Location of the product" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="productPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" step=".01" name="price" onChange={handleChange} placeholder="Price of the product" />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => close()}>
                Close
            </Button>
            <Button variant="dark" onClick={() => {
                close();
                onProductAdded(product);
            }}>
                Add product
            </Button>
        </Modal.Footer>
    </Modal>;
}

