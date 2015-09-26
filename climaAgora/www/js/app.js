// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var climaApp = angular.module('climaApp', ['ionic','ngCordova']);
var db = null;

climaApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    bd = $cordovaSQLite.openDB({name:"my.db"});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS clima (id INTEGET NOT NULL PRIMARY KEY, temperatura text)")
      
  });
})

climaApp.controller("climaCtrl",["$scope","$ionicLoading","$cordovaSQLite","climaSvc",climaCtrl])

function climaCtrl($scope, $ionicLoading, $cordovaSQLite, climaSvc){
    $scope.cidade = "---";
    $scope.temperatura = "ND";
    
    //Incvocar um serviço que se comunica com o Open Weather
    climaSvc.loadClima();
    
    //Função invocada ao carregar Temperatura.
    $scope.$on("climaApp.temperatura", function(_,result){
        $scope.insert($scope.temperatura);
        $scope.cidade = result.name;
        $scope.img = "http://openweathermap.org/img/w/" + result.weather[0].icon + ".png";
        $scope.descricao = result.weather[0].description;
        $scope.temperatura = result.main.temp;
        $scope.min = result.main.temp_min;
        $scope.max = result.main.temp_max;
        $scope.pressao = result.main.pressure;
        $scope.long = result.coord.lon;
        $scope.lat = result.coord.lat;
        $scope.vento = result.wind.speed;
        $scope.umidade = result.main.humidity;
        
    }); //Fim do climaApp.temperatura
    
    
    $scope.$on("climaApp.temperaturaErro", function(_,result){
        $scope.select();
        $scope.cidade       = "bd";
        $scope.img          = "bd";
        $scope.descricao    = "bd";
        $scope.temperatura  = "bd";
        $scope.min          = "bd";
        $scope.max          = "bd";
        $scope.pressao      = "bd";
        $scope.long         = "bd";
        $scope.lat          = "bd";
        $scope.vento        = "bd";
        $scope.umidade      = "bd";
        
    }); //Fim do climaApp.temperatura
    
    
    $scope.reloadClima = function(){
        console.log("Reload Clima");
        climaSvc.loadClima();
        $scope.$broadcast("scroll.infiniteScrollComplete");
        $scope.$broadcast("scroll.refreshComplete");
    }
    
    
    $scope.insert = function(temperatura){
        var query = "INSERT INTO clima (temperatura) VALUES (?)";
        $cordovaSQLite.execute(db.query)
    
    }
    
    $scope.select = function(){
        var query = "INSERT INTO clima (temperatura) VALUES (?)";
        $cordovaSQLite.execute(db.query)
    
    }
    
    
    
} //Fim do Controller

climaApp.service("climaSvc",["$http","$rootScope",climaSvc])

function climaSvc($http,$rootScope){
    
    this.loadClima = function (){
        console.log("Carregando clima");
        url = "http://api.openweathermap.org/data/2.5/weather?lat=-21.6692&lon=-49.6933&units=metric&lang=pt";
        $http.get(url, {params : ""}).success(
            function(result){
                console.log("Temperatura carregada com sucesso!");
                $rootScope.$broadcast("climaApp.temperatura",result);
            }
        ).error(
            function(result){
                console.log("Erro ao carregar Temperatura!");
                $rootScope.$broadcast("climaApp.temperaturaErro");
            }
        );
    }
    
} //Fim do Serviço