var QuestArr = [];
var avail = [];
var choice = [];

var random = function( length ) {
	return Math.floor( Math.random() * length ); 
}

var init = function( length , max ) {
	for( var i = 0; i < length; i ++ ) {
		avail.push( true );
		choice.push( 0 );
	}
	for( var i = 0; i < max; i ++ ) {
		var next = random( length );
		while ( !avail[next] ) next = random( length );
		QuestArr.push( next );
		avail[next] = false;
	}
}

var regen = function( length , max ) {
	for( var i = 0; i < length; i ++ ) {
		avail[i] = true;
		choice[i] = 0;
	}
	for( var i = 0; i < max; i ++ ) {
		var next = random( length );
		while ( !avail[next] ) next = random( length );
		QuestArr[i] = next;
		avail[next] = false;
	}
}

app.controller( 'QuestLibrary' , function( $scope , $firebaseArray ) {
	
	// initiate value
	$scope.publish = true;
	$scope.editDB = true;
	$scope.loaded = false;
	$scope.index = 0;
	$scope.list = [];
	$scope.score = 0;
	
	$scope.takeTest = function() {
		$scope.editDB = false;
	}
	
	// user control
	$scope.name = "";
	$scope.userIndex = 0;
	$scope.loged = ref.getAuth();
	$scope.loaded = false;
	var link = new Firebase("https://se15.firebaseio.com/users");
	var userList = $firebaseArray( link );
	$scope.getUser = function( authData ) {
		if ( !authData ) return $scope.userDef;
		for( var i = 0; i < userList.length; i ++ ) 
		if ( userList[i].uid == authData.uid ) {
			$scope.name = userList[i].name;
			return i;
		}
	}
	userList.$loaded(
		function( data ) {
			$scope.userIndex = $scope.getUser( $scope.loged );
			$scope.loaded = true;
		},
		function(error) {
			console.error("Error:", error);
		}
	);

	// synchronize data from server
	var math = new Firebase("https://se15.firebaseio.com/math");
	var bank = $firebaseArray( math );  
	bank.$loaded(
		function( data ) {
			$scope.loaded = true;
			$scope.max = Math.min( 10 , data.length );
			init( data.length , $scope.max );
			$scope.currentQuestion = data[ QuestArr[0] ];
			$scope.list = data;
		},
		function(error) {
			console.error("Error:", error);
		}
	);
	
	/* select answer */
	$scope.selected = -1;
    $scope.select = function( index ) {
		$scope.selected = index; 
    };
	
	/* Test */
	$scope.submitQuestion = function() {
		/* increase point after a good answer */
		if ( $scope.selected == $scope.currentQuestion.right ) $scope.score += 10;
		choice[ QuestArr[$scope.index] ] = $scope.selected;
		
		/* next question */
		if ( $scope.index <= $scope.max - 1 ) $scope.index ++; 
		$scope.currentQuestion = bank[ QuestArr[$scope.index] ];
		
		$scope.selected = -1; /* reset answer */
		if ( $scope.index == $scope.max ) return $scope.submitTest(); /* if user submit the last question, return all answer and score */
	}
	
	/* publish score and question */
	$scope.submitTest = function() {
		$scope.publish = false;
		userList.$loaded(
			function( data ) {
				userList[$scope.userIndex].score += $scope.score;
				userList.$save( $scope.userIndex ).then( function() {
					console.log( "Save user's score successfully!")
				});
				$scope.score = 0;
			},
			function(error) {
				console.error("Error:", error);
			}
		);	
	}
	
	/* class for selected answer and right answer */
	$scope.getSel = function( index ) {
		return choice[index];
	}
	$scope.getRight = function( index ) {
		return bank[index].right;
	}
	$scope.good = function( index ) {
		return ( $scope.getSel( index ) == index && $scope.getRight( index ) == index );
	}
	
	/* Return mathQuiz index */
	$scope.ReturnQuiz = function() {
		$scope.publish = true;
		$scope.editDB = true;
		$scope.index = 0;
		$scope.score = 0;
		regen( bank.length , $scope.max );
		$scope.currentQuestion = bank[ QuestArr[0] ];
	}
});