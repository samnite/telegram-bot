if (process.env.NODE_ENV !== "production") require("dotenv").config({ path: "..\\.env" });

// Split user command and user request
const parseReq = (req) => {
	const text = req.split(" ");
	if (text.length === 1) {
		return text; // string[]
	}
	text.shift();
	return text.join(" "); // string
};

const isAdmin = (id) => {
	return id === +process.env.ADMIN_ID;
};

function amountFormat(number, separator = " ") {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

module.exports = { parseReq, isAdmin, amountFormat };
