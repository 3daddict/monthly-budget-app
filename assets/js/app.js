
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

	const calculateTotal = function(type){
		let sum = 0;

		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});

		data.totals[type] = sum;
	};

	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	}

	return {
		addItem: function(type, des, val){
			let newItem, ID;
			//create new id
			if (data.allItems[type].length > 0) {
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
		},

		deleteItem: function(type, id){
			let ids, index;
			
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			//find index
			index = ids.indexOf(id);
			//delete item from array
			if(index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){
			//Calculate total income and expenses
			calculateTotal('exp'); //run expenses total calc
			calculateTotal('inc'); //run income total calc
			//Calculate the budge: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//Calculate the percentage of income that we spent
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		}
	};

})();

// UI Controller
const UIController = (function() {

	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
	};

    return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc (+) or exp (-)
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem: function(obj, type) {
			let html, newHtml;
			//Create html string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = `<div class="item clearfix" id="inc-%id%">
						<div class="item__description">%description%</div>
						<div class="right clearfix">
							<div class="item__value">%value%</div>
							<div class="item__delete">
								<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
							</div>
						</div>
					</div>`
			} else if(type === 'exp') {
				element = DOMstrings.expenseContainer;

				html = `<div class="item clearfix" id="exp-%id%">
						<div class="item__description">%description%</div>
						<div class="right clearfix">
							<div class="item__value">%value%</div>
							<div class="item__percentage">21%</div>
							<div class="item__delete">
								<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
							</div>
						</div>
					</div>`
			}

			//Replace the placeholder text with user data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			let el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		clearFields: function() {
			let fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current, index, array) {
				current.value = '';
			});
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
			
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

	};

	const updateBudget = function(){
		//1. Calculate the budget
		budgetCtrl.calculateBudget();
		//2. Return the budget
		let budget = budgetCtrl.getBudget();
		//3. display the budget on the ui
		UICtrl.displayBudget(budget);
	}

	const ctrlAddItem = function(){
		let input, newItem;
		//1. Get the field input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. Add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			//3. Add the new item to the ui controller
			UICtrl.addListItem(newItem, input.type);
			//4. Clear the fields and set focus back
			UICtrl.clearFields();
			//5. Calculate and Update budget
			updateBudget();
		} 
		
	};

	const ctrlDeleteItem = function(event) {
		let itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
			//Deleted the item from the UI
			UICtrl.deleteListItem(itemID);
			//Update and show the new budget
			updateBudget();
		}
	};

	return {
		init: function() {
			console.log("App Ready");
			UICtrl.displayBudget({
					budget: 0,
					totalInc: 0,
					totalExp: 0,
					percentage: -1
				});
			setupEventListeners();
		}
	};

})(budgetController, UIController);


controller.init();
