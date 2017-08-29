$( function() {

  $('textarea').on('dragover', function(e) {
    e.preventDefault(e);
    e.stopPropagation(e);
  });

  $('textarea').on('drop', function(e) {
    e.preventDefault(e);
    e.stopPropagation(e);
    $textarea = this;
    var files = e.originalEvent.dataTransfer.files;
    var reader = new FileReader();
    reader.onload = function(e) {
      $textarea.value = e.target.result;
    }
    for (var i=0;i<files.length;i++) {
      reader.readAsText(files[i]);
    }
  });

  $('.btn').click(function(){
    var $btn = $(this).button('loading');
    setTimeout(function() {
      var weighted_edges = [];
      var data = $('textarea').val();
      var list = data.split("\n");
      var rows = '';
      var allInfo = '';
      list.forEach(function(l){
        var items = l.split(",");
        weighted_edges.push(items);
      });

      $('tbody').empty();

      // console.log(weighted_edges);
      var G = new jsnx.Graph();
      G.addWeightedEdgesFrom(weighted_edges);
      var betweenness = jsnx.betweennessCentrality(G)._stringValues;
      var clustering = jsnx.clustering(G)._stringValues;
      var degree = G.degree()._stringValues;
      var eigenvector = jsnx.eigenvectorCentrality(G)._stringValues;
      var density = jsnx.density(G);
      var averageClustering = jsnx.averageClustering(G);
      var transitivity = jsnx.transitivity(G);
      var info = jsnx.info(G);
      var degreeSorted = reverse_sort(degree);
      var betweennessSorted = reverse_sort(betweenness);
      var eigenvectorSorted = reverse_sort(eigenvector);
      var clusteringSorted = reverse_sort(clustering);
      G.nodes().forEach(function(node){
        var row = '<tr>';
        row = row + '<td>' + node + '</td>'
        row = row + '<td>' + degree[node] + /*' (rank: ' + degreeSorted.indexOf(node).toString() + ')*/'</td>';
        row = row + '<td>' + betweenness[node].toFixed(10) + ' (' + betweennessSorted.indexOf(node).toString() + ')</td>';
        row = row + '<td>' + eigenvector[node].toFixed(10) + ' (' + eigenvectorSorted.indexOf(node).toString() + ')</td>';
        row = row + '<td>' + clustering[node].toFixed(10) + ' (' + clusteringSorted.indexOf(node).toString() + ')</td>';
        rows = rows + row
      });
      $('tbody').append(rows);
      $.bootstrapSortable({ applyLast: true });
      $.bootstrapSortable({ sign: 'reversed' })
      $('.collapse').collapse('show');
      $btn.button('reset');
      allInfo = allInfo + "<div>"+info+"</div>";
      allInfo = allInfo + "<div>Density: "+density.toFixed(8)+"</div>";
      allInfo = allInfo + "<div>Avg Clustering Coefficient: "+averageClustering.toFixed(8)+"</div>";
      allInfo = allInfo + "<div>Transitivity: "+transitivity.toFixed(8)+"</div>";
      $('.panel-body').append(allInfo);
    }, 2000);

  });


});

function reverse_sort(dict) {
  return Object.keys(dict).sort(function(a,b) {return dict[b]-dict[a]});
}
