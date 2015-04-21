commSphereApp.controller('coorDashCtrl',['$scope', function($scope) {

    
  $scope.instance = {
  "_id": "11",
  "eventName": "Japan Earthquake",
  "eventId": "12345",
  "eventInstanceId": "jp2",
  "categories": {
    "web": {
      "assignedTo": "John",
      "displayValue": "web",
      "topics": {
        "Merging Issues": {
          "displayValue": "Merging Issues",
          "bullets": {
            "4": {
              "displayValue": "4"
            },
            "5": {
              "displayValue": "5"
            },
            "6": {
              "displayValue": "6"
            }
          },
          "subTopics": {
            "US": {
              "displayValue": "US",
              "bullets": {
                "This is a bullet 1": {
                  "displayValue": "This is a bullet 1",
                  "subBullets": {
                    "this is 1 sub bullet of bullet 1": {
                      "displayValue": "this is 1 sub bullet of bullet 1"
                    },
                    "this is 2 sub bullet of bullet 1": {
                      "displayValue": "this is 2 sub bullet of bullet 1"
                    }
                  }
                },
                "this is bullet 2": {
                  "displayValue": "this is bullet 2"
                }
              }
            },
            "Liberia": {
              "displayValue": "Liberia",
              "bullets": {
                "This is a bullet 1": {
                  "displayValue": "This is a bullet 1",
                  "subBullets": {
                    "this is 1 sub bullet of bullet 1": {
                      "displayValue": "this is 1 sub bullet of bullet 1"
                    },
                    "this is 2 sub bullet of bullet 1": {
                      "displayValue": "this is 2 sub bullet of bullet 1"
                    }
                  }
                },
                "this is bullet 2": {
                  "displayValue": "this is bullet 2"
                }
              }
            }
          }
        }
      }
    }
  }
};

//if ($scope.a) {
//    for (cat in $scope.a.categories) {
//        console.log("CATEGORY", cat);
//        if ($scope.a.categories[cat].topics) {
//            for (topic in $scope.a.categories[cat].topics) {
//                console.log("TOPIC", topic);
//                if ($scope.a.categories[cat].topics[topic].subTopics) {
//                    for (stop in $scope.a.categories[cat].topics[topic].subTopics) {
//                        console.log("SUB TOPIC", stop);
//                        if ($scope.a.categories[cat].topics[topic].subTopics[stop].bullets) {
//                            for (bull in $scope.a.categories[cat].topics[topic].subTopics[stop].bullets) {
//                                console.log("BULLET", bull);
//                                if ($scope.a.categories[cat].topics[topic].subTopics[stop].bullets[bull].subBullets) {
//                                    for (sbull in $scope.a.categories[cat].topics[topic].subTopics[stop].bullets[bull].subBullets) {
//                                        console.log("SUB BULLET", sbull);
//                                    }
//                                }
//                            }
//                        }
//
//                    }
//                }
//            }
//        }
//    }
//}
//}
//    $scope.categories = 
//     [
//        {name:'News',active:true},
//        {name:'Social Media',active:false},
//        {name:'Data',active:false}
//     ];
}]);