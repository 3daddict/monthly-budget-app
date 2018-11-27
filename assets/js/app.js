
//Budget Controller
const budgetController = (function() {

    //code

})();

// UI Controller
const UIController = (function() {

	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn'
	}

    return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc (+) or exp (-)
				desctiption: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			}
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();

// Main App Controller
const controller = (function(budgetCtrl, UICtrl) {

	const DOM = UICtrl.getDOMstrings();

	const ctrlAddItem = function(){
		//1. Get the field input data
		let input = UICtrl.getInput();
		console.log(input);
		//2. Add item to the budget controller

		//3. Add the new item to the ui controller

		//4. Calculate the budget

		//5. display the budget on the ui

	}

	//input event listener
	document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keycode === 13 || event.which === 13) {
			ctrlAddItem();
		}


	});

})(budgetController, UIController);

