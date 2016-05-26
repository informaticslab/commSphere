angular.module('app').controller('previewReportCtrl', function($scope,$rootScope) {

$scope.chartImgUrls = [];
$scope.numberOfColumns = getCheckedColCounts();
$scope.sortedCols = getSortedColumns();

$scope.customizedData = JSON.parse(JSON.stringify($scope.eventData));
console.log($scope.customizedData);
console.log($scope.customizedDoc);
$scope.previewChartConfigs = JSON.parse(JSON.stringify($scope.customizedDoc.chartConfigs));

for (var i = 0 ; i < $scope.previewChartConfigs.length; i++){

  	if ($scope.customizedDoc.chartConfigs[i].checked) {
  	
  	    var chart = $scope.hiddenChartConfigs[i].getHighcharts();
  	    var chart_svg = chart.getSVG();                            
	    var canvas = document.getElementById('canvas');
	    // Get chart aspect ratio
	    var c_ar = chart.chartHeight / chart.chartWidth;

	    // Set canvas size
	     canvas.width = chart.chartWidth*2;
	     canvas.height = canvas.width*c_ar;
	     // canvas.width = 1200;
	     // canvas.height = 800;
	    
	    //canvg(canvas, chart_svg);
	    canvg(canvas, chart_svg, {
	        ignoreDimensions: true,
	        scaleWidth: canvas.width,
	        scaleHeight: canvas.height
	    });

	    $scope.chartImgUrls.push(canvas.toDataURL("image/png"));
	    console.log($scope.chartImgUrls);
	}
}


//$scope.previewColumns = $scope.previewGenerateColumnDefs();
$scope.filterSelected = function(items) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
        if ($scope.customizedDoc.checkedColumns.hasOwnProperty(items[i])) {
            if ($scope.customizedDoc.checkedColumns[items[i]].checked) {	
         	   result.push(items[i]);
        	}
        }
    }
    return result;
}

$scope.percentChanged = function(row,col) {
	var columnArry = $scope.sortedCols;
	var curIdx = columnArry.indexOf(col);
    var delta = 0;
    if ( curIdx > -1) { // col exist in array
 		if (curIdx  === 0) { // check if this is the first element
 		   // no percent change calculation	
 		}
 		else {
 			var previousValue =  row[columnArry[curIdx - 1]];
 			var currentValue = row[col];
 			if (currentValue == 0 || isNaN(currentValue) || isNaN(previousValue) ) {
        		 delta = -1;
 			}
 			else {
 				delta = Math.floor((currentValue - previousValue) / currentValue *100);
 			}
 		}
	}
	if (delta > 0) {
		return '(+'+delta+'%)';
	}
	else if(delta ==0) {
		return '(nc%)';
	}
	else if(delta == -1){
		return ' '
	}
	else {
		return '('+delta+'%)';
	}
}

$scope.print = function() {
	
	printElement(document.getElementById('printThis'));

	window.print();

}

function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    
    $printSection.innerHTML = "";
    
    $printSection.appendChild(domClone);
}

$scope.PrintContent=function()
{
var DocumentContainer = document.getElementById('printThis');
console.log(DocumentContainer);
var WindowObject = window.open("", "PrintWindow",
"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
WindowObject.document.writeln(DocumentContainer.innerHTML);
WindowObject.document.write('<link rel="stylesheet" type="text/css" href="../css/custom.css">')
WindowObject.document.close();
WindowObject.focus();
WindowObject.print();
WindowObject.close();
}

function getCheckedColCounts() {
	var count = 0;
	for(col in $scope.customizedDoc.checkedColumns) {
		if ($scope.customizedDoc.checkedColumns[col].checked) {
			count++
		}
	}
 	return count
}

function getSortedColumns() {

   var columnArry = [];
   // pick a grid to iterate
   var cols =  $scope.eventData.colDisplayNames;
   if (cols) {  // at least one grid exist
       for (var columnName in cols ) {
          if (cols.hasOwnProperty(columnName)) {
            if (columnName !== '$$hashKey' && columnName != 'label')  {
                columnArry.push(columnName);
            } 
          }
       }

    }
    columnArry.sort();
    return columnArry;
}
	////END GRID///


  $scope.makePDF = function() {
    var docDefinition = {
      content: [
        {
          text: $scope.eventdoc.reportMeta.title,
          style: 'header'
        },
        {
          text: $scope.eventdoc.reportMeta.type,
          style: 'subheader'
        },
       	{
       		image: $scope.chartImgUrls[0]
       	}
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true
        },
        subheader: {
          fontSize: 12,
          bold: true
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  };

});

