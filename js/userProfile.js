new WOW().init();

var app = angular.module('Quiz', ['ngAnimate' , 'firebase']);
var ref = new Firebase("https://se15.firebaseio.com");

function authDataCallback( authData ) {
	if ( authData ) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		return authData;
	} else {
		console.log("User is logged out");
	}
}
ref.onAuth(authDataCallback);

app.controller( 'UserProfile', function( $scope , $firebaseArray , $firebaseAuth ) {
	/* user control */
	$scope.name = "";
	$scope.newPassword = "";
	$scope.newPasswordCompare = "";
	$scope.currentPassword = "";
	$scope.userIndex = 0;
	$scope.loaded = false;
	
	/* get user */
	$scope.score = 0;
	$scope.loged = ref.getAuth();
	var link = new Firebase("https://se15.firebaseio.com/users");
	var userList = $firebaseArray( link );
	$scope.getUser = function( authData ) {
		console.log( userList.length );
		if ( !authData ) return $scope.userDef;
		for( var i = 0; i < userList.length; i ++ ) 
		if ( userList[i].uid == authData.uid ) {
			$scope.score = userList[i].score;
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
	$scope.clear = function() {
		$scope.newPassword = "";
		$scope.newPasswordCompare = "";
		$scope.currentPassword = "";
	}
	$scope.submit = function() {
		if ( $scope.newPassword != "" && $scope.currentPassword != "" && $scope.newPassword == $scope.newPasswordCompare ) {
			ref.changePassword({
				email: $scope.loged.password.email,
				oldPassword: $scope.currentPassword,
				newPassword: $scope.newPassword
			}, function(error) {
				if ( error ) {
					console.log("Error changing password:", error);
				} else {
					console.log("User password changed successfully!");
				}
			});
		}
		if ( $scope.name != "" ) {
			userList[$scope.userIndex].name = $scope.name;
			userList.$save( $scope.userIndex ).then( function() {
				console.log( "Change user's name successfully!")
			});
		}
		alert( "UserProfile has been updated!");
	}
});