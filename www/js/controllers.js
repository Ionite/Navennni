angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicHistory, GameService, AudioService) {
  	$scope.toGame = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true,
			historyRoot: true,
		});
		$state.go('app.game', {});
	}
	$scope.isGameActive = function() {
		return GameService.isActive();
	}

	$scope.isMusicMuted = function() {
		return AudioService.isMusicMuted();
	}
	$scope.isSoundEffectsMuted = function() {
		return AudioService.isEffectsMuted();
	}
	$scope.toggleMusicMute = function() {
		return AudioService.toggleMusicMute();
	}
	$scope.toggleEffectsMute = function() {
		return AudioService.toggleEffectsMute();
	}
})

.controller('IntroCtrl', function($scope, $state, $ionicHistory, $ionicSlideBoxDelegate, GameService) {

	$scope.onPlayGameClick = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true,
			historyRoot: true,
		});
		$state.go('app.game');
	}

	$scope.isActive = function() {
		return GameService.isActive();
	}
})

.controller('RulesCtrl', function($scope, GameService) {
	$scope.costs = [
		{
			name: 'Road',
			cost: '1 wood and 1 clay',
			img: 'img/road.png',
		},
		{
			name: 'Town',
			cost: '1 wood, 1 clay, 1 sheep and 1 grain',
			img: 'img/town.png',
		},
		{
			name: 'City',
			cost: '2 grain and 3 stone',
			img: 'img/city.png',
		},
		{
			name: 'Development Card',
			cost: '1 sheep, 1 grain and 1 stone',
			img: 'img/dev-card-back.png',
		},
	];

	$scope.numSpaceShuttlePartsTarget = GameService.getNumSpaceShuttlePartsTarget();
})

