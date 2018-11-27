import React from "react";
import Footer from './Footer';
import './Section.css'

// Left Section Component

function Section(props) {

	return (
		<div className="Section">
			<div className="Header-Section"></div>
			<h1> City Bikes in Miami</h1>
			<p>Find the nearest City Bikes station and check the availability of the Bicycles.</p>
			<Footer />
        </div>
	)

}

export default Section;

