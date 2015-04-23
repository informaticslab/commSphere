commSphereApp.controller('dashCtrl', ['$scope', '$modal','$http', function($scope, $modal,$http) {

$scope.instances = {};
if ($scope.userType = 'Coordinator') {    
    $http.get('/api/events/active').
    success(function(data, status, headers, config) {
       $scope.instances = data;
    }).
  error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
}
//$scope.instances = [{
//  "_id": "11",
//  "eventName": "Japan Earthquake",
//  "eventId": "12345",
//  "eventInstanceId": "jp2",
//  "isDraft": false,
//  "eventInstanceStatus" : 0,
//  "categories": {
//    "web": {
//      "assignedTo": "John",
//      "categoryCompleted": false,
//      "displayValue": "web",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//    },
// 
//    
//    "Social Media": {
//      "assignedTo": "John",
//        "categoryCompleted": false,
//      "displayValue": "Social Media",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//  },
//   
//    "Data": {
//      "assignedTo": "John",
//        "categoryCompleted": true,
//      "displayValue": "Data",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//    }
//  }
//},
//   {
//  "_id": "11",
//  "eventName": "Japan Earthquake",
//  "eventId": "12345",
//  "eventInstanceId": "jp3",
//  "isDraft": false,
//  "eventInstanceStatus" : 0,
//  "categories": {
//    "web": {
//      "assignedTo": "Trung",
//    "categoryCompleted": true,
//      "displayValue": "web",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//    },
//      "Social Media": {
//      "assignedTo": "John",
//        "categoryCompleted": false,
//      "displayValue": "Social Media",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//  }
//  }
//},
//{
//  "_id": "12",
//  "eventName": "Ebola 2015",
//  "eventId": "12345",
//  "eventInstanceId": "Eb1",
//  "isDraft": false,
//    "eventInstanceStatus" : 0,
//  "categories": {
//    "web": {
//      "assignedTo": "Michael",
//      "categoryCompleted": false,
//      "displayValue": "web",
//      "topics": {
//        "Merging Issues": {
//          "displayValue": "Merging Issues",
//          "bullets": {
//            "4": {
//              "displayValue": "4"
//            },
//            "5": {
//              "displayValue": "5"
//            },
//            "6": {
//              "displayValue": "6"
//            }
//          },
//          "subTopics": {
//            "US": {
//              "displayValue": "US",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            },
//            "Liberia": {
//              "displayValue": "Liberia",
//              "bullets": {
//                "This is a bullet 1": {
//                  "displayValue": "This is a bullet 1",
//                  "subBullets": {
//                    "this is 1 sub bullet of bullet 1": {
//                      "displayValue": "this is 1 sub bullet of bullet 1"
//                    },
//                    "this is 2 sub bullet of bullet 1": {
//                      "displayValue": "this is 2 sub bullet of bullet 1"
//                    }
//                  }
//                },
//                "this is bullet 2": {
//                  "displayValue": "this is bullet 2"
//                }
//              }
//            }
//          }
//        }
//      }
//    }
//  }
//}];
    
//var ProgressStatus = function(categories)
//    var categoriesCount = categories.length;
//    var completedCount = 0;
//    categories.forEach(function(category) {
//          if (category.categoryCompleted)   
//              completedCount += 1;      
//    }
//  )}
// refactoring
//for (oneInstance in $scope.instances)
//{
//    if ($scope.instances.hasOwnProperty(oneInstance.displayValue))
//    {
//        var categoryCount = 0;
//        var completedCount = 0;
//        for (category in oneInstance.categories) {
//             if (oneInstance.categories.hasOwnProperty(category)) {
//                 categoryCount++;
//                 console.log(oneInstance.categories[category].categoryCompleted);
//                 if (oneInstance.categories[category].categoryCompleted)   
//                           completedCount ++;      
//             }
//        }
//        console.log(oneInstance);
//    }
//};
    
$scope.instances.forEach(function(oneInstance){
    var categoryCount = 0;
    var completedCount = 0;
    for (category in oneInstance.categories) {
             if (oneInstance.categories.hasOwnProperty(category)) {
                 categoryCount++;
                 console.log(oneInstance.categories[category].categoryCompleted);
                 if (oneInstance.categories[category].categoryCompleted)   
                           completedCount ++;      
             }
    }
      oneInstance.eventInstanceStatus = completedCount / categoryCount;
//    console.log('category count ' + categoryCount);
//    console.log('completed count = ' + completedCount);
    
});
//    console.log(ProgressStatus(oneInstance.categories));
  $scope.createEvent = function (size) {

      var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: CreateEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static'
      });
    
    }

}]);

var CreateEventModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};