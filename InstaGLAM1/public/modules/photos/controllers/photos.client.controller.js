'use strict';


angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket', 'Photos', 
	function($scope, $stateParams, $location, Authentication, Socket, Photos) {
	  $scope.authentication = Authentication;

		// Create new Photo
		$scope.create = function() {
			// Create new Photo object
			var photo = new Photos ({
			  name: this.name,
			  //Desciption test
			  //description: this.description
			});
			
		  photo.$save(function(response) {
		    $location.path('photos/' + response._id);

		    // Clear form fields
					$scope.name = '';

                    $scope.image = '';
		  }, function(errorResponse) {
		       $scope.error = errorResponse.data.message;
		     });
                  
		};
		/*
		Socket.on('photo.created', function(photo) {
			console.log("Photo Created" + photo);
		});
*/
		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
			$scope.photos = Photos.query();
		};

		// Find existing Photo
		$scope.findOne = function() {
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			});
		};
		//Like a photo
		$scope.likeThis = function() {
			$scope.photo.likes +=1;
			var photo = $scope.photo;
			
			console.log('like function called');
			//saves the photo -- note the authorization problem in this version
			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		//Dislike a photo
		$scope.dislikeThis = function() {
			$scope.photo.dislikes +=1;
			var photo = $scope.photo;
			//var dislikePhoto = Math.max.apply(Math, $scope.photo.dislikes);
			
			console.log('dislike function called');
			//saves the photo -- note the authorization problem in this version
			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
}]);