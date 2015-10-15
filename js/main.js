new WOW().init();

var app = angular.module('Quiz', ['ngAnimate' , 'firebase']);
var ref = new Firebase("https://se15.firebaseio.com");

app.controller( 'LoginForm', function( $scope , $firebaseArray , $firebaseAuth ) {
	/* user control */
	$scope.username = "";
	$scope.password = "";
	$scope.user = {
		uid: "",
		name: "",
		score: 0
	}
	$scope.score = 0;
	
	/* form control */
	$scope.loged = false;
	var link = new Firebase("https://se15.firebaseio.com/users");
	var userList = $firebaseArray( link );

	$scope.Register = function() {
		ref.createUser({
			email    : $scope.username,
			password : $scope.password
		}, function( error, authData ) {
			if ( error ) {
				alert("Register Failed:" + error.message );
				$scope.LogIn();
			} else {
				console.log("Authenticated successfully with payload:", authData);
				$scope.user.uid = authData.uid;
				userList.$add( $scope.user );
				$scope.LogIn();
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
				for( var i = 0; i < userList.length; i ++ ) 
				if ( userList[i].uid == authData.uid ) {
					$scope.user = userList[i];
				}
				console.log( $scope.user );
				console.log("Log in successfully with payload:", authData);
				$scope.$apply( function(){
					$scope.loged = true;
				});
			}
		});
	}
});

app.controller('TopicController', function( $scope ) {
	/* menu items */
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
			link: '#',
		},
		{
			icon: 'img/travel.jpg',
			tittle: 'Travelling quiz',
			description: 'Quizzes on countries, cities, beaches, ....',
			link: '#',
		},
		{
			icon: 'img/football.jpg',
			tittle: 'Football quiz',
			description: 'Do you know anything about football?',
			link: '#',
		},
		{
			icon: 'img/iq.jpg',
			tittle: 'IQ test',
			description: "This will test your IQ, or it doesn't?",
			link: '#',
		},
		{
			icon: 'img/japanese.jpg',
			tittle: 'Japanese culture',
			description: 'This quiz is about Japanese culture',
			link: '#',
		}
	];
});