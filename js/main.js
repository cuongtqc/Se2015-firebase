new WOW().init();

// sử dụng ngAnimate để đỡ nhàm chán cho ng-show ng-hide. Kết hợp vs angular-fire
var app = angular.module('Quiz', ['ngAnimate' , 'firebase']);

// link project
var ref = new Firebase("https://se15.firebaseio.com");
function authDataCallback( authData ) {
	if ( authData ) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		return authData;
	} else {
		console.log("User is logged out");
	}
}
// debug trên console.log việc log in và log out
ref.onAuth(authDataCallback);

// leaderboard
app.controller( 'Leaderboard', function( $scope , $firebaseArray ) {
	/* form control */
	var link = new Firebase("https://se15.firebaseio.com/users");
	$scope.userList = $firebaseArray( link );
});

app.controller( 'LoginForm', function( $scope , $firebaseArray , $firebaseAuth ) {
	/* user control */
	$scope.username = "";
	$scope.password = "";
	$scope.user = {
		uid: "",
		name: "unknown",
		score: 0
	}
	$scope.userDef = {
		uid: "",
		name: "",
		score: 0
	}
	
	/* form control */
	$scope.score = 0;
	$scope.loged = ref.getAuth();
	var link = new Firebase("https://se15.firebaseio.com/users");
	$scope.userList = $firebaseArray( link );
	$scope.getUser = function( authData ) {
		if ( !authData ) return $scope.userDef;
		// get info user để hiện thông tin
		for( var i = 0; i < $scope.userList.length; i ++ ) 
		if ( $scope.userList[i].uid == authData.uid ) {
			var x = {
				uid: authData.uid,
				name: $scope.userList[i].name,
				score: $scope.userList[i].score
			}
			return x;
		}
	}
	$scope.userList.$loaded(
		function( data ) {
			$scope.user = $scope.getUser( $scope.loged );
		},
		function(error) {
			console.error("Error:", error);
		}
	);
	
	// đăng kí, Log in và Log out
	$scope.Register = function() {
		ref.createUser({
			email    : $scope.username,
			password : $scope.password
		}, function( error, authData ) {
			if ( error ) {
				alert("Register Failed:" + error.message );
			} else {
				alert("Register successfully!");
				$scope.user.uid = authData.uid;
				$scope.userList.$add( $scope.user );
			}
		});
	}
	$scope.LogIn = function() {
		ref.authWithPassword({
			email    : $scope.username,
			password : $scope.password
		}, function( error, authData ) {
			if ( error ) {
				alert("Log in Failed:" + error.message   );
			} else {
				for( var i = 0; i < $scope.userList.length; i ++ ) 
				if ( $scope.userList[i].uid == authData.uid ) {
					$scope.user = $scope.userList[i];
				}
				console.log("Log in successfully with payload:", authData);
				$scope.$apply( function(){
					$scope.loged = true;
				});
			}
		});
	}
	$scope.LogOut = function() {
		ref.unauth();
		$scope.loged = false;
	}
});

app.controller('TopicController', function( $scope ) {
	/* menu items( các loại câu hỏi ) */
	$scope.menu = [ 
		{ 
			icon: 'img/math.jpg', 
			tittle: 'Math quiz', 
			description: 'You think you are a math genius?', 
			link: 'mathQuiz.html',
		}, 
		{ 
			icon: 'img/troll.jpg', 
			tittle: 'Funny quiz', 
			description: 'You will never get a highscore at this quiz', 
			link: 'funnyQuiz.html',
		},
		{
			icon: 'img/travel.jpg',
			tittle: 'Travelling quiz',
			description: 'Quizzes on countries, cities, beaches, ....',
			link: 'travelQuiz.html',
		},
		{
			icon: 'img/football.jpg',
			tittle: 'Football quiz',
			description: 'Do you know anything about football?',
			link: 'footballQuiz.html',
		},
		{
			icon: 'img/iq.jpg',
			tittle: 'IQ test',
			description: "This will test your IQ, or it doesn't?",
			link: 'IQQuiz.html',
		},
		{
			icon: 'img/japanese.jpg',
			tittle: 'Japanese culture',
			description: 'This quiz is about Japanese culture',
			link: 'japanQuiz.html',
		}
	];
});