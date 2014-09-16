'use strict';

// https://github.com/juantascon/jquery-handsontable-csv
module.exports = {
    makeHeader: function(data) {
      if(!data[0]) throw new Error('data should not be empty')
      var header = []
      Object.keys(data[0]).forEach(function(key) {
        header.push(key)
      })
      return header
    },
    makeColumns: function(colHeaders) {
      if(!colHeaders) throw new Error('data should not be empty')
      var columns = []
      colHeaders.forEach(function(header) {
        columns.push({data: header})
      })
      return columns
    },
    string: function(instance) {
        var headers = instance.getColHeader();

        var csv = ""
        csv += headers.join(",") + "\n";

        // ignore last line
        for (var i = 0; i < instance.countRows() - 1 ; i++) {
            var row = [];
            for (var h in headers) {
                var prop = instance.colToProp(h)
                var value = instance.getDataAtRowProp(i, prop)
                row.push(value)
            }

            csv += row.join(",")
            csv += "\n";
        }

        return csv;
    },
    download: function(instance, filename) {
        var csv = handsontable2csv.string(instance)
        var link = document.createElement("a");
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv));
        link.setAttribute("download", filename);
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
}