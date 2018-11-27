
//Budget Controller
const budgetController = (function() {

    //code

})();

// UI Controller
const UIController = (function() {

    return {
		getInput: function(){
			return {
				type: document.querySelector('.add__type').value, //will be either inc (+) or exp (-)
				desctiption: document.querySelector('.add__description').value,
				value: document.querySelector('.add__value').value
			}
		}
	};

})();

// Main App Controller
const controller = (function(budgetCtrl, UICtrl) {

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
	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keycode === 13 || event.which === 13) {
			ctrlAddItem();
		}


	});

})(budgetController, UIController);

