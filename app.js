(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItems() {
        var ddo = {
            scope: {
                items: '<',
                removeFoundItemsOn: '&onRemove'
            },
            controller: FoundItemsController,
            bindToController: true,
            controllerAs: 'dirCtrl',
            templateUrl: 'founditem.html'
        };

        return ddo;
    }

    FoundItemsController.$inject = ['MenuSearchService'];
    function FoundItemsController(MenuSearchService) {
        var dirCtrl = this;

    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var nidCtrl = this;
        nidCtrl.search = function () {
            MenuSearchService.clear();
            if (nidCtrl.searchTerm !== undefined && nidCtrl.searchTerm !== "") {
                MenuSearchService.getMatchedMenuItems(nidCtrl.searchTerm)
                    .then(function (result) {
                        nidCtrl.found = result;
                    });
            }
            else
                nidCtrl.found = MenuSearchService.getFoundItems();
        };

        nidCtrl.remove = function (itemIndex) {
            MenuSearchService.removeFoundItems(itemIndex);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        var foundItems = [];

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                url: ApiBasePath + "/menu_items.json"
            }).then(function (result) {
                var allItems = result.data.menu_items;
                for (var i = 0; i < allItems.length; i++)
                    if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) > 0)
                        foundItems.push(allItems[i]);
                return foundItems;
            });
        };

        service.removeFoundItems = function (itemIndex) {
            foundItems.splice(itemIndex, 1);
        };

        service.getFoundItems = function () {
            return foundItems;
        };

        service.clear = function () {
            foundItems.splice(0, foundItems.length);
        };
    }

})();