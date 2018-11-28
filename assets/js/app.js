
//Budget Controller
const budgetController = (function() {

    const Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
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

		calculatePercentages: function(){
			data.allItems.exp.forEach(function(current) {
				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			let allPercentages = data.allItems.exp.map(function(current) {
				return current.getPercentage();
			});
			return allPercentages;
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
		container: '.container',
		expensesPercLabel: '.item__percentage'
	};

	const formatNumber = function(num, type) {
		let numSplit, int, dec;	
		//2 decimal points
		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
		int = numSplit[0];
		//comma separation
		if(int.length > 3){
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}
		dec = numSplit[1];
		//+ or -
		if(type === 'exp'){
			sign = '-'
		} else {
			sign = '+'
		}
		return sign + ' ' + int + '.' + dec;
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
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
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
			let type;

			if(obj.budget > 0) {
				type = 'inc';
			} else {
				type = 'exp';
			}

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
			
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages){
			let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
			const nodeListForEach = function(list, callback) {
				for(let i in list) {
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(current, index) {
				
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
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

	const updatePercentages = function(){
		// Calculate percentages
		budgetCtrl.calculatePercentages();
		//Read them from the budget controller
		let percentages = budgetCtrl.getPercentages();
		//update the UI with new percentages
		UICtrl.displayPercentages(percentages);
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
			//6. Calc and update %'s
			updatePercentages();
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
			//Calc and update %'s
			updatePercentages();
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
