$(document).ready(function() {
  
  var playerData = {};
  homeTeam.forEach(function(player) { playerData[player] = {events:[]}; }),
  awayTeam.forEach(function(player) { playerData[player] = {events:[]}; });
      
  $('#svgBase').svg({
    settings: {
      height: 1000
    },
    onLoad: function(svg) {
      var rowY = 0,
          rowX = 0;
      [[homeTeam,'Home Team'],[awayTeam,'Away Team']].forEach(function(setup) {
        var name = setup[1],
            players = setup[0];
            
            
        players.forEach(function(playerName) {
          // FIXME obviously not great to use lots of the same ids...
          svg.add($('#kit'))
          var id  = _.uniqueId(),
              kit = svg.getElementById('kit'),
              dataTable = $('#dataTable').clone().attr('id',_.uniqueId());
              
          $('#svgBase').append(dataTable);
          
          kit.setAttribute('id',id);
          kit.setAttribute('x',rowX);
          kit.setAttribute('y',rowY)
          //svg.rect(rowX + 10,rowY + 100,60,100,{fill:'none',stroke:'blue'})
          playerData[playerName]['element'] = kit;
          playerData[playerName]['dataTable'] = dataTable;
          
          dataTable.css({
            display:'block',
            left: rowX - 25  + 'px',
            top:  rowY + 100 + 'px'
          });
          rowX += 80;
        })
        rowY += 250;
        rowX = 0;
      });
    }
  });
  
  
  console.log(playerData);
  function tick() {
    var needValid = true;
    while(needValid) {
      var evt = matchEvents.pop();
      if(evt.player && evt.team){ 
        needValid = false;
        // console.log('found') 
      }
      if(matchEvents.length == 0) {
        clearInterval(ticker);
        // console.log('done')
      }
    }
    $('#action').html(evt.action);
    if(['pass','interception','foul'].indexOf(evt.action) != -1) {
      var dataPoint = $(playerData[evt.player].dataTable).find('.' + evt.action + ' .data');
      dataPoint.html(Number(dataPoint.html()) + 1);
    }
    $(playerData[evt.player].element).animate({
      svgOpacity: 0.5
    },500, function(){
      $(playerData[evt.player].element).animate({
        svgOpacity: 1
      }, 500);
    });
  };
  
  
  
  var ticker = setInterval(tick,1000);
  
});