.controller('GameCtrl', function($scope, $stateParams, $ionicModal, GameService, AudioService, ResourceStoreFactory) {

	$scope.locations = []; // List of locations
	$scope.edges = []; // List of edges
	$scope.developmentCards = []; // List of player owned development cards
	$scope.resourceDefs = ['wood', 'clay', 'sheep', 'grain', 'stone'];
	$scope.resourceColors = {wood: '#090', clay: '#faa', sheep: '#5f5', grain: 'yellow', stone: '#999'};
	$scope.resourceTextColors = {wood: '#090', clay: '#c88', sheep: '#2c2', grain: '#990', stone: '#777'};
	$scope.resourceStore = []; // Resources that the player has in the bank
	$scope.lastDiceOutcome = []; // Outcome of last dice throws or null
	$scope.onMoon = false; // Are we on the moon?
	$scope.numTurns = null; // Number of turns
	$scope.numPoints = null; // Number of points
	$scope.detailsLocation = null; // reference to location shown in modal or null
	$scope.detailsEdge = null; // reference to edge shown in modal or null
	$scope.robberResourceList = null; // list of resources to display in robber modal
	$scope.robberNumToKeep = null; // number of resources to keep after being robbed
	$scope.robberAllowClose = null; // is correct number of resources selected so the robber modal can close?
	$scope.edgeModal = null;
	$scope.locationModal = null;
	$scope.developmentCardsModal = null;
	$scope.robberModal = null;
	$scope.tradeModal = null;
	$scope.canBuildRoad = false;
	$scope.canAffordTown = false;
	$scope.canAffordCity = false;
	$scope.canBuyDevelopmentCard = false;
	$scope.canGoToSpace = false;
	$scope.scale = null;   // Draw scale
	$scope.offset = null;  // Draw offset

	var initialize = function() {
		// Edge details modal
		$ionicModal.fromTemplateUrl('templates/edge.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.edgeModal = modal;
		});

		// Location details modal
		$ionicModal.fromTemplateUrl('templates/location.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.locationModal = modal;
		});

		// Development cards modal
		$ionicModal.fromTemplateUrl('templates/development-cards.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.developmentCardsModal = modal;
		});

		// Robber modal
		$ionicModal.fromTemplateUrl('templates/robber.html', {
			scope: $scope,
			backdropClickToClose: false,
			hardwareBackButtonClose: false,
		}).then(function(modal) {
			$scope.robberModal = modal;
		});

		// Trade modal
		$ionicModal.fromTemplateUrl('templates/trade.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.tradeModal = modal;
		});

		// Start game if not started
		if (!GameService.isActive()) {
			AudioService.playMusic();
			GameService.newGame();

		}

		// Update draw offset/scale
		$scope.onWindowResize();
	}

	$scope.updateGameState = function() {
		$scope.locations = GameService.getLocationList();
		$scope.edges = GameService.getEdgeList();
		$scope.developmentCards = GameService.getPlayerDevelopmentCards();
		$scope.resourceStore = GameService.getResourceStore();
		$scope.lastDiceOutcome = GameService.getLastDiceOutcome();
		$scope.canBuildRoad = GameService.canBuildRoad();
		$scope.canAffordTown = GameService.canAffordTown();
		$scope.canAffordCity = GameService.canAffordCity();
		$scope.canBuyDevelopmentCard = GameService.canBuyDevelopmentCard();
		$scope.canGoToSpace = GameService.canGoToSpace();
		$scope.onMoon = GameService.isOnMoon();
		$scope.numTurns = GameService.getNumberOfTurnsPlayed();
		$scope.numPoints = GameService.getNumberOfPoints();
	}

	// Updates draw offset/scale
	$scope.onWindowResize = function() {
		var bar_height = 45;  // top bar takes about 45px
		var win_height = window.innerHeight - bar_height;

		$scope.updateGameState();
		$scope.scale = Math.min(window.innerWidth / GameService.worldWidth() * 0.8, win_height / GameService.worldHeight() * 0.7);
		$scope.xOffset = window.innerWidth / 2;
		$scope.yOffset = win_height / 2 + bar_height;
	}

	$scope.isActive = function() {
		return GameService.isActive();
	}

	$scope.onLocationClick = function(index) {
		var location = $scope.locations[index];
		$scope.showLocationModal(location);
	}
	$scope.onEdgeClick = function(index) {
		var edge = $scope.edges[index];
		$scope.showEdgeModal(edge);
	}
	$scope.onDevelopmentCardsClick = function() {
		$scope.showDevelopmentCardsModal();
	}
	$scope.onTradeClick = function() {
		$scope.showTradeModal();
	}

	$scope.onEndTurnClick = function() {
		GameService.endTurn();
		AudioService.playDiceEffect();
		$scope.updateGameState();

		if ($scope.lastDiceOutcome[0] + $scope.lastDiceOutcome[1] === 7 && $scope.resourceStore.count() > 7) {
			// Show robber modal if have > 7 cards and dice sum was 7
			$scope.showRobberModal();
		}
	}
	$scope.onGoToSpaceClick = function() {
		GameService.goToSpace();
		$scope.updateGameState();
	}
	$scope.onNewGameClick = function() {
		GameService.newGame();
		$scope.updateGameState();
	}

	// Open the edge details modal
	$scope.showEdgeModal = function(edge) {
		$scope.detailsEdge = edge;
		$scope.edgeModal.show();
	};
	$scope.closeEdgeModal = function() {
		$scope.edgeModal.hide();
		$scope.detailsEdge = null;
	};
	$scope.modalEdgeBuildRoad = function() {
		GameService.buildRoad($scope.detailsEdge);
		$scope.closeEdgeModal();
		$scope.updateGameState();
	};

	// Open the location details modal
	$scope.showLocationModal = function(location) {
		$scope.detailsLocation = location;
		$scope.locationModal.show();
	};
	$scope.closeLocationModal = function() {
		$scope.locationModal.hide();
		$scope.detailsLocation = null;
	};
	$scope.modalLocationBuildTown = function() {
		error = {message:''};
		if (!GameService.canBuildTown($scope.detailsLocation, error)) {
			alert(error.message);
			return;
		}
		GameService.buildTown($scope.detailsLocation);
		$scope.updateGameState();
		$scope.closeLocationModal();
	};
	$scope.modalLocationBuildCity = function() {
		error = {message:''};
		if (!GameService.canBuildCity($scope.detailsLocation, error)) {
			alert(error.message);
			return;
		}
		GameService.buildCity($scope.detailsLocation);
		$scope.updateGameState();
		$scope.closeLocationModal();
	};

	// Open the development cards modal
	$scope.showDevelopmentCardsModal = function() {
		$scope.developmentCardsModal.show();
	};
	$scope.closeDevelopmentCardsModal = function() {
		$scope.developmentCardsModal.hide();
	};
	$scope.modalDevelopmentCardsBuyCard = function() {
		GameService.buyDevelopmentCard();
		$scope.updateGameState();
	};
	$scope.modalDevelopmentCardsPlayCard = function(card_obj) {
		GameService.playDevelopmentCard(card_obj);
		$scope.updateGameState();
	};

	// Open the robber modal
	$scope.showRobberModal = function() {
		$scope.robberResourceList = [];
		$scope.robberNumToKeep = 4;
		$scope.robberAllowClose = false;

		// Add one element for each resource into robberResourceList
		$scope.robberResourceList = [];
		var res_def = {wood: null, clay: null, sheep: null, grain: null, stone: null};
		for (res in res_def) {
			for (var i = 0; i < this.resourceStore[res]; i++) {
				$scope.robberResourceList.push({
					type: res,
					selected: false,
				});
			}
		}

		$scope.robberModal.show();
	};
	$scope.modalRobberToggleSelectCard = function(list_item_obj) {
		if (list_item_obj.selected) {
			list_item_obj.selected = false;
			$scope.robberAllowClose = false;
		} else {
			// Ensure we don't select too many cards
			var num_selected = 0;
			for (var i = 0; i < $scope.robberResourceList.length; i++) {
				if ($scope.robberResourceList[i].selected) {
					num_selected++;
				}
			}

			if (num_selected >= $scope.robberNumToKeep) {
				alert('You can only keep ' + $scope.robberNumToKeep + ' resources. Deselect another resource card before you can select this one');
			} else {
				list_item_obj.selected = true;
				num_selected++;

				// Allow close dialog?
				if (num_selected === $scope.robberNumToKeep) {
					$scope.robberAllowClose = true;
				}
			}
		}
	};
	$scope.modalRobberOkay = function() {
		// Count number of resources of each type to give to the robber
		var give_to_robber = ResourceStoreFactory();
		for (var i = 0; i < $scope.robberResourceList.length; i++) {
			if (!$scope.robberResourceList[i].selected) {
				give_to_robber[$scope.robberResourceList[i].type]++;
			}
		}
		GameService.letRobberTake(give_to_robber);

		$scope.robberModal.hide();
	};

	// Open the trade modal
	$scope.showTradeModal = function() {
		$scope.tradeModal.show();
	};
	$scope.closeTradeModal = function() {
		$scope.tradeModal.hide();
	};
	$scope.modalTrade = function() {
	};

	initialize();
})

;
