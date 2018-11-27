
//Budget Controller
const budgetController = (function() {

    const Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	const Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem: function(type, des, val){
			let newItem, ID;
			//create new id
			if(data.allItems[type].length > 0){
			ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			//create new item based on inc or exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}
			//push it into our data state
			data.allItems[type].push(newItem);
			//retuen the newly created element
			return newItem;
		}
	};

})();

// UI Controller
const UIController = (function() {

	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
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

	const setupEventListeners = function(){
		const DOM = UICtrl.getDOMstrings();
		//input event listener
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		// Submit input on Enter keypress
		document.addEventListener('keypress', function(event) {
			if(event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	const ctrlAddItem = function(){
		let input, newItem;
		//1. Get the field input data
		let input = UICtrl.getInput();
		//2. Add item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		//3. Add the new item to the ui controller

		//4. Calculate the budget

		//5. display the budget on the ui

	};

	return {
		init: function() {
			console.log("App Ready");
			setupEventListeners();
		}
	};

})(budgetController, UIController);


controller.init();
