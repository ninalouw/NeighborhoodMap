//Google map



//Knockout implementation

//Place model
var Place = function () {

}

function ViewModel(){
  var self = this;
  self.defaultMarkers = ko.observableArray([]);

}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
