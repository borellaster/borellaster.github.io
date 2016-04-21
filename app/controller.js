var app = angular.module("app", [
  "ui.router"
]); 

/*Configuração das rotas da url */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/list");  
  
  $stateProvider  
  .state('app', {views: {'master': {templateUrl   : 'views/template.html'}}})
  .state('app.list', {url: '/list', views: {'content@app': {templateUrl:'views/list.html',controller:'ListCtrl'}}})
  .state('app.new', {url: '/new',views: {'content@app': {templateUrl:'views/form.html',controller:'NewCtrl'}}})
  .state('app.form', {url: '/form/:id',views: {'content@app': {templateUrl:'views/form.html',controller:'EditCtrl'}}})
}]);

/*Fábrica do Crud*/
app.factory('AppFactory', function() {
    var list = [
        {id: "123456", nome: 'Bill Gates', telefone: "8885017745"},
        {id: "123457", nome: 'Steve Jobs', telefone: "7585981147"},
        {id: "123458", nome: 'Steve Wozniak', telefone: "5842039658"},
        {id: "123459", nome: 'Linus Torvalds', telefone: "8815997951"},
        {id: "123460", nome: 'Michael Dell', telefone: "9654477951"}
    ];
    
    function lista() {
        return list;
    }
    
    function addItem(item) {
        list.push(item);        
    }
    
    function deleta(reg) {
        list.forEach(function(element, index) {
            if (element.id == reg) {
                list.splice(index, 1);
            }
        });        
    }
    
    function editItem(item) {
        list.forEach(function(element, index) {
            if (element.id == item.id) {
                list.splice(index, 1);
            }
        });        
        list.push(item);
    }
    
    function get(reg) {
        var obj = {};
        lista().forEach(function(element, index) {
            if (element.id == reg) {
                obj =  element;
            }
        });        
        return obj;
    }
    
    return {
        lista : lista,
        get: get,
        deleta: deleta,
        addItem: addItem,
        editItem: editItem
    }
});

app.controller('ListCtrl', ['$scope', 'AppFactory', 
    function($scope, AppFactory) {
    	/*Preenchendo com itens iniciais*/
        $scope.itens = AppFactory.lista();        
        /*Funcao para deletar. Factory é injetado no controller*/
        $scope.deleteItem = function(index){
            AppFactory.deleta(index);        
            console.log("Item removido com sucesso.");
        };
    }
]);

app.controller('NewCtrl', ['$scope', 'AppFactory', '$state', '$window', 
    function($scope, AppFactory, $state, $window) {
        $scope.titulo = "Cadastrando novo contato";
        $scope.item = {id: $window.Math.floor(($window.Math.random() * 999999) + 1), nome: '', telefone: ""};
        /*Funcao para adicionar novo. Factory é injetado no controller*/
        $scope.save = function () {
            AppFactory.addItem($scope.item);
            $state.go('app.list');
            console.log("Adicionado com sucesso.");
        };
    }
]);

app.controller('EditCtrl', ['$scope', '$stateParams', 'AppFactory', '$state',  
    function($scope, params, AppFactory, $state) {
        $scope.item = AppFactory.get(params.id);
        $scope.titulo = "Editando contato: " + $scope.item.id;
        
        /*Funcao para editar. Factory é injetado no controller*/
        $scope.save = function(){
            AppFactory.editItem($scope.item);
            $state.go('app.list');
            console.log("Alterado com sucesso.");
        };
    }
]);
