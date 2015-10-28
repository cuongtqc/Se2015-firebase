var QuestArr = [];
var avail = [];
var choice = [];
var QuizBank = [];

var random = function( length ) {
	return Math.floor( Math.random() * length ); 
}

/* init là để chuẩn bị thông tin ban đầu, regen là nếu người dùng muốn làm lại test. 
	Máy sẽ lấy hết tất cả các câu hỏi trên server và chạy thuật toán chọn random 10 câu 
	trong js. 
	Phần chọn 10 câu hỏi này có thể reuse code nhưng ko cần thiết */
	
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
	
	/* index: câu hỏi hiện tại trong 10 câu hỏi.
		score: điểm của bài test hiện tại
		list: 10 câu hỏi được chọn random từ bank
	*/
	$scope.index = 0;
	$scope.score = 0;
	$scope.list = [];
	
	$scope.takeTest = function() {
		$scope.editDB = false;
	}
	$scope.userDef = {
		uid: "",
		name: "",
		score: 0
	}
	
	// user control
	$scope.name = "";
	$scope.userIndex = -1;
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
		},
		function(error) {
			console.error("Error:", error);
		}
	);

	// synchronize data from server. load được câu hỏi thì mới được lựa chọn take test.
	var funny = new Firebase("https://se15.firebaseio.com/funny");
	var bank = $firebaseArray( funny );  
	bank.$loaded(
		function( data ) {
			$scope.loaded = true;
			init( data.length , Math.min( 10 , data.length ) );
			for( var i = 0; i < Math.min( 10 , data.length ); i ++ ) 
				$scope.list.push( data[QuestArr[i]] );
			$scope.currentQuestion = data[ QuestArr[0] ];
			QuizBank = data;
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
		if ( $scope.index <= $scope.list.length - 1 ) $scope.index ++; 
		$scope.currentQuestion = bank[ QuestArr[$scope.index] ];
		
		$scope.selected = -1; /* reset answer */
		if ( $scope.index == $scope.list.length ) return $scope.submitTest(); 
		/* if user submit the last question, return all answer and score */
	}
	
	/* publish score and question */
	$scope.submitTest = function() {
		$scope.publish = false;
		$scope.userIndex = $scope.getUser( ref.getAuth() );
		if ( $scope.userIndex >= 0 ) {
			userList[$scope.userIndex].score += $scope.score;
			userList.$save( $scope.userIndex ).then( function() {
				console.log( "Save user's score successfully!")
			});
			$scope.score = 0;
		}	
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
	
	/* Return funnyQuiz index */
	$scope.ReturnQuiz = function() {
		$scope.publish = true;
		$scope.editDB = true;
		$scope.index = 0;
		$scope.score = 0;
		regen( bank.length , $scope.list.length );
		for( var i = 0; i < $scope.list.length; i ++ ) 
			$scope.list[i] = QuizBank[QuestArr[i]];
		$scope.currentQuestion = QuizBank[ QuestArr[0] ];
	}
});