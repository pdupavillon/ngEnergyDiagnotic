var app = angular.module('ngEnergyDiagnotic', []);

app.factory('svgHelper', ['createSVGNode',function(createSVGNode){
  var helper = function($svg, settings){
    var that = this;
    var position = 1;
    var length = $svg[0].offsetWidth/9;
    var height = ($svg[0].offsetHeight/settings.length);
    var space = 10/100;
    height = height - (height*space);
    
    
    var drawSelect = function(params){
      var blockSize = length;
      var position = params.maxlen;
      var rect = createSVGNode('path', $svg,{
        fill:'#000',
        'stroke-width':"1",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        d:"m"+params.maxlen+','+params.position+'l-'+length+',0'+
        'l-'+params.height/2+','+params.height/2+
        'l'+params.height/2+','+params.height/2+
        'l'+params.maxlen+',0'
        +'z'
      });
      $svg.append(rect);
      
      var line = createSVGNode('path', $svg,{
        stroke:'#000',
        'stroke-width':"1",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        'stroke-dasharray':'2,2',
        d:"m"+(params.maxlen-length-(params.height/2))+','+(params.position+(params.height/2))+
        'l-'+(params.maxlen-length-((params.height/2)*2)-params.len)+',0'+
        'z'
      });
      
      $svg.append(line);
      
      var legend = createSVGNode('text', $svg,{
        fill:'#fff',
        'stroke-width':"0",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        'font-size':params.height/2,
        'font-family':"Arial",
        x:params.maxlen-(length)+(length/6),
        y:params.position+(params.height/2)+(params.height/6)
      });
      angular.element(legend).html(params.text);
      $svg.append(legend);
    };
    var drawLine = function(params){
      var line = createSVGNode('path', $svg,{
        fill:params.setting.color,
        'stroke-width':"0",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        d:"m1,"+params.position+"l"+params.len+",0l"+(params.height/2)+","+(params.height/2)+"l-"+
        (params.height/2)+","+(params.height/2)+"l-"+params.len+",0"+"z"
      });
      $svg.append(line);
      var letter = createSVGNode('text', $svg,{
        fill:params.setting.text_color||'#000',
        'stroke-width':"0",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        'font-size':params.height/2,
        'font-family':"Arial",
        'font-weight':'bold',
        x:params.len-((params.height/5)),
        y:params.position+(params.height/2)+(params.height/6)
      });
      angular.element(letter).html(params.setting.letter);
      $svg.append(letter);
      
     var legend = createSVGNode('text', $svg,{
        fill:params.setting.text_color||'#000',
        'stroke-width':"0",
        'stroke-linejoin':"null",
        'stroke-linecap':"null",
        'font-size':params.height/2.5,
        'font-family':"Arial",
        x:4,
        y:params.position+(params.height/2)+(params.height/6)
      });
      angular.element(legend).html(params.setting.legend);
      $svg.append(legend);
     
    };
    that.draw = function(){
       settings.forEach(function(setting, index){
        var data ={
          setting:setting,
          position:position+((height + (height*space))*index),
          height:height,
          len:length*(index+1)
        };
        drawLine(data);
      });      
    };
    
    that.clear=function(){
      $svg.html('');
    };
    
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
          len:length*(selected+1),
          maxlen:$svg[0].offsetWidth,
          text:selectedValue
        };
        drawSelect(data);      
      }
    }
  };
  return {
    init:function($svg, settings){
     return new helper($svg,settings);
    }
  };
}])
.value('createSVGNode', function(name, element, settings) {
      var namespace = 'http://www.w3.org/2000/svg';
      var node = document.createElementNS(namespace, name);
      for (var attribute in settings) {
         var value = settings[attribute];
         if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
            node.setAttribute(attribute, value);
         }
      }
      return node;
   })
.directive('dpe', ['createSVGNode','svgHelper', function(createSVGNode,svgHelper){
  return {
    restrict:'E',
    scope:{
      ngValue:'@?',
      ngLetter:'@?'
    },
    link: function($scope,$elem, $attr){
      var svg = createSVGNode('svg', $elem, $attr);
      angular.element(svg).append($elem[0].childNodes);
      $elem.replaceWith(svg);
      var settings = [
        {color:'#309535', letter:'A', legend:'<= 50', isValid:function(i){return i <= 50;}},
        {color:'#51a835',letter:'B', legend:'51 à 90', isValid:function(i){return i >= 51 && i <= 90;}},
        {color:'#c2ce00', letter:'C', legend:'91 à 150', isValid:function(i){return i >= 91 && i <= 150;}},
        {color:'#eade00',letter:'D', legend:'151 à 230', isValid:function(i){return i >= 151 && i <= 230;}},
        {color:'#f9c802',letter:'E', legend:'231 à 330', isValid:function(i){return i >= 231 && i <= 330;}},
        {color:'#f09538',letter:'F', legend:'331 à 450', isValid:function(i){return i >= 331 && i <= 450;}},
        {color:'#e0251e', letter:'G',text_color:'#fff', legend:'> 450', isValid:function(i){return i > 450;}}
        ];
      var helper = svgHelper.init(angular.element(svg), settings);
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
.directive('ges', ['createSVGNode','svgHelper', function(createSVGNode,svgHelper){
  return {
    restrict:'E',
    scope:{
      ngValue:'@?',
      ngLetter:'@?'
    },
    link: function($scope,$elem, $attr){
      var svg = createSVGNode('svg', $elem, $attr);
      angular.element(svg).append($elem[0].childNodes);
      $elem.replaceWith(svg);
      var settings = [
        {color:'#f6eefd', letter:'A', legend:'<= 5', isValid:function(i){return i <= 5;}},
        {color:'#e0c2f8',letter:'B', legend:'6 à 10', isValid:function(i){return i >= 6 && i <= 10;}},
        {color:'#d4aaf6', letter:'C', legend:'11 à 20', isValid:function(i){return i >= 11 && i <= 20;}},
        {color:'#cb95f3',letter:'D', legend:'21 à 35', isValid:function(i){return i >= 21 && i <= 35;}},
        {color:'#ba72ef',letter:'E', legend:'36 à 55', isValid:function(i){return i >= 36 && i <= 55;}},
        {color:'#a74deb',letter:'F', legend:'56 à 80', isValid:function(i){return i >= 56 && i <= 80;}},
        {color:'#8919df', text_color:'#fff', letter:'G', legend:'> 80', isValid:function(i){return i > 80;}}
        ];
      var helper = svgHelper.init(angular.element(svg), settings);
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
