import BigNumber from "bignumber.js";
import { approve, getAllowance } from ".";

export const getProductsQuantity = async (marketplaceContract) => {
	try {
		// return how many products are in the marketplace
		return Number(await marketplaceContract.methods.getProductsLength().call());
	} catch (error) {
		console.log(error);
	}
};

export const getProduct = async (marketplaceContract, index) => {
	try {
		// fetch the product at the given index
		const p =
			await marketplaceContract.methods.readProduct(index).call();

		// return the product
		return {
			index: index,
			owner: p[0],
			name: p[1],
			image: p[2],
			description: p[3],
			location: p[4],
			price: new BigNumber(p[5]),
			sold: p[6],
		};
	} catch (error) {
		console.log(error);
	}
};

export const getProducts = async (marketplaceContract) => {
	try {
		// return all the products in the marketplace
		const productsQuantity = await getProductsQuantity(marketplaceContract);
		const products = [];

		for (let i = 0; i < productsQuantity; i++) {
			products.push(await getProduct(marketplaceContract, i));
		}

		return products;
	} catch (error) {
		console.log(error);
	}
};

export const addProduct = async (marketplaceContract, performActions, product) => {
	try {
		await performActions(async (kit) => {
			const { defaultAccount } = kit;

			// add a new product to the marketplace
			await marketplaceContract.methods.writeProduct(
				product.name,
				product.image,
				product.description,
				product.location,
				product.price
			).send({ from: defaultAccount });
		});
	} catch (error) {
		throw new Error(`⚠️ ${error}`);
	}
};

export const buyProduct = async (marketplaceContract, performActions, index, price) => {
	try {
		// define function to send token spending approval
		const sendApprove = async (kit) => {
			// Check if the allowance needs to be updated
			const allowance = new BigNumber(await getAllowance(kit));

			if (price.isGreaterThan(allowance)) {
				// approve the marketplace to spend the tokens
				await approve(kit, `0x${price.toString(16)}`);
			}
		};

		// define function to send "buyProduct" transaction
		const sendBuyProduct = async (kit) => {
			const { defaultAccount } = kit;

			// add a new product to the marketplace
			await marketplaceContract.methods.buyProduct(index).send({ from: defaultAccount });
		};

		await performActions(sendApprove, sendBuyProduct);
	} catch (error) {
		throw new Error(`⚠️ ${error}`);
	}
};
