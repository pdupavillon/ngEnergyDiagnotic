var app = angular.module('ngEnergyDiagnotic', []);

app.factory('canvasHelper', function(){
  var helper = function(settings, canvas){
    var that = this;
    var ctx = canvas.getContext("2d");
    var position = 1;
    var length = 35;
    var height = (canvas.height/settings.length);
    var space = 10/100;
    height = height - (height*space);

    var drawSelect = function(params){
      var blockSize = 40;
      var position = params.maxlen;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle='#000';
      ctx.fillRect(position,params.position,blockSize,params.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.fillStyle='#000';
      ctx.moveTo(position-(params.height/2), params.position+(params.height/2));
      ctx.lineTo(position,params.position);
      ctx.lineTo(position,params.position+params.height);
      ctx.fill();
      
      
      ctx.beginPath();
      ctx.setLineDash([3]);
      ctx.moveTo(position-(params.height/2), params.position+(params.height/2));
      ctx.lineTo(params.len+(params.height/2), params.position+(params.height/2));
      ctx.stroke();
      
      ctx.beginPath();
      ctx.font = "bold 0.6em Arial";
      ctx.fillStyle='#fff';
      ctx.fillText(params.text, position+(blockSize/2)-(params.height/3), params.position+(params.height/2)+3);
      ctx.stroke();
    };
    var drawLine = function(params){
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle=params.setting.color;
      ctx.fillRect(1,params.position,params.len,params.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.fillStyle=params.setting.color;
      ctx.moveTo(params.len + (params.height/2),params.position+(params.height/2));
      ctx.lineTo(params.len+1,params.position);
      ctx.lineTo(params.len+1,params.position+params.height);
      ctx.fill();
      
      ctx.beginPath();
      ctx.font = "bold 0.6em Arial";
      ctx.fillStyle=params.setting.text_color||'#000';
      ctx.fillText(params.setting.letter, params.len-((params.height/2)*0.6), params.position+(params.height/2)+3);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.font = "0.5em Arial";
      ctx.fillStyle=params.setting.text_color||'#000';
      ctx.fillText(params.setting.legend, 4, params.position+(params.height/2)+4);
      ctx.stroke();
    };
    that.draw = function(){
      settings.forEach(function(setting, index){
        var data ={
          setting:setting,
          position:position+((height + (height*space))*index),
          height:height,
          len:length+(index*21)
        };
        drawLine(data);
      });      
    };
    that.clear = function(){
      ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
    }
    that.drawSelect = function(value, letter){
      var selected;
      var selectedValue;
      if (value !== undefined){
        var matchValue = settings.filter(function(setting){return setting.isValid(value);});
        if (matchValue && matchValue.length === 1){
          selected = settings.indexOf(matchValue[0]);
          selectedValue=value;
        }
      }
      if (letter !== undefined){
        var matchLetter = settings.filter(function(setting){return setting.letter.toLowerCase() === letter.toLowerCase();});
        if (matchLetter && matchLetter.length === 1){
          selected = settings.indexOf(matchLetter[0]);
          selectedValue=matchLetter[0].letter;
        }
      }
      if (selected !== undefined){
       var data = {
          setting:settings[selected],
          position:position+((height + (height*space))*selected),
          height:height,
          len:length+(selected*21),
          maxlen:(length+(settings.length*21)),
          text:selectedValue
        };
        drawSelect(data);      
      }
    };
  };
  return helper;
})
.directive('dpe', ['canvasHelper', function(canvasHelper){
  return {
    restrict:'E',
    scope:{
      ngValue:'@?',
      ngLetter:'@?'
    },
    template:'<canvas style="height:100%; width:100%"></canvas>',
    link: function($scope,$elem, $attr){
      var canvas = $elem.find('canvas')[0];
      var settings = [
        {color:'#309535', letter:'A', legend:'<= 50', isValid:function(i){return i <= 50;}},
        {color:'#51a835',letter:'B', legend:'51 à 90', isValid:function(i){return i >= 51 && i <= 90;}},
        {color:'#c2ce00', letter:'C', legend:'91 à 150', isValid:function(i){return i >= 91 && i <= 150;}},
        {color:'#eade00',letter:'D', legend:'151 à 230', isValid:function(i){return i >= 151 && i <= 230;}},
        {color:'#f9c802',letter:'E', legend:'231 à 330', isValid:function(i){return i >= 231 && i <= 330;}},
        {color:'#f09538',letter:'F', legend:'331 à 450', isValid:function(i){return i >= 331 && i <= 450;}},
        {color:'#e0251e', letter:'G', legend:'> 450', isValid:function(i){return i > 450;}}
        ];
      var helper = new canvasHelper(settings, canvas);
      helper.draw();
      $scope.$watchGroup(['ngLetter','ngValue'], function(old, newValue){
        if ($scope.ngValue||$scope.ngLetter){
          helper.clear();
          helper.draw();
          helper.drawSelect($scope.ngValue, $scope.ngLetter);
        }
      });
    }
  };
}])
.directive('ges', ['canvasHelper', function(canvasHelper){
  return {
    restrict:'E',
    scope:{
      ngValue:'@?',
      ngLetter:'@?'
    },
    template:'<canvas style="height:100%; width:100%"></canvas>',
    link: function($scope,$elem, $attr){
      var canvas = $elem.find('canvas')[0];
      var settings = [
        {color:'#f6eefd', letter:'A', legend:'<= 5', isValid:function(i){return i <= 5;}},
        {color:'#e0c2f8',letter:'B', legend:'6 à 10', isValid:function(i){return i >= 6 && i <= 10;}},
        {color:'#d4aaf6', letter:'C', legend:'11 à 20', isValid:function(i){return i >= 11 && i <= 20;}},
        {color:'#cb95f3',letter:'D', legend:'21 à 35', isValid:function(i){return i >= 21 && i <= 35;}},
        {color:'#ba72ef',letter:'E', legend:'36 à 55', isValid:function(i){return i >= 36 && i <= 55;}},
        {color:'#a74deb',letter:'F', legend:'56 à 80', isValid:function(i){return i >= 56 && i <= 80;}},
        {color:'#8919df', text_color:'#fff', letter:'G', legend:'> 80', isValid:function(i){return i > 80;}}
        ];
      var helper = new canvasHelper(settings, canvas);
      helper.draw();
      $scope.$watchGroup(['ngLetter','ngValue'], function(old, newValue){
        if ($scope.ngValue||$scope.ngLetter){
          helper.clear();
          helper.draw();
          helper.drawSelect($scope.ngValue, $scope.ngLetter);
        }
      });
    }
  };
}]);
