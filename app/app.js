angular.module('firstApp', [])

.controller('mainController', function(){
	var vm = this; // View - model

	vm.message = 'Hey there!'

	//list of items

	vm.users = [
	{ name : ' Old Garry', sex : 'male ', IQ : '83' },
	{ name : ' Julie', sex : 'female ', IQ : '60' },
	{ name : ' De Joseph', sex : 'male ', IQ : '123' },

	];

	// Informatjon that comes from out form

	vm.userData = {};

	vm.addUser = function() {
		//Add a User to the list 

		vm.users.push({
			name : vm.userData.name,
			sex : vm.userData.sex,
			IQ : vm.userData.IQ
		});

		//adter oir computer has been added clear the form
		vm.userData = {};
	}
});