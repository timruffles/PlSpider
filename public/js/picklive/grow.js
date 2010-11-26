$(document).ready(function() {
  
  var playerData = {};
  homeTeam.forEach(function(player) { playerData[player] = {events:[], name: player}; }),
  awayTeam.forEach(function(player) { playerData[player] = {events:[]}; name: player});
  
  var app = {
    hiding: false
  }
  
  $('#svgBase').click(function() {
    if(app.hiding == false) return;
    console.log('UNHIDING')
    linksList.forEach(function(linkId) {
      $($('#svgBase').svg('get').getElementById(linkId)).css('opacity',0.2);
    });
    app.hiding = false;
  });
      
  $('#svgBase').svg({
    settings: {
      height: 1000
    },
    onLoad: function(svg) {
      
      var rowY = 0,
          rowX = 60;
      [[homeTeam,'Home Team'],[awayTeam,'Away Team']].forEach(function(setup) {
        var name = setup[1],
            players = setup[0],
            keyTable = $('#key').clone().attr('id',_.uniqueId());
            
        keyTable.css({
          display:'block',
          left: rowX - 80 + 'px',
          top:  rowY + 125 + 'px'
        });  
        
        $('#svgBase').append(keyTable);
            
        players.forEach(function(playerName) {
          // FIXME obviously not great to use lots of the same ids...
          svg.add($('#kit'))
          var id  = _.uniqueId(),
              kit = svg.getElementById('kit'),
              dataTable = $('#dataTable').clone().attr('id',_.uniqueId());
              
          dataTable.find('.name').html(playerName)
          $('#svgBase').append(dataTable);
          
          kit.setAttribute('id',id);
          kit.setAttribute('x',rowX);
          kit.setAttribute('y',rowY);
          $(kit).click(function() {
            
            console.log('HIDING')
            setTimeout(function() {
              app.hiding = true;
            },250);
            linksList.forEach(function(linkId) {
              if(!linksHash[playerName] || linksHash[playerName].indexOf(linkId) == -1) {
                $(svg.getElementById(linkId)).css('opacity',0);
              }
            });
          });
          //svg.rect(rowX + 10,rowY + 100,60,100,{fill:'none',stroke:'blue'})
          playerData[playerName]['element'] = kit;
          playerData[playerName]['dataTable'] = dataTable;
          
          dataTable.css({
            display:'block',
            left: rowX - 25  + 'px',
            top:  rowY + 100 + 'px'
          });
          rowX += 90;
        })
        rowY += 250;
        rowX = 60;
      });
    }
  });
  
  
  function toCoords(coords) {
    var pairs = [];
    for(var cI = 0; cI < coords.length; cI += 2) {
      pairs.push([coords[cI],coords[cI + 1]].join(' '));
    }
    return pairs.join(', ');
  }
  
  var linksHash = {},
      linksList = [];
  function drawLink(pOne, pTwo) {
    var svg = $('#svgBase').svg('get'),
        id  = _.uniqueId(),
        x1   = pOne.element.getAttribute('x'),
        y1   = pOne.element.getAttribute('y'),
        x2   = pTwo.element.getAttribute('x'),
        y2   = pTwo.element.getAttribute('y'),
        midX = Math.round(0.5 * (Number(x2) + Number(x1)),0) + Math.round(Math.random() * 50,0),
        midY =  Math.round(0.5 * (Number(y2) + Number(y1)),0) + Math.round(Math.random() * 150,0),
        path = _.sprintf('<g id="%s" style="stroke: black; fill: none; stroke-width: 4px; opacity: 0.25;"><path d="M%s %s Q %s %s, %s %s" /></g>',id,x1,y1,midX,midY,x2,y2);
    if(typeof linksHash[pOne.name] == 'undefined') linksHash[pOne.name] = [];
    path = svg.add(path);
    linksHash[pOne.name].push(id);
    linksList.push(id);
  }
  
  var actionColours = {
    foul: 'rgb(255,0,0)',
    pass: 'rgb(0,0,255)',
    goal: 'rgb(0,255,0)'
  }
  
  function nextValidShift() {
    var ele = matchEvents.shift();
    if(typeof ele == 'undefined') return false;
    return ele.player ? ele : nextValidShift();
  }
  function nextValidPeek(index) {
    var ele = matchEvents[index || 0];
    if(typeof ele == 'undefined') return false;
    return ele.player ? ele : nextValidPeek((index || 0) + 1);
  }
  
  console.log(playerData);
  function tick() {
    var evt = nextValidShift();
    if(evt == false) return;
    $('#action').html(evt.action);
    if(['pass','interception','foul'].indexOf(evt.action) != -1) {
      var dataPoint = $(playerData[evt.player].dataTable).find('.' + evt.action + ' .data');
      dataPoint.html(dataPoint.html() + '.');
    }
    var outline = $(playerData[evt.player].element).find('.outline');
    outline.animate({
     svgStroke: actionColours[evt.action] || 'rgb(50,255,50)'
    },500, function(){
     outline.animate({
       svgStroke:  'rgb(81,81,81)'
     }, 500);
    });
    
    if(evt.action == 'pass') {
      var pOne = playerData[evt.player],
          pTwo = playerData[nextValidPeek().player];
      if(pOne && pTwo) {
        drawLink(pOne,pTwo);
      }
    }
    
    // $(playerData[evt.player].element).animate({
    //      svgOpacity: 0.5
    //    },500, function(){
    //      $(playerData[evt.player].element).animate({
    //        svgOpacity: 1
    //      }, 500);
    //    });
  };
  
  
  
  var ticker = setInterval(tick,250);
  window.ticker = ticker;
});
