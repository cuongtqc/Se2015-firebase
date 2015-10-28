app.controller( 'UpdateTravel' , function( $scope , $firebaseArray , $firebaseObject ) {
	// initiate value
	$scope.editDB = true;
	$scope.loaded = false;
	$scope.addTab = false;
	$scope.editTab = false;
	$scope.returnEdit = function() {
		$scope.editDB = true;
		$scope.addTab = false;
		$scope.editTab = false;
	}

	// synchronize data from server
	var travel = new Firebase("https://se15.firebaseio.com/football");
	var bank = $firebaseArray( travel );  
	bank.$loaded (
		function( data ) {
			$scope.list = data;
			$scope.temp = data;
			$scope.loaded = true;
		},
		function(error) {
			console.error("Error:", error);
		}
	);
	
	// add Question tab
	$scope.addQuestionTab = function() {
		$scope.editDB = false;
		$scope.addTab = true;
		$scope.editTab = false;
	}
	$scope.q = {
		data: "",
		answer: ["" , "" , "" , ""],
		right: 0
	}
	var resetQues = function() {
		$scope.q.data = "";
		$scope.q.right = 0;
		for( var i = 0; i < 4; i ++ ) $scope.q.answer[i] = "";
	}
	$scope.clearQuestion = function() {
		resetQues();
	}
	$scope.submitQuestion = function() {
		var flag = false;
		for( var i = 0; i < 4; i ++ ) flag = flag || ( $scope.q.answer[i] == "" );
		if ( $scope.q.data == "" || flag || $scope.q.right < 1 || $scope.q.right > 4 ) 
			alert( "Can not add question!");
		else {
			$scope.right --;
			bank.$add( $scope.q );
			resetQues();
			$scope.returnEdit();
		}
	}
	
	// delete Question tab
	$scope.deleteQuestionTab = function() {
		$scope.editDB = false;
		$scope.addTab = false;
		$scope.editTab = true;
	}
	$scope.deleteQuiz = function( index ) {
		var r = confirm("You want to delete question " + index + "?" );
		if ( r ) {
			var list = [];
			travel.on('value', function(snap) { list = snap.val(); });
			list.splice(index, 1);
			travel.set(list);
		};
	}
});