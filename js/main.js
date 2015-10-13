new WOW().init();

var app = angular.module('Quiz', ['ngAnimate' , 'firebase']);
var ref = new Firebase("https://se15.firebaseio.com");

app.controller( 'LoginForm', function( $scope ) {
	/* form control */
	$scope.username = "";
	$scope.password = "";

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