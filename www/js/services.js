angular.module('starter.services', [])

.factory('GameService', function(LocationFactory, EdgeFactory, ResourceFactory, ResourceStoreFactory, DevelopmentCardFactory) {

	return {
		mIsActive: false,
		mNumberOfTurns: null, // number of turns played
		mLocations: [], // locations for towns/cities
		mEdges: [], // places where roads may be built
		mPlayerDevelopmentCards: [], // development cards owned by the player
		mDevelopmentCardStack: [], // development cards available for purchase
		mResourceStore: null,
		mLastDiceOutcome: null,
		mOnMoon: false, // Did we go to space (and ended up on the moon)?

		newGame: function() {
			this.mIsActive = true;
			this.mOnMoon = false;
			this.mNumberOfTurns = 1;

			var size = 1.0;
			this.mLocations = [
				LocationFactory({
					mX: 0.0,
					mY: 0.0,
					mName: 'Navennni City',
					mPlayerTown: true,
					mResources: [
						// The stats of the first town is important for difficulty, so make it hard coded
						ResourceFactory('wood', 10),
						ResourceFactory('clay', 5),
						ResourceFactory('grain', 3),
						ResourceFactory('sheep', 12), // also add a 4:th resource here so it is not the end of world if you get robbed of your sheep before getting a sheep house
					],
				}),

				LocationFactory({
					mX: size / 2 + size * Math.cos(Math.PI / 4),
					mY:	0,
					mName: 'Hilly Village',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
				LocationFactory({
					mX: size / 2,
					mY:	- size * Math.sin(Math.PI / 4),
					mName: 'Claystone',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
				LocationFactory({
					mX: -size / 2,
					mY:	- size * Math.sin(Math.PI / 4),
					mName: 'Spoon berry',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
				LocationFactory({
					mX: -size / 2 - size * Math.cos(Math.PI / 4),
					mY:	0,
					mName: 'Farmers town',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
				LocationFactory({
					mX: -size / 2,
					mY:	size * Math.sin(Math.PI / 4),
					mName: 'Vally village',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
				LocationFactory({
					mX: size / 2,
					mY:	size * Math.sin(Math.PI / 4),
					mName: 'Red ballon town',
					mResources: [
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
						ResourceFactory(this.randResourceType(), this.randResourceDiceSum()),
					],
				}),
			];

			this.mEdges = [
				EdgeFactory(this.mLocations[0], this.mLocations[1]),
				EdgeFactory(this.mLocations[0], this.mLocations[2]),
				EdgeFactory(this.mLocations[0], this.mLocations[3]),
				EdgeFactory(this.mLocations[0], this.mLocations[4]),
				EdgeFactory(this.mLocations[0], this.mLocations[5]),
				EdgeFactory(this.mLocations[0], this.mLocations[6]),
			];

			this.mResourceStore = ResourceStoreFactory();

			// Add initial resources for a second house
			this.mResourceStore['wood'] = 2;
			this.mResourceStore['clay'] = 2;
			this.mResourceStore['sheep'] = 1;
			this.mResourceStore['grain'] = 1;

			// debug
			//this.mResourceStore['wood'] = 10;
			//this.mResourceStore['clay'] = 10;
			//this.mResourceStore['sheep'] = 10;
			//this.mResourceStore['grain'] = 10;
			//this.mResourceStore['stone'] = 10;

			// Add development cards to stack
			this.mDevelopmentCardStack = [];
			for (var i = 0; i < 14; i++) {
				this.mDevelopmentCardStack.splice(
						Math.floor(Math.random() * this.mDevelopmentCardStack.length),
						0,
					   	DevelopmentCardFactory('space')
				);
			}
			for (var i = 0; i < 5; i++) {
				this.mDevelopmentCardStack.splice(
						Math.floor(Math.random() * this.mDevelopmentCardStack.length),
						0,
						DevelopmentCardFactory('point')
				);
			}
			/*for (var i = 0; i < 4; i++) {
				this.mDevelopmentCardStack.splice(
						Math.floor(Math.random() * this.mDevelopmentCardStack.length),
						0,
						DevelopmentCardFactory('resource')
				);
			}*/
		},

		isActive: function() {
			return this.mIsActive;
		},

		getLocationList: function() {
			return this.mLocations;
		},
		getEdgeList: function() {
			return this.mEdges;
		},
		getPlayerDevelopmentCards: function() {
			return this.mPlayerDevelopmentCards;
		},
		getResourceStore: function() {
			return this.mResourceStore;
		},
		getLastDiceOutcome: function() {
			return this.mLastDiceOutcome;
		},
		getNumberOfTurnsPlayed: function() {
			return this.mNumberOfTurns;
		},
		getNumberOfPoints: function() {
			var points = 0;
			// Town + cities
			for (var i = 0; i < this.mLocations.length; i++) {
				if (this.mLocations[i].mPlayerTown) {
					points += this.mLocations[i].mIsCity ? 2 : 1;
				}
			}
			// Point cards
			for (var i = 0; i < this.mPlayerDevelopmentCards.length; i++) {
				if (this.mPlayerDevelopmentCards[i].mType === 'point') {
					points++;
				}
			}
			return points;
		},
		isOnMoon: function() {
			return this.mOnMoon;
		},
		getNumSpaceShuttlePartsTarget: function() {
			return 3;
		},
		getNumSpaceShuttleParts: function() {
			var parts = 0;
			for (var i = 0; i < this.mPlayerDevelopmentCards.length; i++) {
				if (this.mPlayerDevelopmentCards[i].mType === 'space') {
					parts++;
				}
			}
			return parts;
		},
		canBuildRoad: function() {
			return this.mResourceStore['wood'] >= 1 &&
				this.mResourceStore['clay'] >= 1;
		},
		canAffordTown: function() {
			return this.mResourceStore['wood'] >= 1 &&
				this.mResourceStore['clay'] >= 1 &&
				this.mResourceStore['sheep'] >= 1 &&
				this.mResourceStore['grain'] >= 1;
		},
		canBuildTown: function(location_obj, error) {
			error = error || {};
			error.message = '';
			if (!this.canAffordTown()) {
				error.message = 'Cannot afford town. Requires 1 wood, 1 clay, 1 sheep and 1 grain';
			}
			else if (this.getTownCount >= 5) {
				error.message = 'You already have the maximum number of towns. Upgrade some of your towns to city before you can build here';
			}
			if (error.message !== '') return false;

			// As the game starts by owning the center town
			// and we don't have any edges between satellite
			// towns, it is enough to find a road that starts/ends
			// in location_obj.
			for (var i = 0; i < this.mEdges.length; i++) {
				if (this.mEdges[i].mIsRoad &&
						(this.mEdges[i].mFrom === location_obj ||
						this.mEdges[i].mTo === location_obj))
					return true;
			}

			error.message = 'You need to build a road here first';
			return false;
		},
		canAffordCity: function() {
			return this.mResourceStore['grain'] >= 2 &&
				this.mResourceStore['stone'] >= 3;
		},
		canBuildCity: function(location_obj, error) {
			error = error || {};
			error.message = '';
			if (!this.canAffordCity()) {
				error.message = 'Cannot afford city. Requires 2 grain and 3 stone';
			}
			else if (!location_obj.mPlayerTown) {
				error.message = 'You need to build a town here first';
			}
			else if (location_obj.mIsCity) {
				error.message = 'You already have a city here';
			}
			else if (this.getCityCount >= 4) {
				error.message = 'You already have the maximum number of cities. Buy development cards to advance to space program';
			}
			return error.message === '';

		},
		canBuyDevelopmentCard: function() {
			return this.mResourceStore['sheep'] >= 1 &&
				this.mResourceStore['grain'] >= 1 &&
				this.mResourceStore['stone'] >= 1;
		},
		canGoToSpace: function() {
			return this.getNumSpaceShuttleParts() >= this.getNumSpaceShuttlePartsTarget();
		},
		getTownCount: function() {
			var town_count = 0;
			for (var i = 0; i < this.mLocations.length; i++) {
				if (this.mLocations[i].mPlayerTown && !this.mLocations[i].mIsCity) {
					town_count++;
				}
			}
			return town_count;
		},
		getCityCount: function() {
			var city_count = 0;
			for (var i = 0; i < this.mLocations.length; i++) {
				if (this.mLocations[i].mPlayerTown && this.mLocations[i].mIsCity) {
					city_count++;
				}
			}
			return city_count;
		},

		worldWidth: function() {
			return Math.abs(this.mLocations[1].mX) + Math.abs(this.mLocations[4].mX);
		},
		worldHeight: function() {
			return Math.abs(this.mLocations[2].mY) + Math.abs(this.mLocations[5].mY);
		},
		/* Get random value 1-6 */
		randDice: function() {
			return Math.floor(Math.random() * 6) + 1;
		},
		/* Get a random value 2-12, excluding 7 */
		randResourceDiceSum: function() {
			var result = Math.floor(Math.random() * 10) + 2; // 2 - 11
			if (result >= 7) result++;
			return result;
		},
		/* Get a random resource type */
		randResourceType: function() {
			return ['wood', 'clay', 'sheep', 'grain', 'stone'][Math.floor(Math.random() * 5)];
		},

		/* -- Actions -- */
		endTurn: function() {

			this.mNumberOfTurns++;
			this.mLastDiceOutcome = [
				this.randDice(),
				this.randDice(),
			];
			var dice_sum = this.mLastDiceOutcome[0] + this.mLastDiceOutcome[1];

			if (dice_sum === 7) {
/*
				if (this.mResourceStore.count() > 4) {
					// Robb everything but 4 

					// Build an array with 1 element for each resource.
					var res_array = [];
					var res_def = {wood: null, clay: null, sheep: null, grain: null, stone: null};
					for (res in res_def) {
						for (var i = 0; i < this.mResourceStore[res]; i++) {
							res_array.push(res);
						}
					}

					while (res_array.length > 4) {
						res_array.splice(Math.floor(Math.random() * res_array.length), 1);
					}

					// Update the resource store
					for (res in res_def) {
						this.mResourceStore[res] = 0;
					}
					for (var i = 0; i < res_array.length; i++) {
						this.mResourceStore[res_array[i]]++;
					}
				}
				*/
			} else {
				// Collect resources
				for (var i = 0; i < this.mLocations.length; i++) {
					if (this.mLocations[i].mPlayerTown) {
						for (var j = 0; j < this.mLocations[i].mResources.length; j++) {
							var resource = this.mLocations[i].mResources[j];
							if (resource.mDiceSum === dice_sum) {
								this.mResourceStore[resource.mType]++;
							}
						}
					}
				}
			}

		},
		/**
		 * @param robber_take A ResourceStoreFactory object with number of resources to take
		 */
		letRobberTake: function(robber_take) {
			for (res in {wood: null, clay: null, sheep: null, grain: null, stone: null}) {
				this.mResourceStore[res] -= robber_take[res];
				if (this.mResourceStore < 0) console.log('Error: < 0 resources left after robber');
			}
		},
		buildRoad: function(edge_obj) {
			if (!this.canBuildRoad()) return false;

			edge_obj.mIsRoad = true;

			this.mResourceStore['wood']--;
			this.mResourceStore['clay']--;
		},
		buildTown: function(location_obj) {
			if (!this.canBuildTown(location_obj)) return false;

			location_obj.mPlayerTown = true;

			this.mResourceStore['wood']--;
			this.mResourceStore['clay']--;
			this.mResourceStore['sheep']--;
			this.mResourceStore['grain']--;
		},
		buildCity: function(location_obj) {
			if (!this.canBuildCity(location_obj)) return false;

			location_obj.mIsCity = true;

			this.mResourceStore['grain'] -= 2;
			this.mResourceStore['stone'] -= 3;
		},
		buyDevelopmentCard: function() {
			if (!this.canBuyDevelopmentCard()) return false;

			this.mPlayerDevelopmentCards.push(this.mDevelopmentCardStack.pop());

			this.mResourceStore['sheep'] -= 1;
			this.mResourceStore['grain'] -= 1;
			this.mResourceStore['stone'] -= 1;
		},
		playDevelopmentCard: function(card_obj) {
		},
		goToSpace: function() {
			this.mOnMoon = true;
		},
	};
})

.factory('AudioService', function() {

	return {
		mMusicMute: true,
		mEffectsMute: false,

		/* Helper to stop current effect and restart it */
		playEffect: function(dom_element) {
			if (this.mEffectsMute) return;
			dom_element.pause();
			dom_element.currentTime = 0;
			dom_element.play();
		},

		isMusicMuted: function() {
			return this.mMusicMute;
		},
		isEffectsMuted: function() {
			return this.mEffectsMute;
		},
		playMusic: function() {
			this.mMusicMute = false;
			document.getElementById('music').play();
		},
		toggleMusicMute: function() {
			var music = document.getElementById('music');
			if (this.mMusicMute) music.play();
			else music.pause();
			this.mMusicMute = !this.mMusicMute;
		},
		toggleEffectsMute: function() {
			this.mEffectsMute = !this.mEffectsMute;
		},
		playDiceEffect: function() {
			this.playEffect(document.getElementById('sound-effect-dice'));
		},

	};
})

/**
 * Creates a new location.
 */
.factory('LocationFactory', function() {
	return function(config) {
		var obj = {
			mX: 0.0,
			mY: 0.0,
			mName: '',
			mResources: [],
			mPlayerTown: false,
			mIsCity: false,
		};
		for (var k in obj) {
			if (k in config) {
				obj[k] = config[k]
			}
		}
		return obj;
	};
})

/**
 * Creates a new edge.
 */
.factory('EdgeFactory', function() {
	return function(from_location, to_location) {
		return {
			mFrom: from_location,
			mTo: to_location,
			mIsRoad: false,
		};
	};
})

/**
 * Creates a new resource.
 *
 * utility: a value 1-5 where 5 is best
 */
.factory('ResourceFactory', function() {
	return function(type, diceSum) {
		var utility = (diceSum > 6 ? 14 - diceSum : diceSum) - 1;
		return {
			mType: type,
			mDiceSum: diceSum,
			mUtility: utility,
		};
	};
})

/**
 * Creates a new resource store
 *
 * One key for each resource type
 */
.factory('ResourceStoreFactory', function() {
	return function() {
		return {
			wood: 0,
			clay: 0,
			sheep: 0,
			grain: 0,
			stone: 0,

			count: function() {
				return this.wood + this.clay + this.sheep + this.grain + this.stone;
			},
		};
	};
})

/**
 * Creates a new development card
 *
 * type:
 *   - 'point' = useless point card
 *   - 'resource' = pick 2 resources
 *   - 'space' = space shuttle part
 */
.factory('DevelopmentCardFactory', function() {
	return function(type) {
		var obj = {
			mType: type,
		};
		switch (type) {
			case 'point':
				obj.mTitle = '1 point';
				obj.mImgSrc = 'img/dev-card-point.png';
				break;
//			case 'resource':
//				obj.mTitle = 'Draw 2 resouces card';
//				obj.mImgSrc = 'img/ionic.png';
//				break;
			case 'space':
				obj.mTitle = 'Space shuttle part';
				obj.mImgSrc = 'img/dev-card-space.png';
				break;
			default:
				console.log('Unknown development card type: ' + type);
		}

		return obj;
	};
})
