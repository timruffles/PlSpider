dojo.addOnLoad(function() {
  
  var d = dojo,
      $ = dojo.query,
      c = function(l) {console.log(l)};
      
  
  d.xhrGet({url:'../svg/manuaway.svg'})
   .addCallback(function(result) {
     $('#root').addContent(result.body);
   });
});