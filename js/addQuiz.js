app.controller( 'QuestLibrary' , function( $scope , list ) {
	
	$scope.publish = false;
	$scope.editDB = true;
	$scope.add = false;

	/* Edit and Add question */
	$scope.takeTest = function() {
		$scope.editDB = false;
		$scope.publish = true;
		$scope.add = false;
	}
	$scope.questionData = "";
	$scope.answer1 = "";
	$scope.answer2 = "";
	$scope.answer3 = "";
	$scope.answer4 = "";
	$scope.rightAnswer = 0;
	$scope.addQuestion = function() {
		$scope.editDB = false;
		$scope.add = true;
		$scope.publish = false;
	};
	$scope.submitQues = function() {
		/* add question to server */ 
		
		$scope.publish = false;
		$scope.editDB = true;
		$scope.add = false;
	};
	
	/* question database and score*/
	$scope.names = list.get();
	$scope.score = 0;
	
	/* select answer */
	$scope.selected = -1;
    $scope.select = function( index ) {
		$scope.selected = index; 
    };
	
	/* generate random question */
	$scope.QuestArr = new Array();
	$scope.max = list.getMax();
	$scope.index = 0;
	
	/* select random 10 questions in the bank */
	var avail = new Array();
	var choice = new Array();
	
	for( var i = 0; i < $scope.names.length; i ++ ) {
		avail.push( true );
		choice.push( 0 );
	}
	$scope.random = function() {
		return Math.floor( Math.random() * $scope.names.length ); 
	}
	for( var i = 0; i < $scope.max; i ++ ) {
		var next = $scope.random();
		while ( !avail[next] ) next = $scope.random();
		$scope.QuestArr.push( next );
		avail[next] = false;
	}
	
	/* Test */
	$scope.currentQuestion = $scope.names[ $scope.QuestArr[0] ];
	$scope.submitQuestion = function() {
		/* increase point after a good answer */
		if ( $scope.selected == $scope.currentQuestion.right ) $scope.score += 10;
		choice[ $scope.QuestArr[$scope.index] ] = $scope.selected;
		
		/* next question */
		if ( $scope.index <= $scope.max - 1 ) $scope.index ++; 
		$scope.currentQuestion = $scope.names[ $scope.QuestArr[$scope.index] ];
		
		$scope.selected = -1; /* reset answer */
		if ( $scope.index == $scope.max ) return $scope.submitTest(); /* if user submit the last question, return all answer and score */
	}
	
	/* publish score and question */
	$scope.submitTest = function() {
		$scope.publish = false;
	}
	
	/* class for selected answer and right answer */
	$scope.getSel = function( index ) {
		return choice[index];
	}
	$scope.getRight = function( index ) {
		return $scope.names[index].right;
	}
	$scope.good = function( index ) {
		return ( $scope.getSel( index ) == index && $scope.getRight( index ) == index );
	}
	
	/* Return mathQuiz index */
	$scope.ReturnQuiz = function() {
		$scope.publish = false;
		$scope.editDB = true;
		$scope.add = false;
		$scope.index = 0;
		$scope.selected = -1;
		$scope.currentQuestion = $scope.names[ $scope.QuestArr[0] ];
		for( var i = 0; i < $scope.names.length; i ++ ) {
			avail[i] = true;
			choice[i] = 0;
		}
		for( var i = 0; i < $scope.max; i ++ ) {
			var next = $scope.random();
			while ( !avail[next] ) next = $scope.random();
			$scope.QuestArr[i] = next;
			avail[next] = false;
		}
	}
});