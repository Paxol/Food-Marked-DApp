import React from 'react'
import { formatBigNumber } from '../utils'


import { Identicon } from './ui/Identicon'

export const Product = ({ owner, name, image, description, location, price, sold, index, handleBuy }) => {
	return (
		<div className="card mb-4">
			<img className="card-img-top" src={image} alt="Product" />
			<div className="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
				{sold} Sold
			</div>
			<div className="card-body text-left p-4 position-relative">
				<div className="translate-middle-y position-absolute top-0">
					<Identicon address={owner} />
				</div>
				<h2 className="card-title fs-4 fw-bold mt-2">{name}</h2>
				<p className="card-text mb-4" style={{ minHeight: "82px" }}>
					{description}
				</p>
				<p className="card-text mt-4">
					<i className="bi bi-geo-alt-fill"></i>
					<span>{location}</span>
				</p>
				<div className="d-grid gap-2">
					<span className="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id={`n${index}`} onClick={() => handleBuy(index)}>
						{/* TODO: Use custom token */}
						{/* TODO: Use custom token decimals */}
						Buy for {formatBigNumber(price, 18)} cUSD
					</span>
				</div>
			</div>
		</div>
	)
}
