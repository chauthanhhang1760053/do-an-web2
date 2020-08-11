module.exports.exchange_currency = function(value, currencyType_from, currencyType_to) {
	if (!value || !currencyType_from || !currencyType_to) return 0;
	if (currencyType_from == currencyType_to) return value;
	if (currencyType_from === 'VND' && currencyType_to === 'USD') {
		var newValue = parseFloat(value);
		newValue = newValue * (1 / 23000);

		return newValue;
	} else if (currencyType_from === 'USD' && currencyType_to === 'VND') {
		var newValue = parseFloat(value);
		newValue = newValue * 23000;

		return newValue;
	}  
	return value;
};
